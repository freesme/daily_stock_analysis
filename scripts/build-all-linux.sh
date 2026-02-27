#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Daily Stock Analysis Desktop Build (Linux) ==="

bash "${SCRIPT_DIR}/build-backend-linux.sh"
bash "${SCRIPT_DIR}/build-desktop-linux.sh"

echo "All builds completed."
