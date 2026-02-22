import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function DocTemplateEditor({ resource, onChange }: EditorPanelProps) {
  const contentJson = resource.contentFiles['content.json'] || '{}';
  const roles: string[] = (resource.manifest.roles as string[]) || [];
  const isPPT = resource.manifest.majorCategory === 'ppt-theme';

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    // ignore
  }

  const updateContentField = (field: string, value: unknown) => {
    const updated = { ...parsed, [field]: value };
    onChange({ contentFiles: { 'content.json': JSON.stringify(updated, null, 2) } });
  };

  return (
    <div className="space-y-5 p-5 border rounded-lg">
      <h3 className="text-sm font-semibold text-muted-foreground">
        {isPPT ? 'PPT 主题特有字段' : '文档模板特有字段'}
      </h3>

      {/* 关联角色（仅文档模板） */}
      {!isPPT && (
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
            placeholder="default, writer, ..."
          />
        </div>
      )}

      {/* PPT 主题颜色 */}
      {isPPT && (
        <>
          <div className="space-y-2">
            <label className="font-medium">主色调</label>
            <input
              type="text"
              value={(parsed.primaryColor as string) || ''}
              onChange={(e) => updateContentField('primaryColor', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
              placeholder="#1a73e8"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">字体</label>
            <input
              type="text"
              value={(parsed.fontFamily as string) || ''}
              onChange={(e) => updateContentField('fontFamily', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
              placeholder="微软雅黑"
            />
          </div>
        </>
      )}

      {/* 文档模板内容 */}
      {!isPPT && (
        <>
          <div className="space-y-2">
            <label className="font-medium">作者备注</label>
            <textarea
              value={(parsed.authorNotes as string) || ''}
              onChange={(e) => updateContentField('authorNotes', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y"
              placeholder="模板使用说明..."
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium">模板正文</label>
            <textarea
              value={(parsed.content as string) || ''}
              onChange={(e) => updateContentField('content', e.target.value)}
              rows={12}
              className="w-full rounded-md border border-input bg-white px-3 py-2 outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
              placeholder="模板正文内容..."
            />
          </div>
        </>
      )}

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
