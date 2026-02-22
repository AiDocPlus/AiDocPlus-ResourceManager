---
description: 添加新的资源管理器到 AiDocPlus-ResourceManager 项目
---

## 添加新资源管理器

### 1. 复制现有管理器

```bash
cp -r /Users/jdh/Code/AiDocPlus-ResourceManager/apps/roles-manager /Users/jdh/Code/AiDocPlus-ResourceManager/apps/{new-name}
```

### 2. 清理复制产物

// turbo
```bash
rm -rf /Users/jdh/Code/AiDocPlus-ResourceManager/apps/{new-name}/src-ui/node_modules /Users/jdh/Code/AiDocPlus-ResourceManager/apps/{new-name}/src-tauri/target
```

### 3. 修改配置文件

修改以下文件中的名称、端口等：

- `apps/{new-name}/package.json` — `name` 字段改为 `@aidocplus/{new-name}`
- `apps/{new-name}/src-tauri/Cargo.toml` — `name` 字段
- `apps/{new-name}/src-tauri/tauri.conf.json` — `productName`、`identifier`、`devUrl` 端口
- `apps/{new-name}/src-ui/vite.config.ts` — `server.port` 和 `hmr.port`
- `apps/{new-name}/src-ui/index.html` — `<title>`
- `apps/{new-name}/src-tauri/src/main.rs` — 错误消息

### 4. 创建专属文件

删除复制过来的 roles 专属文件，创建新的：

- `src-ui/src/config.ts` — 定义 `ResourceTypeConfig`（资源类型、字段、AI 提示词）
- `src-ui/src/panels/XxxEditor.tsx` — 自定义编辑面板（实现 `EditorPanelProps`）
- `src-ui/src/App.tsx` — `<ManagerApp config={xxxConfig} />`

### 5. 注册到 workspace

在根 `Cargo.toml` 的 `members` 数组中添加：
```toml
"apps/{new-name}/src-tauri",
```

在根 `package.json` 的 `scripts` 中添加：
```json
"dev:{short-name}": "pnpm --filter @aidocplus/{new-name} tauri dev"
```

### 6. 安装依赖并验证

// turbo
```bash
cd /Users/jdh/Code/AiDocPlus-ResourceManager && pnpm install
```

```bash
cd /Users/jdh/Code/AiDocPlus-ResourceManager/apps/{new-name} && pnpm tauri dev
```
