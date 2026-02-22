import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { PromptTemplateEditor } from './panels/PromptTemplateEditor';

// 开发模式：检测环境变量或使用默认路径
const DEV_DATA_DIR = '/Users/jdh/Code/AiDocPlus-PromptTemplates/data';
const DEV_REPO_DIR = '/Users/jdh/Code/AiDocPlus-PromptTemplates';

// 运行时数据目录（最终用户）：由 --data-dir 参数传入，此处仅作 fallback
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const promptTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '提示词模板管理器',
  resourceType: 'prompt-template',
  resourceLabel: '提示词模板',
  defaultDataDir: isDevMode ? DEV_DATA_DIR : '',
  repoDir: isDevMode ? DEV_REPO_DIR : undefined,
  dataMode: 'json-file',
  contentFiles: [
    {
      filename: 'content.md',
      type: 'markdown',
      label: '提示词内容',
      defaultContent: '# 提示词模板\n\n请在此输入提示词内容...',
    },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: PromptTemplateEditor,
  defaultManifest: {
    resourceType: 'prompt-template',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
  hasRolesField: true,

  aiGenerate: {
    systemPromptTemplate: `你是一个提示词模板创建专家。用户会描述他们想要的提示词模板，你需要生成完整的资源。
每个提示词模板包含一个 manifest（元数据）和一个 content.md（提示词正文，Markdown 格式）。
content.md 应包含详细的提示词模板内容，结构清晰，可直接使用。`,
    outputFiles: ['manifest.json', 'content.md'],
    exampleResources: ['academic-abstract', 'code-review'],
  },
};
