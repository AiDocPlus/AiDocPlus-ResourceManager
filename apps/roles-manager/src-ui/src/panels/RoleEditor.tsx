import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function RoleEditor({ resource, onChange }: EditorPanelProps) {
  const systemPrompt = resource.contentFiles['system-prompt.md'] || '';

  return (
    <div className="space-y-5 p-5 border rounded-lg">
      <h3 className="text-sm font-semibold text-muted-foreground">
        角色特有字段
      </h3>

      {/* 系统提示词编辑器 */}
      <div className="space-y-2">
        <label className="font-medium">系统提示词</label>
        <textarea
          value={systemPrompt}
          onChange={(e) =>
            onChange({
              contentFiles: { 'system-prompt.md': e.target.value },
            })
          }
          rows={12}
          className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
          placeholder="请输入角色的系统提示词..."
        />
      </div>

      {/* i18n 编辑（简化版） */}
      <div className="space-y-2">
        <label className="font-medium">英文名称 (i18n)</label>
        <input
          type="text"
          value={
            (resource.manifest.i18n?.en?.name as string) || ''
          }
          onChange={(e) => {
            const currentI18n = resource.manifest.i18n || {};
            const currentEn = currentI18n.en || {};
            onChange({
              manifest: {
                i18n: {
                  ...currentI18n,
                  en: { ...currentEn, name: e.target.value },
                },
              },
            });
          }}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
          placeholder="English name"
        />
      </div>

      <div className="space-y-2">
        <label className="font-medium">英文描述 (i18n)</label>
        <input
          type="text"
          value={
            (resource.manifest.i18n?.en?.description as string) || ''
          }
          onChange={(e) => {
            const currentI18n = resource.manifest.i18n || {};
            const currentEn = currentI18n.en || {};
            onChange({
              manifest: {
                i18n: {
                  ...currentI18n,
                  en: { ...currentEn, description: e.target.value },
                },
              },
            });
          }}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
          placeholder="English description"
        />
      </div>
    </div>
  );
}
