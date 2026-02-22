#!/bin/bash
# AiDocPlus-ResourceManager deploy script
# Copies built manager .app bundles to the main app's bundled-resources/managers/
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$REPO_DIR")"
TARGET_DIR="${PARENT_DIR}/AiDocPlus/apps/desktop/src-tauri/bundled-resources/managers"

BUNDLE_DIR="${REPO_DIR}/target/release/bundle/macos"

if [ ! -d "$BUNDLE_DIR" ]; then
  echo "[ResourceManager] No release bundle found at ${BUNDLE_DIR}"
  echo "[ResourceManager] Please build first: cd apps/<manager> && npx tauri build"
  exit 0
fi

# Create target directory
mkdir -p "$TARGET_DIR"

# Copy all .app bundles
APP_COUNT=0
for app in "$BUNDLE_DIR"/*.app; do
  if [ -d "$app" ]; then
    APP_NAME=$(basename "$app")
    echo "   [copy] ${APP_NAME}"
    rm -rf "${TARGET_DIR}/${APP_NAME}"
    cp -R "$app" "${TARGET_DIR}/${APP_NAME}"
    APP_COUNT=$((APP_COUNT + 1))
  fi
done

echo "   [ResourceManager] Deployed ${APP_COUNT} manager apps to bundled-resources/managers/"
