import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function PluginEditor({ resource, onChange }: EditorPanelProps) {
  const manifest = resource.manifest;
  const roles: string[] = (manifest.roles as string[]) || [];
  const pluginType = (manifest.type as string) || 'content-generation';

  return (
    <div className="space-y-5 p-5 border rounded-lg">
      <h3 className="text-sm font-semibold text-muted-foreground">
        插件特有字段
      </h3>

      {/* 插件类型 */}
      <div className="space-y-2">
        <label className="font-medium">插件类型</label>
        <select
          value={pluginType}
          onChange={(e) => onChange({ manifest: { type: e.target.value } })}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="content-generation">内容生成</option>
          <option value="functional">功能扩展</option>
        </select>
      </div>

      {/* 关联角色 */}
      <div className="space-y-2">
        <label className="font-medium">关联角色（逗号分隔）</label>
        <input
          type="text"
          value={roles.join(', ')}
          onChange={(e) => {
            const next = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
            onChange({ manifest: { roles: next } });
          }}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
          placeholder="default, programmer, ..."
        />
      </div>

      {/* 启用状态 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={manifest.enabled !== false}
          onChange={(e) => onChange({ manifest: { enabled: e.target.checked } })}
        />
        <label className="font-medium">默认启用</label>
      </div>

      {/* i18n */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">英文名称</label>
          <input
            type="text"
            value={(manifest.i18n?.en?.name as string) || ''}
            onChange={(e) => {
              const i18n = manifest.i18n || {};
              const en = i18n.en || {};
              onChange({ manifest: { i18n: { ...i18n, en: { ...en, name: e.target.value } } } });
            }}
            className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
            placeholder="English name"
          />
        </div>
        <div className="space-y-2">
          <label className="font-medium">英文描述</label>
          <input
            type="text"
            value={(manifest.i18n?.en?.description as string) || ''}
            onChange={(e) => {
              const i18n = manifest.i18n || {};
              const en = i18n.en || {};
              onChange({ manifest: { i18n: { ...i18n, en: { ...en, description: e.target.value } } } });
            }}
            className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
            placeholder="English description"
          />
        </div>
      </div>

      {/* 提示：插件源码需要在 AiDocPlus-Plugins 仓库中编辑 */}
      <div className="p-3 bg-muted rounded text-sm text-muted-foreground">
        注意：插件源码（index.ts、Panel 组件等）需要在 AiDocPlus-Plugins 仓库中编辑。此管理器仅管理 manifest 元数据。
      </div>
    </div>
  );
}
