# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

**始终用中文与用户对话。** Always communicate with the user in Chinese.

## Project Overview

**AiDocPlus-ResourceManager** 是 AiDocPlus 项目的资源管理器工具集，包含 6 个独立的 Tauri 2 桌面应用，用于可视化管理各类资源仓库（角色、AI 服务商、提示词模板、项目模板、文档模板、插件）的数据。

### 项目类型
- **Monorepo**（pnpm workspace + Cargo workspace）
- **6 个独立 Tauri 2 桌面应用**（共享后端和 UI 组件）
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
│   ├── roles-manager/           # 角色管理器（端口 1420）
│   ├── ai-providers-manager/    # AI 服务商管理器（端口 1421）
│   ├── prompt-templates-manager/# 提示词模板管理器（端口 1422）
│   ├── project-templates-manager/# 项目模板管理器（端口 1423）
│   ├── doc-templates-manager/   # 文档模板管理器（端口 1424）
│   └── plugins-manager/        # 插件管理器（端口 1425）
├── Cargo.toml              # Cargo workspace（7 个成员共享 target/）
├── pnpm-workspace.yaml     # pnpm workspace: ['packages/*', 'apps/*']
└── package.json            # 根 package.json（dev:xxx 便捷脚本）
```

每个管理器应用的结构：
```
apps/{name}/
├── package.json            # pnpm workspace 包（含 @tauri-apps/cli + 前端依赖）
├── src-tauri/              # Rust 后端
│   ├── Cargo.toml          # 依赖 aidocplus-manager-rust（path 引用）
│   ├── build.rs            # Tauri build
│   ├── src/main.rs         # Tauri 入口，注册 manager-rust 全部 commands
│   ├── tauri.conf.json     # 窗口标题、端口、图标
│   └── icons/              # 应用图标
└── src-ui/                 # React 前端
    ├── vite.config.ts      # Vite 配置（端口、HMR）
    ├── tsconfig.json       # TypeScript 配置
    ├── index.html
    ├── src/
    │   ├── main.tsx        # React 入口
    │   ├── App.tsx         # <ManagerApp config={xxxConfig} />
    │   ├── config.ts       # ResourceTypeConfig 定义
    │   ├── index.css       # Tailwind CSS 入口
    │   └── panels/         # 自定义编辑面板
    │       └── XxxEditor.tsx
    └── (无 package.json，依赖由 apps/{name}/package.json 管理)
```

## 6 个管理器

| 管理器 | 端口 | 目标资源仓库 | 自定义编辑面板 | 内容文件 |
|--------|------|-------------|---------------|---------|
| roles-manager | 1420 | AiDocPlus-Roles | RoleEditor | system-prompt.md |
| ai-providers-manager | 1421 | AiDocPlus-AIProviders | AIProviderEditor | — |
| prompt-templates-manager | 1422 | AiDocPlus-PromptTemplates | PromptTemplateEditor | content.md |
| project-templates-manager | 1423 | AiDocPlus-ProjectTemplates | ProjectTemplateEditor | content.json |
| doc-templates-manager | 1424 | AiDocPlus-DocTemplates | DocTemplateEditor | content.json |
| plugins-manager | 1425 | AiDocPlus-Plugins | PluginEditor | — |

## 运行命令

### 开发模式

```bash
# 从根目录启动某个管理器
pnpm dev:roles
pnpm dev:ai-providers
pnpm dev:prompt-templates
pnpm dev:project-templates
pnpm dev:doc-templates
pnpm dev:plugins

# 或从管理器目录启动
cd apps/roles-manager && pnpm tauri dev
```

### 验证

```bash
# Cargo workspace 全量检查（所有 Rust 代码）
cargo check --workspace

# 单个管理器 TypeScript 检查
cd apps/roles-manager/src-ui && npx tsc --noEmit

# 安装依赖
pnpm install
```

### 前置要求
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Rust（用于构建 Tauri 后端）

## 关键配置细节

### Cargo workspace
根目录 `Cargo.toml` 定义 workspace，所有 6 个管理器 + manager-rust 共享 `target/` 编译缓存。首次编译约 1 分钟（500+ 依赖），后续增量编译约 4 秒。

### pnpm workspace
`pnpm-workspace.yaml` 定义 `packages: ['packages/*', 'apps/*']`。`package.json` 在 `apps/{name}/` 层级（不在 `src-ui/` 下），因为 Tauri CLI 需要从包含 `src-tauri/` 的目录运行。

### Tauri 配置
- `beforeDevCommand`: `npx vite src-ui` — 从项目根运行 vite，指向 `src-ui` 子目录
- `beforeBuildCommand`: `npx vite build src-ui`
- `frontendDist`: `../src-ui/dist`
- 每个管理器使用不同端口（1420-1425），HMR 端口 = server port + 1

### 目录结构注意事项
- `src-ui/` 下**没有** `package.json`（已合并到 `apps/{name}/package.json`）
- `src-ui/` 下**没有** `node_modules`（由 pnpm workspace 在 `apps/{name}/` 层级管理）
- 复制管理器目录时需清理 `src-ui/node_modules` 和 `src-tauri/target`

## 共享包 API

### manager-rust Tauri Commands

```rust
// 资源 CRUD
list_resources(data_dir: String) -> Vec<ResourceSummary>
get_resource(resource_path: String, content_files: Vec<String>) -> ResourceItem
save_resource(resource_path: String, manifest: Value, content_files: HashMap<String, String>) -> ()
create_resource(data_dir: String, id: String, manifest: Value, content_files: HashMap<String, String>) -> String
delete_resource(resource_path: String) -> ()
reorder_resources(data_dir: String, ids: Vec<String>) -> ()

// 分类管理
load_categories(data_dir: String) -> MetaConfig
save_categories(data_dir: String, meta: MetaConfig) -> ()

// 导入导出
import_resources(zip_path: String, data_dir: String) -> ImportResult
export_resources(resource_paths: Vec<String>, output_path: String) -> ()

// 批量操作
batch_update(data_dir: String, operation: BatchOperation) -> ()

// AI 生成
ai_generate(config: AIServiceConfig, system_prompt: String, user_prompt: String) -> String
ai_generate_stream(app: AppHandle, config: AIServiceConfig, system_prompt: String, user_prompt: String) -> ()

// 构建脚本
run_build_script(script_path: String) -> String

// AI 配置持久化
load_ai_config() -> Option<AIServiceConfig>
save_ai_config(config: AIServiceConfig) -> ()
```

### manager-ui 组件

```typescript
// 主组件
<ManagerApp config={ResourceTypeConfig} />

// 编辑面板 Props（自定义面板实现此接口）
interface EditorPanelProps {
  resource: ResourceItem;
  onChange: (changes: ResourceChanges) => void;
}

// ResourceTypeConfig（每个管理器提供一份）
interface ResourceTypeConfig {
  appTitle: string;
  resourceType: string;
  resourceLabel: string;
  defaultDataDir: string;
  contentFiles: ContentFileSpec[];
  extraManifestFields: FieldDefinition[];
  CustomEditorPanel?: ComponentType<EditorPanelProps>;
  defaultManifest: Partial<ManifestBase>;
  hasRolesField: boolean;
  hasSubCategories: boolean;
  aiGenerate: AIGenerateConfig;
}
```

## 添加新管理器

1. 复制现有管理器目录（如 `apps/roles-manager/`）到 `apps/{new-name}/`
2. 清理 `src-ui/node_modules` 和 `src-tauri/target`
3. 修改以下文件：
   - `package.json` — `name` 字段
   - `src-tauri/Cargo.toml` — `name` 字段
   - `src-tauri/tauri.conf.json` — `productName`、`identifier`、`devUrl` 端口
   - `src-ui/vite.config.ts` — `server.port` 和 `hmr.port`
   - `src-ui/index.html` — `<title>`
   - `src-tauri/src/main.rs` — 错误消息
4. 创建专属文件：
   - `src-ui/src/config.ts` — `ResourceTypeConfig`
   - `src-ui/src/panels/XxxEditor.tsx` — 自定义编辑面板
   - `src-ui/src/App.tsx` — `<ManagerApp config={xxxConfig} />`
5. 在根 `Cargo.toml` 的 `members` 中添加新路径
6. 在根 `package.json` 中添加 `dev:xxx` 脚本
7. `pnpm install` + `pnpm tauri dev` 验证

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
