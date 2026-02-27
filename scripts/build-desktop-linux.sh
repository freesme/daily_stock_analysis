#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

export CSC_IDENTITY_AUTO_DISCOVERY="false"
export ELECTRON_BUILDER_CACHE="${ROOT_DIR}/.electron-builder-cache"

echo "Building Electron desktop app (Linux)..."

if [[ ! -d "${ROOT_DIR}/dist/backend/stock_analysis" ]]; then
  echo "Backend artifact not found: ${ROOT_DIR}/dist/backend/stock_analysis"
  echo "Run scripts/build-backend-linux.sh first."
  exit 1
fi

pushd "${ROOT_DIR}/apps/dsa-desktop" >/dev/null
if [[ ! -d node_modules ]]; then
  npm install
fi

if compgen -G "dist/linux*" >/dev/null; then
  echo "Cleaning dist/linux*..."
  rm -rf dist/linux*
fi
if compgen -G "dist/*.AppImage" >/dev/null; then
  rm -f dist/*.AppImage
fi

LINUX_ARCH="${DSA_LINUX_ARCH:-x64}"
ARCH_ARGS=()
case "${LINUX_ARCH}" in
  x64)
    ARCH_ARGS+=("--x64")
    ;;
  arm64)
    ARCH_ARGS+=("--arm64")
    ;;
  *)
    echo "Unsupported DSA_LINUX_ARCH: ${LINUX_ARCH}. Use x64 or arm64."
    exit 1
    ;;
esac

echo "Building Linux target arch: ${LINUX_ARCH}"
npx electron-builder --linux AppImage "${ARCH_ARGS[@]}"
popd >/dev/null

echo "Desktop build completed."
