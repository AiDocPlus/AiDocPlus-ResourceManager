import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { DocTemplateEditor } from './panels/DocTemplateEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const docTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '文档模板管理器',
  resourceType: 'doc-template',
  resourceLabel: '文档模板',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-DocTemplates/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-DocTemplates' : undefined,
  contentFiles: [
    {
      filename: 'content.json',
      type: 'json',
      label: '模板内容',
      defaultContent: JSON.stringify({ authorNotes: '', content: '' }, null, 2),
    },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: DocTemplateEditor,
  defaultManifest: {
    resourceType: 'doc-template',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
  hasRolesField: true,

  aiGenerate: {
    systemPromptTemplate: `你是一个文档模板/PPT主题创建专家。用户会描述他们想要的模板或主题，你需要生成完整的资源。
每个文档模板包含一个 manifest（元数据）和一个 content.json（模板内容）。
对于文档模板：content.json 格式为 { "authorNotes": "作者备注", "content": "模板正文内容" }，majorCategory 可选：report/article/email-draft/meeting/creative/technical/general。
对于 PPT 主题：content.json 格式为 { "primaryColor": "#hex", "fontFamily": "字体名" }，majorCategory 为 "ppt-theme"。
manifest 中应包含 i18n 字段提供英文翻译。`,
    outputFiles: ['manifest.json', 'content.json'],
    exampleResources: ['doc-work-summary', 'business-blue'],
  },
};
