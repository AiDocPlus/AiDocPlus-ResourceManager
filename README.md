# AiDocPlus 资源管理器

独立的资源管理工具集，用于管理 AiDocPlus 的各类外部资源仓库。

## 架构

```
AiDocPlus-ResourceManager/
├── packages/
│   ├── manager-shared/     # 共享 TypeScript 类型定义
│   ├── manager-rust/       # 共享 Rust crate（Tauri commands）
│   └── manager-ui/         # 共享 React 组件库（ManagerApp、编辑器、列表等）
├── apps/
│   ├── roles-manager/           # 角色管理器（端口 1420）
│   ├── ai-providers-manager/    # AI 服务商管理器（端口 1421）
│   ├── prompt-templates-manager/# 提示词模板管理器（端口 1422）
│   ├── project-templates-manager/# 项目模板管理器（端口 1423）
│   ├── doc-templates-manager/   # 文档模板管理器（端口 1424）
│   └── plugins-manager/        # 插件管理器（端口 1425）
└── Cargo.toml              # Cargo workspace（共享编译缓存）
```

每个管理器是一个独立的 Tauri 2 桌面应用，包含：
- `src-tauri/` — Rust 后端，调用 `manager-rust` 的 commands
- `src-ui/` — React 前端，使用 `manager-ui` 组件 + 自定义编辑面板

## 技术栈

- **前端**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Zustand + i18next
- **后端**: Rust + Tauri 2（plugins: shell, dialog, fs）
- **构建**: pnpm workspace + Cargo workspace + Vite 7
- **共享**: manager-shared（类型）、manager-rust（Rust 逻辑）、manager-ui（UI 组件）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动某个管理器（从根目录）
pnpm dev:roles
pnpm dev:ai-providers
pnpm dev:prompt-templates
pnpm dev:project-templates
pnpm dev:doc-templates
pnpm dev:plugins

# 或从管理器目录启动
cd apps/roles-manager && pnpm tauri dev
```

## 管理器说明

| 管理器 | 资源仓库 | 说明 |
|--------|----------|------|
| roles-manager | AiDocPlus-Roles | 管理角色定义（system-prompt.md、i18n） |
| ai-providers-manager | AiDocPlus-AIProviders | 管理 AI 服务商（baseUrl、models、capabilities） |
| prompt-templates-manager | AiDocPlus-PromptTemplates | 管理提示词模板（JSON 文件模式，`dataMode: 'json-file'`） |
| project-templates-manager | AiDocPlus-ProjectTemplates | 管理项目模板（content.json） |
| doc-templates-manager | AiDocPlus-DocTemplates | 管理文档模板和 PPT 主题 |
| plugins-manager | AiDocPlus-Plugins | 管理插件 manifest 元数据 |

## 共享包

### manager-shared
TypeScript 类型定义：`ResourceTypeConfig`、`ManifestBase`、`EditorPanelProps`、`CategoryDefinition` 等。

### manager-rust
Rust crate 提供 Tauri commands：
- 资源 CRUD（list、get、save、create、delete、reorder）— 目录模式
- JSON 文件 CRUD（scan、get、save、create、delete、batch_move、batch_delete、read_categories、save_categories）— JSON 文件模式
- 分类管理（load_categories、save_categories）
- 导入导出（import_resources、export_resources）
- 批量操作（batch_update）
- AI 生成（ai_generate、ai_generate_stream）
- 构建脚本（run_build_script）
- 数据目录（cmd_get_data_dir）— 从 `--data-dir` 启动参数获取

### 数据模式

管理器支持两种数据模式，通过 `config.ts` 中的 `dataMode` 字段配置：

| 模式 | `dataMode` | 数据结构 | 使用管理器 |
|------|-----------|----------|-----------|
| 目录模式（默认） | 不设置 | `_meta.json` + `{category}/{id}/manifest.json + content.*` | 角色、AI服务商、项目模板、文档模板、插件 |
| JSON 文件模式 | `'json-file'` | 每个分类一个 JSON 文件（含元信息+所有资源） | 提示词模板 |

JSON 文件模式的前端逻辑在 `ManagerApp.tsx` 中通过 `isJsonMode` 标志切换，调用 `useResources.ts` 和 `useCategories.ts` 中的 `loadJson*` 函数。

### manager-ui
React 组件库：
- `ManagerApp` — 主应用组件（集成所有子组件）
- `ManagerLayout` — 布局（工具栏 + 分类树 + 资源列表 + 编辑器）
- `SearchBar` — 搜索栏
- `CategoryTree` — 分类树
- `ResourceList` — 资源列表
- `CommonFieldsEditor` — 通用字段编辑器
- `useResourceStore` — Zustand 状态管理
- `useResources` / `useCategories` / `useAIGenerate` — 业务 hooks
