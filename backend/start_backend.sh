#!/bin/bash
# Backend startup wrapper - ensures dependencies are installed before starting

echo "=== Backend Startup Wrapper ==="

# Install system dependencies if needed
/app/backend/install_dependencies.sh

# Start the backend server
echo "Starting backend server..."
exec /root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload
