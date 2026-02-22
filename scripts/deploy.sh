#!/bin/bash
# AiDocPlus-ResourceManager deploy script
# Copies the unified resource manager .app to the main app's bundled-resources/managers/
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$REPO_DIR")"
TARGET_DIR="${PARENT_DIR}/AiDocPlus/apps/desktop/src-tauri/bundled-resources/managers"

BUNDLE_DIR="${REPO_DIR}/target/release/bundle/macos"
APP_NAME="资源管理器.app"
APP_PATH="${BUNDLE_DIR}/${APP_NAME}"

if [ ! -d "$APP_PATH" ]; then
  echo "[ResourceManager] No release bundle found at ${APP_PATH}"
  echo "[ResourceManager] Please build first: cd apps/resource-manager && npx tauri build"
  exit 0
fi

# Create target directory
mkdir -p "$TARGET_DIR"

# Remove old individual manager apps (migration cleanup)
for old_app in "角色管理器.app" "AI服务商管理器.app" "提示词模板管理器.app" "项目模板管理器.app" "文档模板管理器.app" "插件管理器.app"; do
  rm -rf "${TARGET_DIR}/${old_app}"
done

# Copy unified manager
echo "   [copy] ${APP_NAME}"
rm -rf "${TARGET_DIR}/${APP_NAME}"
cp -R "$APP_PATH" "${TARGET_DIR}/${APP_NAME}"

echo "   [ResourceManager] Deployed unified resource manager to bundled-resources/managers/"
