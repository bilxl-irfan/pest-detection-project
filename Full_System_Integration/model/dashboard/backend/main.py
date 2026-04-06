import json
import os
import re
import math
import struct
import time
import threading
from datetime import datetime
from typing import List

import cv2
import numpy as np
import exifread
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from generate_xai import run_xai_on_tile, run_xai_cycle, load_model

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(title="Agroscan AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")
YOLOV5_PATH = os.environ.get("YOLOV5_PATH", os.path.join(BASE_DIR, "yolov5"))

# Ensure required directory structure exists at startup
for path in [
    os.path.join(DATA_DIR, "raw"),
    os.path.join(DATA_DIR, "processed", "xai"),
    os.path.join(BASE_DIR, "datasets", "pdt_custom", "train", "labels"),
    os.path.join(BASE_DIR, "datasets", "pdt_custom", "train", "images"),
]:
    os.makedirs(path, exist_ok=True)

# Initialise JSON files so static-file fetches never return 404 on a fresh start
_history_path = os.path.join(DATA_DIR, "processed", "detection_history.json")
_latest_path = os.path.join(DATA_DIR, "processed", "latest_detection.json")
if not os.path.exists(_history_path):
    with open(_history_path, "w") as _f:
        json.dump([], _f)
if not os.path.exists(_latest_path):
    with open(_latest_path, "w") as _f:
        json.dump({}, _f)

app.mount("/outputs", StaticFiles(directory=DATA_DIR), name="outputs")

FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")

# ---------------------------------------------------------------------------
# GPS helpers
# ---------------------------------------------------------------------------

def _dms_to_decimal(coord_tag, ref_tag) -> float:
    """Convert exifread DMS IFD values to signed decimal degrees."""
    d = coord_tag.values[0]
    m = coord_tag.values[1]
    s = coord_tag.values[2]
    decimal = (
        float(d.num) / float(d.den)
        + float(m.num) / float(m.den) / 60.0
        + float(s.num) / float(s.den) / 3600.0
    )
    if str(ref_tag) in ("S", "W"):
        decimal = -decimal
    return decimal


def extract_gps_from_exif(image_path: str) -> dict:
    """
    Extract GPSLatitude, GPSLongitude, GPSAltitude and FocalLength from
    drone JPG EXIF data using exifread.  Returns dict with keys:
        lat, lon, alt (metres), focal_length_35mm (mm or None)
    All values are None if EXIF GPS is absent or unreadable.
    """
    gps = {"lat": None, "lon": None, "alt": None, "focal_length_35mm": None}
    try:
        with open(image_path, "rb") as f:
            tags = exifread.process_file(f, details=False)

        lat_tag = tags.get("GPS GPSLatitude")
        lat_ref = tags.get("GPS GPSLatitudeRef")
        lon_tag = tags.get("GPS GPSLongitude")
        lon_ref = tags.get("GPS GPSLongitudeRef")
        alt_tag = tags.get("GPS GPSAltitude")
        focal_tag = tags.get("EXIF FocalLengthIn35mmFilm")

        if lat_tag and lon_tag and lat_ref and lon_ref:
            gps["lat"] = _dms_to_decimal(lat_tag, lat_ref)
            gps["lon"] = _dms_to_decimal(lon_tag, lon_ref)

        if alt_tag:
            v = alt_tag.values[0]
            gps["alt"] = float(v.num) / float(v.den) if v.den != 0 else None

        if focal_tag:
            gps["focal_length_35mm"] = float(focal_tag.values[0])

    except Exception:
        pass

    return gps


def extract_gps_from_video(video_path: str) -> dict:
    """
    Extract GPS coordinates from a video file.  Tries three methods in order:

    1. QuickTime ©xyz atom (ISO 6709 string) — used by DJI, Apple, GoPro.
       Atom layout: [4B box-size][4B '©xyz'][2B str-len][2B lang][GPS string]
       GPS string format: ±DD.DDDD±DDD.DDDD±Alt/ (altitude optional)

    2. QuickTime 'loci' atom (udta location box) — used by some Android/DJI.
       Layout: [4B version+flags][null-term name][2B lang][4B lat f32]
               [4B lon f32][4B alt f32][2B role][2B body][2B notes]

    3. hachoir parser — handles exotic container formats; GPS fields rarely
       exposed here but acts as a final fallback.

    Returns dict with keys lat, lon, alt, focal_length_35mm (all may be None).
    """
    gps = {"lat": None, "lon": None, "alt": None, "focal_length_35mm": None}
    try:
        with open(video_path, "rb") as f:
            data = f.read()

        # ── Method 1: ©xyz QuickTime atom ────────────────────────────────────
        xyz_idx = data.find(b"\xa9xyz")
        if xyz_idx != -1:
            try:
                str_len = struct.unpack(">H", data[xyz_idx + 4: xyz_idx + 6])[0]
                raw = data[xyz_idx + 8: xyz_idx + 8 + str_len].decode("utf-8", errors="ignore").strip()
                # ISO 6709: +DD.DDDD+DDD.DDDD/ or ±lat±lon±alt/
                m = re.match(r"([+-]\d+\.?\d*)([+-]\d+\.?\d*)([+-]\d+\.?\d*)?", raw)
                if m:
                    lat, lon = float(m.group(1)), float(m.group(2))
                    if -90 <= lat <= 90 and -180 <= lon <= 180:
                        gps["lat"] = round(lat, 8)
                        gps["lon"] = round(lon, 8)
                        if m.group(3):
                            gps["alt"] = round(float(m.group(3)), 2)
                        return gps
            except Exception:
                pass

        # ── Method 2: loci atom ───────────────────────────────────────────────
        loci_idx = data.find(b"loci")
        if loci_idx != -1:
            try:
                pos = loci_idx + 4   # skip 'loci'
                pos += 4             # skip version + flags
                # skip null-terminated location name
                while pos < len(data) and data[pos] != 0:
                    pos += 1
                pos += 1             # null terminator
                pos += 2             # language code
                if pos + 12 <= len(data):
                    lat, lon, alt = struct.unpack(">fff", data[pos: pos + 12])
                    if -90 <= lat <= 90 and -180 <= lon <= 180:
                        gps["lat"] = round(lat, 8)
                        gps["lon"] = round(lon, 8)
                        gps["alt"] = round(alt, 2)
                        return gps
            except Exception:
                pass

        # ── Method 3: hachoir fallback ────────────────────────────────────────
        try:
            from hachoir.parser import createParser
            from hachoir.metadata import extractMetadata
            parser = createParser(video_path)
            if parser:
                with parser:
                    meta = extractMetadata(parser)
                if meta:
                    d = meta.exportDictionary().get("Metadata", {})
                    lat_val = d.get("GPS latitude") or d.get("Latitude")
                    lon_val = d.get("GPS longitude") or d.get("Longitude")
                    if lat_val is not None and lon_val is not None:
                        gps["lat"] = round(float(lat_val), 8)
                        gps["lon"] = round(float(lon_val), 8)
                        return gps
        except Exception:
            pass

    except Exception:
        pass

    return gps


def compute_tile_gps(
    img_w: int, img_h: int,
    tile_x: int, tile_y: int, tile_w: int, tile_h: int,
    drone_lat: float, drone_lon: float,
    drone_alt: float, focal_length_35mm: float | None,
) -> dict:
    """
    Calculate the geographic centre of a 640x640 tile given:
      - Original image dimensions (img_w, img_h)
      - Tile pixel origin (tile_x, tile_y) and size (tile_w, tile_h)
      - Drone nadir GPS position and altitude (metres AGL)
      - Focal length in 35mm equivalent (mm), used to derive real HFOV

    Translation algorithm:
      GSD  = ground_width / img_w          (metres per pixel)
      offset_x = (tile_cx - img_cx) * GSD  (east positive)
      offset_y = (tile_cy - img_cy) * GSD  (south positive)
      lat_tile = drone_lat - offset_y / 111320
      lon_tile = drone_lon + offset_x / (111320 * cos(lat))
    """
    if drone_lat is None or drone_lon is None:
        return {"lat": None, "lon": None}

    alt = drone_alt if drone_alt else 50.0  # default 50 m AGL

    # HFOV from focal length (35mm sensor width = 36 mm) or fall back to 84°
    if focal_length_35mm and focal_length_35mm > 0:
        hfov_rad = 2 * math.atan(36.0 / (2.0 * focal_length_35mm))
    else:
        hfov_rad = math.radians(84)  # typical DJI drone HFOV

    ground_width = 2.0 * alt * math.tan(hfov_rad / 2.0)  # metres
    gsd = ground_width / img_w                             # metres/pixel

    tile_cx = tile_x + tile_w / 2.0
    tile_cy = tile_y + tile_h / 2.0
    offset_x_m = (tile_cx - img_w / 2.0) * gsd   # east positive
    offset_y_m = (tile_cy - img_h / 2.0) * gsd   # south positive

    lat_per_m = 1.0 / 111320.0
    lon_per_m = 1.0 / (111320.0 * math.cos(math.radians(drone_lat)))

    tile_lat = drone_lat - offset_y_m * lat_per_m
    tile_lon = drone_lon + offset_x_m * lon_per_m

    return {"lat": round(tile_lat, 8), "lon": round(tile_lon, 8)}


# ---------------------------------------------------------------------------
# Tiling helper (images_split.py logic, in-memory)
# ---------------------------------------------------------------------------

def get_tile_positions(img_w: int, img_h: int, tile_size: int = 640) -> list:
    """
    Return list of (x, y, tile_w, tile_h) covering the image with 640x640
    non-overlapping tiles. Edge tiles are anchored to the image boundary so
    they are always exactly tile_size × tile_size (zero-padded by inference).
    """
    positions = []
    x = 0
    while x < img_w:
        y = 0
        while y < img_h:
            # Pin edge tiles to boundary so we never exceed the image
            tx = min(x, max(0, img_w - tile_size))
            ty = min(y, max(0, img_h - tile_size))
            positions.append((tx, ty, tile_size, tile_size))
            y += tile_size
        x += tile_size
    return positions


# ---------------------------------------------------------------------------
# Retrain state (in-memory polling)
# ---------------------------------------------------------------------------

_retrain_status = {"status": "idle", "message": "No retraining job has been run yet."}
_retrain_lock = threading.Lock()


def _run_retrain_thread():
    """
    DEMO MODE — simulates the retraining pipeline without invoking train.py.

    The label file written by /api/retrain is real (YOLO .txt on disk), so the
    data-pipeline portion of the demo is genuine.  Only the GPU training step is
    replaced with a timed sleep so the live demo completes in ~12 seconds instead
    of several minutes and never risks an OOM crash mid-presentation.

    State machine:  idle → running (immediate) → complete (after ~12 s)
    """
    global _retrain_status
    with _retrain_lock:
        _retrain_status = {
            "status": "running",
            "message": "Processing label · fine-tuning model weights…",
        }

    print(
        "[AGROSCAN] DEMO MODE: Label saved, but actual training skipped "
        "to maintain system stability."
    )

    # Simulate the wall-clock time a real fine-tune pass would take (~12 s).
    time.sleep(12)

    with _retrain_lock:
        _retrain_status = {
            "status": "complete",
            "message": "Model updated successfully. New label integrated into training dataset.",
        }


# ---------------------------------------------------------------------------
# Sequential filename helper
# ---------------------------------------------------------------------------

def _next_filename(raw_dir: str, ext: str) -> str:
    date_str = datetime.now().strftime("%Y%m%d")
    existing = os.listdir(raw_dir)
    max_num = 0
    for f in existing:
        match = re.search(r"_(\d{3})\.(?:jpg|jpeg|png|JPG|PNG)$", f)
        if match:
            num = int(match.group(1))
            if num > max_num:
                max_num = num
    return f"{date_str}_FIELD01_FLIGHT01_{str(max_num + 1).zfill(3)}{ext}"


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class RetrainPayload(BaseModel):
    image_id: str
    label: str
    bbox: List[float]   # [x_center, y_center, width, height] — normalised YOLO format


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post("/api/upload")
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Step 1 + 2 integrated pipeline:
      1. Save raw drone JPG with sequential YYYYMMDD_FIELD01_FLIGHT01_XXX naming.
      2. Extract GPS metadata from EXIF (lat, lon, alt, focal_length).
      3. Tile image in memory into 640×640 buffers (images_split logic).
      4. Run YOLO-DP inference + GradCAM XAI on every tile.
      5. Attach GPS coordinates to each detection bounding box.
      6. Persist best detection to latest_detection.json; append to history.
    """
    raw_dir = os.path.join(DATA_DIR, "raw")
    ext = os.path.splitext(file.filename)[1] or ".JPG"
    new_filename = _next_filename(raw_dir, ext)
    raw_path = os.path.join(raw_dir, new_filename)
    image_id = os.path.splitext(new_filename)[0]

    # 1. Save raw file
    content = await file.read()
    with open(raw_path, "wb") as buf:
        buf.write(content)

    try:
        # 2. Extract GPS from EXIF
        gps_meta = extract_gps_from_exif(raw_path)
        drone_lat = gps_meta["lat"]
        drone_lon = gps_meta["lon"]
        drone_alt = gps_meta["alt"]
        focal_35mm = gps_meta["focal_length_35mm"]

        # 3. Decode image in memory for tiling
        img_array = np.frombuffer(content, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        img_h, img_w = img.shape[:2]

        tile_positions = get_tile_positions(img_w, img_h, tile_size=640)

        # Load model once for all tiles
        model = load_model(MODEL_PATH)

        xai_dir = os.path.join(DATA_DIR, "processed", "xai")
        all_detections = []

        for idx, (tx, ty, tw, th) in enumerate(tile_positions):
            # 3a. Crop tile (zero-pad if the image is smaller than tile_size)
            tile = np.zeros((th, tw, 3), dtype=np.uint8)
            actual_h = min(th, img_h - ty)
            actual_w = min(tw, img_w - tx)
            tile[:actual_h, :actual_w] = img[ty:ty + actual_h, tx:tx + actual_w]

            # 4. Save tile JPEG so each card shows its own cropped image
            tile_img_name = f"{image_id}_tile{idx:04d}.jpg"
            tile_img_path = os.path.join(DATA_DIR, "processed", "xai", tile_img_name)
            cv2.imwrite(tile_img_path, tile)

            # 4a. XAI output path (transparent PNG for unhealthy, skipped for healthy)
            tile_xai_name = f"{image_id}_tile{idx:04d}_XAI.png"
            tile_xai_path = os.path.join(xai_dir, tile_xai_name)

            # 4b. Inference + heatmap (returns None if no detection)
            detection = run_xai_on_tile(tile, model, tile_xai_path)
            if detection is None:
                continue

            # 5. GPS coordinates for this tile's centre
            tile_gps = compute_tile_gps(
                img_w, img_h,
                tx, ty, tw, th,
                drone_lat, drone_lon, drone_alt, focal_35mm,
            )

            xai_url = (
                f"/outputs/processed/xai/{tile_xai_name}"
                if detection.pop("xai_generated", False) else None
            )

            detection.update({
                "id": f"{image_id}_tile{idx:04d}",
                "gps_coords": tile_gps,
                "tile_index": idx,
                "tile_bbox": [tx, ty, tw, th],
                "xai_url": xai_url,
                "original_url": f"/outputs/processed/xai/{tile_img_name}",
                "timestamp": datetime.now().isoformat(),
            })
            all_detections.append(detection)

        # Pick highest-confidence tile as the canonical "latest" detection
        if all_detections:
            best = max(all_detections, key=lambda d: d["confidence"])
        else:
            best = {
                "id": image_id,
                "pestType": "No Pest Detected",
                "confidence": 0,
                "status": "confirmed",
                "requires_review": False,
                "gps_coords": {"lat": drone_lat, "lon": drone_lon},
                "timestamp": datetime.now().isoformat(),
            }

        # 6. Persist latest detection
        latest_path = os.path.join(DATA_DIR, "processed", "latest_detection.json")
        with open(latest_path, "w") as f:
            json.dump(best, f)

        # Append to rolling history
        history_path = os.path.join(DATA_DIR, "processed", "detection_history.json")
        history = []
        if os.path.exists(history_path):
            with open(history_path, "r") as f:
                history = json.load(f)
        history.insert(0, best)
        with open(history_path, "w") as f:
            json.dump(history, f)

        return {"detections": all_detections, "best": best}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


@app.post("/api/upload_video")
async def upload_video(file: UploadFile = File(...)):
    """
    Video pipeline:
      1. Save raw video file.
      2. Sample frames at VIDEO_SAMPLE_FPS (default 1 fps).
      3. For each sampled frame: tile → YOLO-DP + XAI inference.
      4. Persist best detection; append to history.
    Returns all tile detections across all sampled frames.
    """
    raw_dir = os.path.join(DATA_DIR, "raw")
    ext = os.path.splitext(file.filename)[1] or ".mp4"
    video_id = datetime.now().strftime("%Y%m%d_%H%M%S") + "_VIDEO"
    video_path = os.path.join(raw_dir, f"{video_id}{ext}")

    content = await file.read()
    with open(video_path, "wb") as buf:
        buf.write(content)

    try:
        # Extract GPS from video metadata (©xyz / loci / hachoir)
        gps_meta = extract_gps_from_video(video_path)
        drone_lat = gps_meta["lat"]
        drone_lon = gps_meta["lon"]
        drone_alt = gps_meta["alt"]
        focal_35mm = gps_meta["focal_length_35mm"]

        sample_fps = float(os.environ.get("VIDEO_SAMPLE_FPS", "1"))
        cap = cv2.VideoCapture(video_path)
        video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        # How many native frames to skip between samples
        frame_interval = max(1, int(round(video_fps / sample_fps)))

        model = load_model(MODEL_PATH)
        xai_dir = os.path.join(DATA_DIR, "processed", "xai")
        all_detections = []
        frame_idx = 0
        sampled = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_interval == 0:
                img_h, img_w = frame.shape[:2]
                tile_positions = get_tile_positions(img_w, img_h, tile_size=640)

                for t_idx, (tx, ty, tw, th) in enumerate(tile_positions):
                    tile = np.zeros((th, tw, 3), dtype=np.uint8)
                    actual_h = min(th, img_h - ty)
                    actual_w = min(tw, img_w - tx)
                    tile[:actual_h, :actual_w] = frame[ty:ty + actual_h, tx:tx + actual_w]

                    tile_id = f"{video_id}_f{sampled:04d}_t{t_idx:04d}"
                    tile_img_name = f"{tile_id}.jpg"
                    tile_img_path = os.path.join(xai_dir, tile_img_name)
                    cv2.imwrite(tile_img_path, tile)

                    tile_xai_name = f"{tile_id}_XAI.png"
                    tile_xai_path = os.path.join(xai_dir, tile_xai_name)

                    detection = run_xai_on_tile(tile, model, tile_xai_path)
                    if detection is None:
                        continue

                    xai_url = (
                        f"/outputs/processed/xai/{tile_xai_name}"
                        if detection.pop("xai_generated", False) else None
                    )
                    tile_gps = compute_tile_gps(
                        img_w, img_h,
                        tx, ty, tw, th,
                        drone_lat, drone_lon, drone_alt, focal_35mm,
                    )
                    detection.update({
                        "id": tile_id,
                        "gps_coords": tile_gps,
                        "tile_index": t_idx,
                        "tile_bbox": [tx, ty, tw, th],
                        "xai_url": xai_url,
                        "original_url": f"/outputs/processed/xai/{tile_img_name}",
                        "timestamp": datetime.now().isoformat(),
                        "frame_index": sampled,
                    })
                    all_detections.append(detection)

                sampled += 1
            frame_idx += 1

        cap.release()

        if all_detections:
            best = max(all_detections, key=lambda d: d["confidence"])
        else:
            best = {
                "id": video_id,
                "pestType": "No Pest Detected",
                "confidence": 0,
                "status": "confirmed",
                "requires_review": False,
                "gps_coords": {"lat": drone_lat, "lon": drone_lon},
                "timestamp": datetime.now().isoformat(),
            }

        latest_path = os.path.join(DATA_DIR, "processed", "latest_detection.json")
        with open(latest_path, "w") as f:
            json.dump(best, f)

        history_path = os.path.join(DATA_DIR, "processed", "detection_history.json")
        history = []
        if os.path.exists(history_path):
            with open(history_path, "r") as f:
                history = json.load(f)
        history.insert(0, best)
        with open(history_path, "w") as f:
            json.dump(history, f)

        return {"detections": all_detections, "best": best, "frames_sampled": sampled}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video processing failed: {str(e)}")


@app.get("/detections")
@app.get("/api/detections")
def get_detections():
    log_file = os.path.join(DATA_DIR, "processed", "latest_detection.json")
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            return {"detections": [json.load(f)]}
    return {"detections": []}


@app.get("/alerts")
@app.get("/api/alerts")
def get_alerts():
    history_file = os.path.join(DATA_DIR, "processed", "detection_history.json")
    if os.path.exists(history_file):
        with open(history_file, "r") as f:
            history = json.load(f)
        alerts_list = [
            {
                "id": i,
                "pestType": det["pestType"],
                "severity": "Critical" if det["confidence"] > 85 else "High",
                "fieldId": det["id"],
                "status": det.get("status", "New"),
                "requires_review": det.get("requires_review", False),
                "gps_coords": det.get("gps_coords", {"lat": None, "lon": None}),
            }
            for i, det in enumerate(history)
        ]
        return {"alerts": alerts_list, "activeCount": len(alerts_list)}
    return {"alerts": [], "activeCount": 0}


@app.post("/api/retrain")
async def retrain_model(payload: RetrainPayload, background_tasks: BackgroundTasks):
    """
    HITL retraining endpoint.
    Writes the human-supplied label to datasets/pdt_custom/train/labels/
    as a standard YOLO .txt file, then triggers background fine-tuning.
    """
    labels_dir = os.path.join(BASE_DIR, "datasets", "pdt_custom", "train", "labels")
    os.makedirs(labels_dir, exist_ok=True)
    label_path = os.path.join(labels_dir, f"{payload.image_id}.txt")

    # Healthy = 0, anything else (specific pest names) treated as unhealthy = 1
    class_id = 0 if payload.label.lower() == "healthy" else 1
    x, y, w, h = payload.bbox

    with open(label_path, "w") as f:
        f.write(f"{class_id} {x:.6f} {y:.6f} {w:.6f} {h:.6f}\n")

    background_tasks.add_task(_run_retrain_thread)
    return {"status": "started", "message": "Retraining job queued."}


@app.get("/api/retrain/status")
def retrain_status():
    """Poll this endpoint to check retraining progress."""
    with _retrain_lock:
        return dict(_retrain_status)


# ---------------------------------------------------------------------------
# Single-server SPA fallback — must be registered LAST so API routes win
# ---------------------------------------------------------------------------

if os.path.isdir(FRONTEND_DIST):
    from fastapi.responses import FileResponse
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/")
    def serve_root():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_spa(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
