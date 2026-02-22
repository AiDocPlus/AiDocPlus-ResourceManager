import { useState } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';

export function AIProviderEditor({ resource, onChange }: EditorPanelProps) {
  const manifest = resource.manifest;
  const models: string[] = (manifest.models as string[]) || [];
  const capabilities: string[] = (manifest.capabilities as string[]) || [];
  const [newModel, setNewModel] = useState('');

  const allCapabilities = [
    { key: 'chat', label: '对话' },
    { key: 'streaming', label: '流式输出' },
    { key: 'web-search', label: '联网搜索' },
    { key: 'tool-use', label: '工具调用' },
    { key: 'vision', label: '视觉理解' },
    { key: 'code', label: '代码生成' },
  ];

  return (
    <div className="space-y-5 p-5 border rounded-lg">
      <h3 className="text-sm font-semibold text-muted-foreground">
        AI 服务商特有字段
      </h3>

      {/* Base URL */}
      <div className="space-y-2">
        <label className="font-medium">API Base URL</label>
        <input
          type="text"
          value={(manifest.baseUrl as string) || ''}
          onChange={(e) => onChange({ manifest: { baseUrl: e.target.value } })}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
          placeholder="https://api.example.com/v1"
        />
      </div>

      {/* Auth Header */}
      <div className="space-y-2">
        <label className="font-medium">认证头名称</label>
        <input
          type="text"
          value={(manifest.authHeader as string) || 'Authorization'}
          onChange={(e) => onChange({ manifest: { authHeader: e.target.value } })}
          className="w-full h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
          placeholder="Authorization"
        />
      </div>

      {/* 能力声明 */}
      <div className="space-y-2">
        <label className="font-medium">能力声明</label>
        <div className="flex flex-wrap gap-3">
          {allCapabilities.map((cap) => (
            <label key={cap.key} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={capabilities.includes(cap.key)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...capabilities, cap.key]
                    : capabilities.filter((c) => c !== cap.key);
                  onChange({ manifest: { capabilities: next } });
                }}
              />
              {cap.label}
            </label>
          ))}
        </div>
      </div>

      {/* 模型列表 */}
      <div className="space-y-2">
        <label className="font-medium">模型列表</label>
        <div className="space-y-1.5">
          {models.map((m, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="flex-1 bg-muted px-3 py-1.5 rounded text-sm">{m}</span>
              <button
                onClick={() => {
                  const next = models.filter((_, j) => j !== i);
                  onChange({ manifest: { models: next } });
                }}
                className="text-sm text-destructive hover:underline"
              >
                删除
              </button>
            </div>
          ))}
          <div className="flex gap-1">
            <input
              type="text"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newModel.trim()) {
                  onChange({ manifest: { models: [...models, newModel.trim()] } });
                  setNewModel('');
                }
              }}
              className="flex-1 h-10 rounded-md border border-input bg-white px-3 outline-none focus:ring-1 focus:ring-ring"
              placeholder="输入模型名称后回车"
            />
          </div>
        </div>
      </div>

      {/* i18n */}
      <div className="space-y-2">
        <label className="font-medium">英文名称 (i18n)</label>
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
    </div>
  );
}
