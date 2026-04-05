FROM python:3.11-slim

# System libs needed by opencv and torch
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install CPU-only PyTorch first (avoids pulling 2GB CUDA wheels)
RUN pip install --no-cache-dir \
    torch==2.1.0+cpu torchvision==0.16.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy pre-built React dist (no Node.js needed)
COPY frontend/dist/ ./frontend/dist/

# Data directories
RUN mkdir -p backend/data/raw backend/data/processed/xai

WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "server.py"]
