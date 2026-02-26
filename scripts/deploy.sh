#!/bin/bash
# AiDocPlus-ResourceManager deploy script
# Copies the unified resource manager to the main app's bundled-resources/managers/
# Supports macOS (.app), Windows (.exe) and Linux (binary) based on current OS.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$REPO_DIR")"
TARGET_DIR="${PARENT_DIR}/AiDocPlus/apps/desktop/src-tauri/bundled-resources/managers"

# 共享 target 目录（通过 .cargo/config.toml 指向主程序 target）
# 优先使用 CARGO_TARGET_DIR（CI 环境），否则读取 .cargo/config.toml 中的 target-dir
if [ -n "$CARGO_TARGET_DIR" ]; then
  TARGET_BASE="$CARGO_TARGET_DIR"
elif [ -f "${REPO_DIR}/.cargo/config.toml" ]; then
  TARGET_BASE=$(grep 'target-dir' "${REPO_DIR}/.cargo/config.toml" | sed 's/.*= *"//' | sed 's/".*//')
fi
# 回退到默认 target 目录
TARGET_BASE="${TARGET_BASE:-${REPO_DIR}/target}"

# 检测当前操作系统，部署对应平台的产物
OS="$(uname -s)"
case "$OS" in
  Darwin)
    BUNDLE_DIR="${TARGET_BASE}/release/bundle/macos"
    APP_NAME="资源管理器.app"
    APP_PATH="${BUNDLE_DIR}/${APP_NAME}"
    if [ ! -d "$APP_PATH" ]; then
      echo "[ResourceManager] No macOS release bundle found at ${APP_PATH}"
      echo "[ResourceManager] Please build first: cd apps/resource-manager && npx tauri build"
      exit 0
    fi
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    APP_NAME="resource-manager.exe"
    APP_PATH="${TARGET_BASE}/release/${APP_NAME}"
    if [ ! -f "$APP_PATH" ]; then
      echo "[ResourceManager] No Windows release binary found at ${APP_PATH}"
      echo "[ResourceManager] Please build first: cd apps/resource-manager && npx tauri build"
      exit 0
    fi
    ;;
  Linux)
    APP_NAME="resource-manager"
    APP_PATH="${TARGET_BASE}/release/${APP_NAME}"
    if [ ! -f "$APP_PATH" ]; then
      echo "[ResourceManager] No Linux release binary found at ${APP_PATH}"
      echo "[ResourceManager] Please build first: cd apps/resource-manager && npx tauri build"
      exit 0
    fi
    ;;
  *)
    echo "[ResourceManager] Unsupported OS: $OS"
    exit 1
    ;;
esac

# Create target directory
mkdir -p "$TARGET_DIR"

# Remove old individual manager apps (migration cleanup)
for old_app in "角色管理器.app" "AI服务商管理器.app" "提示词模板管理器.app" "项目模板管理器.app" "文档模板管理器.app" "插件管理器.app"; do
  rm -rf "${TARGET_DIR}/${old_app}"
done

# 清理其他平台的管理器文件，确保只包含当前平台产物
case "$OS" in
  Darwin)
    rm -f "${TARGET_DIR}/resource-manager.exe"
    rm -f "${TARGET_DIR}/resource-manager"
    ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)
    rm -rf "${TARGET_DIR}/资源管理器.app"
    rm -f "${TARGET_DIR}/resource-manager"
    ;;
  Linux)
    rm -rf "${TARGET_DIR}/资源管理器.app"
    rm -f "${TARGET_DIR}/resource-manager.exe"
    ;;
esac

# Copy unified manager
echo "   [copy] ${APP_NAME}"
if [ -d "$APP_PATH" ]; then
  # macOS .app is a directory
  rm -rf "${TARGET_DIR}/${APP_NAME}"
  cp -R "$APP_PATH" "${TARGET_DIR}/${APP_NAME}"
else
  # Windows .exe / Linux binary is a file
  cp -f "$APP_PATH" "${TARGET_DIR}/${APP_NAME}"
fi

echo "   [ResourceManager] Deployed ${APP_NAME} to bundled-resources/managers/"
