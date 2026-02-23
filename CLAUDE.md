# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

**始终用中文与用户对话。** Always communicate with the user in Chinese.

## Project Overview

**AiDocPlus-ResourceManager** 是 AiDocPlus 项目的资源管理器，包含一个统一的 Tauri 2 桌面应用，用于可视化管理提示词模板和文档模板的数据。

### 项目类型
- **Monorepo**（pnpm workspace + Cargo workspace）
- **统一 Tauri 2 桌面应用**（共享后端和 UI 组件）
- **全栈应用**（Rust 后端 + React 前端）

### 技术栈

#### 后端（Rust）
- **框架**: Tauri 2.x（plugins: shell, dialog, fs）
- **共享 crate**: `aidocplus-manager-rust`（资源 CRUD、分类管理、导入导出、AI 生成）
- **依赖**: serde, tokio, reqwest, eventsource-client, zip, uuid, chrono

#### 前端（React）
- **框架**: React 19
- **语言**: TypeScript 5.9+
- **状态管理**: Zustand
- **UI**: Tailwind CSS 4
- **构建工具**: Vite 7
- **国际化**: i18next

### 项目结构

```
AiDocPlus-ResourceManager/
├── packages/
│   ├── manager-shared/     # 共享 TypeScript 类型定义
│   │   └── src/types.ts    # ResourceTypeConfig, ManifestBase, EditorPanelProps 等 20+ 接口
│   ├── manager-rust/       # 共享 Rust crate
│   │   └── src/
│   │       ├── lib.rs          # 模块声明
│   │       ├── types.rs        # Rust 数据结构
│   │       ├── resource_ops.rs # 资源 CRUD 操作
│   │       ├── category_ops.rs # 分类管理（_meta.json）
│   │       ├── import_export.rs# ZIP 导入导出
│   │       ├── ai.rs           # AI 生成（非流式 + SSE 流式）
│   │       └── commands.rs     # Tauri commands 定义
│   └── manager-ui/         # 共享 React 组件库
│       └── src/
│           ├── components/
│           │   ├── ManagerApp.tsx        # 主应用组件
│           │   ├── ManagerLayout.tsx     # 三栏布局
│           │   ├── SearchBar.tsx         # 搜索栏
│           │   ├── CategoryTree.tsx      # 分类树
│           │   ├── ResourceList.tsx      # 资源列表
│           │   ├── CommonFieldsEditor.tsx# 通用字段编辑器
│           │   └── ui/cn.ts             # 样式工具
│           ├── stores/
│           │   └── useResourceStore.ts   # Zustand 状态管理
│           ├── hooks/
│           │   ├── useResources.ts       # 资源 CRUD hooks
│           │   ├── useCategories.ts      # 分类 hooks
│           │   └── useAIGenerate.ts      # AI 生成 hooks
│           ├── i18n/
│           │   ├── zh.json              # 中文翻译
│           │   └── en.json              # 英文翻译
│           └── index.ts                 # 公共导出
├── apps/
│   └── resource-manager/       # 统一资源管理器（提示词模板 + 文档模板）
├── Cargo.toml              # Cargo workspace（共享 target/）
├── pnpm-workspace.yaml     # pnpm workspace: ['packages/*', 'apps/*']
└── package.json            # 根 package.json
```

统一管理器应用的结构：
```
apps/resource-manager/
├── package.json            # pnpm workspace 包（含 @tauri-apps/cli + 前端依赖）
├── src-tauri/              # Rust 后端
│   ├── Cargo.toml          # 依赖 aidocplus-manager-rust（path 引用）
│   ├── build.rs            # Tauri build
│   ├── src/main.rs         # Tauri 入口，注册 manager-rust 全部 commands
│   ├── tauri.conf.json     # 窗口标题、端口、图标
│   └── icons/              # 应用图标
└── src-ui/                 # React 前端
    ├── vite.config.ts      # Vite 配置
    ├── tsconfig.json       # TypeScript 配置
    ├── index.html
    └── src/
        ├── main.tsx        # React 入口
        ├── App.tsx         # <ManagerApp />
        ├── configs.ts      # 资源类型配置（promptTemplatesConfig + docTemplatesConfig）
        ├── index.css       # Tailwind CSS 入口
        └── panels/         # 自定义编辑面板
            ├── PromptTemplateEditor.tsx
            └── DocTemplateEditor.tsx
```

## 资源类型

| 资源类型 | 目标资源仓库 | 自定义编辑面板 | 内容文件 | 数据模式 |
|----------|-------------|---------------|--------|----------|
| 提示词模板 | AiDocPlus-PromptTemplates | PromptTemplateEditor | content.md | JSON 文件模式 |
| 文档模板 | AiDocPlus-DocTemplates | DocTemplateEditor | content.json | 目录模式 |

## 运行命令

### 开发模式

```bash
# 启动统一资源管理器
pnpm dev:resource-manager

# 或从管理器目录启动
cd apps/resource-manager && pnpm tauri dev
```

### 验证

```bash
# Cargo workspace 全量检查（所有 Rust 代码）
cargo check --workspace

# TypeScript 检查
cd apps/resource-manager/src-ui && npx tsc --noEmit

# 安装依赖
pnpm install
```

### 前置要求
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Rust（用于构建 Tauri 后端）

## 关键配置细节

### Cargo workspace
根目录 `Cargo.toml` 定义 workspace，统一管理器 + manager-rust 共享编译缓存。

**共享 target 目录**：通过 `.cargo/config.toml` 将 `target-dir` 指向主程序的 target 目录（`AiDocPlus-Main/apps/desktop/src-tauri/target`），避免重复编译 555 个相同依赖。首次编译约 35 秒（复用主程序已编译的依赖），后续增量编译约 4 秒。

**release profile 必须与主程序一致**：`lto = "thin"`、`opt-level = 2`、`codegen-units = 1`。否则共享 target 时会因配置不同导致重新编译。

CI 环境中 `CARGO_TARGET_DIR` 环境变量优先级高于 `.cargo/config.toml` 中的本地路径。

### pnpm workspace
`pnpm-workspace.yaml` 定义 `packages: ['packages/*', 'apps/*']`。`package.json` 在 `apps/{name}/` 层级（不在 `src-ui/` 下），因为 Tauri CLI 需要从包含 `src-tauri/` 的目录运行。

### Tauri 配置
- `beforeDevCommand`: `npx vite src-ui` — 从项目根运行 vite，指向 `src-ui` 子目录
- `beforeBuildCommand`: `npx vite build src-ui`
- `frontendDist`: `../src-ui/dist`

## 添加新资源类型

在 `apps/resource-manager/src-ui/src/configs.ts` 中：
1. 创建新的编辑面板 `panels/XxxEditor.tsx`
2. 添加新的 `ResourceTypeConfig` 对象
3. 在 `ALL_RESOURCE_TYPES` 数组中添加新条目
4. 在主程序 `resource.rs` 的 `open_resource_manager` 中添加新的管理器名称映射

## Development Guidelines

### 国际化
- manager-ui 的翻译文件在 `packages/manager-ui/src/i18n/{zh,en}.json`
- 每个管理器的自定义面板中的文字应使用中文（与主程序一致）
- 界面字体为宋体，大小为 16

### 代码风格
- TypeScript strict 模式
- React 函数组件 + hooks
- Tailwind CSS 4 样式
- 禁止硬编码英文 UI 文字

### 调试
- `pnpm tauri dev` 会同时启动 Vite dev server 和 Rust 后端
- Rust 文件修改后自动重新编译
- 前端由 Vite 热更新
- 如遇端口占用：`lsof -ti:1420 | xargs kill -9`

### 部署

`scripts/deploy.sh` 将构建产物复制到主程序的 `bundled-resources/managers/`。它会自动解析共享 target 路径：
- 优先使用 `CARGO_TARGET_DIR` 环境变量（CI 环境）
- 其次读取 `.cargo/config.toml` 中的 `target-dir`（本地环境）
- 回退到默认 `target/` 目录

CI 中使用 `tauri build --no-bundle` 跳过 WiX/MSI 打包，只生成 exe 文件。
