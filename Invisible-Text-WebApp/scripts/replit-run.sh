#!/usr/bin/env bash
set -euo pipefail

# Simple Replit runner for local/dev environment.
# It installs dependencies and starts the API server in background,
# then starts the Vite dev server for the webapp in foreground.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Root: $ROOT_DIR"

cd "$ROOT_DIR/artifacts/api-server"
echo "Installing api-server dependencies (this may take a moment)..."
pnpm install
echo "Building api-server..."
pnpm run build
echo "Starting api-server in background (logs -> api-server.log)..."
nohup node --enable-source-maps ./dist/index.mjs > "$ROOT_DIR/api-server.log" 2>&1 &

cd "$ROOT_DIR/artifacts/invisible-webapp"
echo "Installing invisible-webapp dependencies..."
pnpm install
echo "Starting Vite dev server..."
pnpm dev
