import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { AIProviderEditor } from './panels/AIProviderEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const aiProvidersConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: 'AI服务商管理器',
  resourceType: 'ai-provider',
  resourceLabel: 'AI服务商',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-AIProviders/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-AIProviders' : undefined,
  contentFiles: [],
  extraManifestFields: [
    { key: 'baseUrl', label: 'API Base URL', type: 'text' },
    { key: 'authHeader', label: '认证头', type: 'text' },
    { key: 'models', label: '模型列表', type: 'model-list' },
    { key: 'capabilities', label: '能力声明', type: 'capabilities' },
  ],
  CustomEditorPanel: AIProviderEditor,
  defaultManifest: {
    resourceType: 'ai-provider',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
  hasRolesField: false,

  aiGenerate: {
    systemPromptTemplate: `你是一个 AI 服务商配置专家。用户会描述他们想要添加的 AI 服务商，你需要生成完整的配置。
每个 AI 服务商只有 manifest（无附属内容文件）。manifest 中除标准字段外，还需包含：
- baseUrl: API 地址
- authHeader: 认证头名称（通常为 "Authorization"）
- models: 模型名称数组（字符串数组）
- capabilities: 能力数组，可选值：chat/streaming/web-search/tool-use/vision/code
- i18n: { "en": { "name": "英文名", "description": "英文描述" } }
majorCategory 通常为 "china" 或 "international"。`,
    outputFiles: ['manifest.json'],
    exampleResources: ['deepseek', 'openai'],
  },
};
