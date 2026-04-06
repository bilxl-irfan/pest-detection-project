import sys
import os
import cv2
import numpy as np
import torch
import json
from datetime import datetime

# YOLOv5 repo must be on the path for model loading and layer access
YOLOV5_PATH = os.environ.get("YOLOV5_PATH", os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov5"))
if YOLOV5_PATH not in sys.path:
    sys.path.insert(0, YOLOV5_PATH)

import matplotlib.cm as cm
from pytorch_grad_cam import GradCAM

_model_cache: dict = {}


def load_model(model_path: str):
    """Load and cache the YOLOv5 model via torch.hub with the local repo."""
    abs_path = os.path.abspath(model_path)
    if abs_path not in _model_cache:
        hub_model = torch.hub.load(
            YOLOV5_PATH, "custom",
            path=abs_path,
            source="local",
            verbose=False,
        )
        hub_model.eval()
        _model_cache[abs_path] = hub_model
    return _model_cache[abs_path]


class _YOLOv5GradCAMWrapper(torch.nn.Module):
    """
    Wraps the inner YOLOv5 DetectionModel so GradCAM receives a plain tensor.
    In eval mode Detect returns (predictions, training_list); we return only
    the predictions tensor so pytorch_grad_cam doesn't choke on the tuple.
    torch.enable_grad() is required because GradCAM needs gradients to flow.
    """
    def __init__(self, detection_model):
        super().__init__()
        self.model = detection_model

    def forward(self, x):
        with torch.enable_grad():
            out = self.model(x)
        return out[0] if isinstance(out, (list, tuple)) else out


class _YOLOv5GradCAMTarget:
    """
    GradCAM target that extracts a scalar from YOLOv5's raw prediction tensor.
    Returns objectness * class_score for the top detection, giving GradCAM a
    meaningful gradient signal tied to that specific detection.
    """
    def __init__(self, cls_idx: int, box_idx: int = 0):
        self.cls_idx = cls_idx
        self.box_idx = box_idx

    def __call__(self, model_output):
        # model_output shape: [batch, num_anchors, 5+num_classes] or [num_anchors, 5+num_classes]
        if model_output.dim() == 3:
            pred = model_output[0, self.box_idx]
        else:
            pred = model_output[self.box_idx]
        return pred[4] * pred[5 + self.cls_idx]  # objectness * class confidence


def run_xai_on_tile(tile_img: np.ndarray, hub_model, output_path: str) -> dict | None:
    """
    Run YOLOv5 inference + GradCAM heatmap on a single 640×640 BGR tile.

    Heatmap is:
      - Generated from the last backbone layer (model[-2])
      - Guided by objectness * class_score of the top detection
      - Masked to the top detection bounding box area only
      - Skipped for tiles with no detection

    Returns a detection dict including the HITL flag, or None if no detection.
    """
    h, w = tile_img.shape[:2]
    if h != 640 or w != 640:
        tile_img = cv2.resize(tile_img, (640, 640))

    # --- YOLOv5 inference ---
    results = hub_model(tile_img)          # AutoShape accepts BGR numpy
    detections = results.xyxy[0]           # tensor [N, 6]: x1 y1 x2 y2 conf cls

    if len(detections) == 0:
        return None

    top = detections[0]
    conf_raw = float(top[4])
    conf_pct = round(conf_raw * 100, 2)
    cls_id = int(top[5])
    pest_name = hub_model.names[cls_id]    # 'healthy' or 'unhealthy'

    # --- HITL uncertainty flag (spec: 0.4 < conf < 0.6) ---
    requires_review = 0.4 < conf_raw < 0.6
    status = "requires_human_label" if requires_review else "confirmed"

    # --- XAI: only run GradCAM for unhealthy detections (saves GPU cycles) ---
    xai_generated = False
    if pest_name.lower() == "unhealthy":
        rgb_img = cv2.cvtColor(tile_img, cv2.COLOR_BGR2RGB)
        img_float = np.float32(rgb_img) / 255.0
        input_tensor = torch.from_numpy(img_float).permute(2, 0, 1).unsqueeze(0)

        try:
            dm = hub_model.model.model           # DetectionModel
            target_layers = [dm.model[-2]]       # last backbone layer (C3, index -2)

            wrapped = _YOLOv5GradCAMWrapper(dm)
            targets = [_YOLOv5GradCAMTarget(cls_idx=cls_id, box_idx=0)]
            cam = GradCAM(model=wrapped, target_layers=target_layers)
            grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0]  # (640, 640)

            # Mask heatmap to bounding box area only
            x1, y1, x2, y2 = (int(v) for v in top[:4])
            x1, y1 = max(x1, 0), max(y1, 0)
            x2, y2 = min(x2, 639), min(y2, 639)
            masked_cam = np.zeros((640, 640), dtype=np.float32)
            masked_cam[y1:y2, x1:x2] = grayscale_cam[y1:y2, x1:x2]

            # Output: 640x640 transparent RGBA PNG (jet colormap, alpha = intensity)
            jet = cm.get_cmap("jet")
            heatmap_rgba = (jet(masked_cam) * 255).astype(np.uint8)
            heatmap_rgba[:, :, 3] = (masked_cam * 255).astype(np.uint8)
            heatmap_bgra = cv2.cvtColor(heatmap_rgba, cv2.COLOR_RGBA2BGRA)

            png_path = output_path if output_path.endswith(".png") else output_path.replace(
                os.path.splitext(output_path)[1], ".png"
            )
            os.makedirs(os.path.dirname(png_path), exist_ok=True)
            cv2.imwrite(png_path, heatmap_bgra)
            xai_generated = True

        except Exception as e:
            print(f"[XAI] Heatmap failed ({e}), skipping.")

    return {
        "pestType": pest_name,
        "confidence": conf_pct,
        "status": status,
        "requires_review": requires_review,
        "xai_generated": xai_generated,
    }


def run_xai_cycle(image_path: str, model_path: str, output_path: str):
    """
    Legacy single-image entry point (backward compatibility).
    Resizes the image preserving aspect ratio, runs inference + GradCAM XAI, writes JSON.
    """
    hub_model = load_model(model_path)
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")

    h, w = img.shape[:2]
    if h > w:
        new_h, new_w = 640, int(640 * w / h)
    else:
        new_h, new_w = int(640 * h / w), 640
    img_resized = cv2.resize(img, (new_w, new_h))

    detection = run_xai_on_tile(img_resized, hub_model, output_path)

    if detection is None:
        detection = {
            "pestType": "No Pest Detected",
            "confidence": 0,
            "status": "confirmed",
            "requires_review": False,
        }

    detection_log = {
        "id": os.path.basename(image_path).split(".")[0],
        **detection,
        "raw_url": f"/outputs/processed/xai/{os.path.basename(output_path)}",
        "original_url": f"/outputs/raw/{os.path.basename(image_path)}",
        "timestamp": datetime.now().isoformat(),
    }

    os.makedirs("data/processed", exist_ok=True)
    with open("data/processed/latest_detection.json", "w") as f:
        json.dump(detection_log, f)

    print(f"XAI Cycle Complete: {detection['pestType']} ({detection['confidence']:.2f}%) [{detection['status']}]")
