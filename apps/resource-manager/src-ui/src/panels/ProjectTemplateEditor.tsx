import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function ProjectTemplateEditor({ resource, onChange }: EditorPanelProps) {
  const contentJson = resource.contentFiles['content.json'] || '{}';
  const roles: string[] = (resource.manifest.roles as string[]) || [];

  let parsed: Record<string, string> = {};
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    // ignore
  }

  const updateContentField = (field: string, value: string) => {
    const updated = { ...parsed, [field]: value };
    onChange({ contentFiles: { 'content.json': JSON.stringify(updated, null, 2) } });
  };

  return (
    <div className="space-y-5 p-5 border rounded-lg">
      <h3 className="text-sm font-semibold text-muted-foreground">
        项目模板特有字段
      </h3>

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

      {/* 作者备注 */}
      <div className="space-y-2">
        <label className="font-medium">作者备注</label>
        <textarea
          value={parsed.authorNotes || ''}
          onChange={(e) => updateContentField('authorNotes', e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y"
          placeholder="模板使用说明..."
        />
      </div>

      {/* AI 生成内容提示 */}
      <div className="space-y-2">
        <label className="font-medium">AI 生成内容提示</label>
        <textarea
          value={parsed.aiGeneratedContent || ''}
          onChange={(e) => updateContentField('aiGeneratedContent', e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y"
          placeholder="AI 生成时的提示内容..."
        />
      </div>

      {/* 模板正文 */}
      <div className="space-y-2">
        <label className="font-medium">模板正文内容</label>
        <textarea
          value={parsed.content || ''}
          onChange={(e) => updateContentField('content', e.target.value)}
          rows={12}
          className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
          placeholder="模板正文..."
        />
      </div>

      {/* i18n */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-medium">英文名称</label>
          <input
            type="text"
            value={(resource.manifest.i18n?.en?.name as string) || ''}
            onChange={(e) => {
              const i18n = resource.manifest.i18n || {};
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
            value={(resource.manifest.i18n?.en?.description as string) || ''}
            onChange={(e) => {
              const i18n = resource.manifest.i18n || {};
              const en = i18n.en || {};
              onChange({ manifest: { i18n: { ...i18n, en: { ...en, description: e.target.value } } } });
            }}
            className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
            placeholder="English description"
          />
        </div>
      </div>
    </div>
  );
}
