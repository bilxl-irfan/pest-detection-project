# Agroscan AI - Pest Detection System

A full-stack AI system for detecting healthy and unhealthy crops in drone imagery using YOLOv5, with explainability (EigenCAM), human-in-the-loop retraining, and a React dashboard.

---

## Overview

This project covers the end-to-end pipeline from raw annotated drone imagery to a deployed web application:

1. **Data preprocessing** - Convert raw annotations, tile large images, split into train/val/test
2. **Model training** - YOLOv5 trained on the PDT (Pest Detection and Tracking) dataset
3. **Dashboard** - FastAPI backend + React frontend for live inference, XAI visualization, and retraining

---

## Repository Structure

```
.
├── xml_to_yolo.py          # Convert Pascal VOC XML annotations to YOLO .txt format
├── images_split.py         # Tile large drone images into 640x640 patches and remap labels
├── aoto_split_yolo.py      # Randomly split tiled dataset into train/val/test folders
├── datasets/
│   ├── pdt_raw/            # Raw images and XML annotations
│   ├── pdt_tiled/          # Tiled 640x640 images and remapped labels
│   └── pdt_final/          # Final split dataset (train/val/test)
└── Full_System_Integration/
    └── model/dashboard/
        ├── backend/        # FastAPI server, YOLOv5 inference, EigenCAM XAI, retraining
        ├── frontend/       # React + TypeScript + Tailwind dashboard
        ├── nixpacks.toml   # Railway deployment config
        └── Procfile
```

---

## Dataset

The project uses the **PDT (Pest Detection and Tracking)** dataset. Images are high-resolution drone JPGs annotated in Pascal VOC XML format with two classes:

| Class ID | Label     |
|----------|-----------|
| 0        | healthy   |
| 1        | unhealthy |

---

## Data Preprocessing

Run these scripts in order:

### 1. Convert annotations from XML to YOLO format

```bash
python xml_to_yolo.py
```

Reads Pascal VOC `.xml` files and writes YOLO `.txt` label files (normalized `class x_center y_center width height`).

Update the paths at the bottom of the script:

```python
xml_dir = "datasets/pdt_raw/..."
img_dir  = "datasets/pdt_raw/..."
output_dir = "datasets/pdt_raw/.../labels"
```

### 2. Tile large images and labels

```bash
python images_split.py
```

Splits high-resolution images into 640x640 tiles with configurable stride. Labels are clipped and re-normalized to each tile's coordinate space. Tiles with no valid annotations still produce an (empty) label file.

Default paths (edit at the bottom of the script):

```python
source_img_dir   = "datasets/pdt_raw/.../images"
source_label_dir = "datasets/pdt_raw/.../labels"
tiled_img_dir    = "datasets/pdt_tiled/images"
tiled_label_dir  = "datasets/pdt_tiled/labels"
```

### 3. Split into train / val / test

```bash
python aoto_split_yolo.py
```

Randomly splits matched image-label pairs with a 70/20/10 ratio (seed fixed at 42 for reproducibility) and copies them into the YOLO directory structure expected by the trainer.

```
datasets/pdt_final/
├── train/images/  train/labels/
├── val/images/    val/labels/
└── test/images/   test/labels/
```

---

## Model Training

Training uses the bundled YOLOv5 source located at `Full_System_Integration/model/dashboard/backend/yolov5/`.

```bash
cd Full_System_Integration/model/dashboard/backend/yolov5
python train.py \
  --data data/pdt.yaml \
  --weights yolov5s.pt \
  --img 640 \
  --epochs 100 \
  --batch-size 16
```

Place the resulting `best.pt` at `Full_System_Integration/model/dashboard/backend/models/best.pt`.

---

## Dashboard

### Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | Python, FastAPI, Uvicorn                |
| ML       | YOLOv5, PyTorch, grad-cam (EigenCAM)    |
| Frontend | React, TypeScript, Vite, Tailwind CSS   |
| Deploy   | Railway (nixpacks), single-server setup |

### Backend API (FastAPI)

The backend serves the React build as static files and exposes REST endpoints:

| Endpoint                    | Description                                              |
|-----------------------------|----------------------------------------------------------|
| `POST /detect`              | Upload an image, run YOLOv5 inference, return detections |
| `GET /detections`           | List detection history                                   |
| `GET /latest`               | Most recent detection result                             |
| `POST /xai/{detection_id}`  | Generate EigenCAM heatmap for a detection                |
| `POST /retrain`             | Trigger HITL retraining with user-approved corrections   |
| `GET /retrain/status`       | Poll retraining job status                               |

GPS metadata is extracted from drone EXIF tags and included in detection results for GIS mapping.

### Frontend Features

- **Overview** - Aggregate stats: total detections, healthy vs unhealthy counts, confidence distribution
- **Detection Viewer** - Browse images with bounding box overlays; toggle XAI heatmaps
- **GIS Map** - Plot detection locations on a map using GPS coordinates from EXIF data
- **HITL Retraining** - Approve or reject model predictions; submit corrections to trigger retraining

### Running Locally

```bash
cd Full_System_Integration/model/dashboard

# Install backend dependencies
pip install -r backend/requirements.txt

# Build the frontend
cd frontend && npm ci --legacy-peer-deps && npm run build && cd ..

# Start the server
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`.

### Deploying to Railway

The project includes `nixpacks.toml` and `Procfile` for zero-config Railway deployment.

1. Push to GitHub
2. Create a new Railway project and point it at the `Full_System_Integration/model/dashboard` directory
3. Set the `PORT` environment variable (Railway injects this automatically)
4. Railway runs `npm run build` then starts `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## Requirements

**Python preprocessing scripts:**

```
opencv-python
tqdm
```

**Backend** (see `backend/requirements.txt`):

```
fastapi, uvicorn, torch, torchvision, opencv-python-headless,
grad-cam, numpy, scikit-learn, exifread, matplotlib, pillow, scipy, tqdm, requests
```

**Frontend:**

Node.js 20+, see `frontend/package.json` for full dependency list.

---

## License

See `Full_System_Integration/model/dashboard/backend/yolov5/LICENSE` for the YOLOv5 AGPL-3.0 license.
