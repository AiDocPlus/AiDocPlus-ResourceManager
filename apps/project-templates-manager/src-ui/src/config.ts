import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { ProjectTemplateEditor } from './panels/ProjectTemplateEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const projectTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '项目模板管理器',
  resourceType: 'project-template',
  resourceLabel: '项目模板',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-ProjectTemplates/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-ProjectTemplates' : undefined,
  contentFiles: [
    {
      filename: 'content.json',
      type: 'json',
      label: '模板内容',
      defaultContent: JSON.stringify({ authorNotes: '', aiGeneratedContent: '', content: '' }, null, 2),
    },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: ProjectTemplateEditor,
  defaultManifest: {
    resourceType: 'project-template',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
  hasRolesField: true,

  aiGenerate: {
    systemPromptTemplate: `你是一个项目模板创建专家。用户会描述他们想要的项目模板，你需要生成完整的资源。
每个项目模板包含一个 manifest（元数据）和一个 content.json（模板内容）。
content.json 格式为 { "authorNotes": "作者备注", "aiGeneratedContent": "AI 生成提示", "content": "模板正文内容（Markdown 格式）" }。
模板正文应结构清晰、内容充实，可作为文档写作的起点。`,
    outputFiles: ['manifest.json', 'content.json'],
    exampleResources: ['academic-thesis', 'work-report'],
  },
};
