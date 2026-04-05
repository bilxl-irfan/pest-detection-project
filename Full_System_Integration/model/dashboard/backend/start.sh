#!/bin/bash
# Start the Agroscan AI backend using the isolated venv
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
exec .venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
