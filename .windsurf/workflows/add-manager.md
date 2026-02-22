---
description: 添加新的资源类型到统一资源管理器
---

## 添加新资源类型

统一资源管理器位于 `apps/resource-manager/`，所有资源类型共用一个 Tauri 应用。

### 1. 创建编辑面板

在 `apps/resource-manager/src-ui/src/panels/` 下创建 `XxxEditor.tsx`：

```tsx
import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function XxxEditor({ resource, onChange }: EditorPanelProps) {
  // 实现资源类型特有的编辑 UI
}
```

### 2. 添加配置

在 `apps/resource-manager/src-ui/src/configs.ts` 中：

1. 导入新的编辑面板
2. 创建新的 `ResourceTypeConfig` 对象
3. 在 `ALL_RESOURCE_TYPES` 数组中添加新条目

### 3. 构建验证

// turbo
```bash
cd /Users/jdh/Code/AiDocPlus-ResourceManager/apps/resource-manager && pnpm tauri dev
```

### 4. 更新主程序

在 `AiDocPlus-Main/apps/desktop/src-tauri/src/commands/resource.rs` 的 `open_resource_manager` 中添加新的管理器名称 → resource-type 映射。
