import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { PluginEditor } from './panels/PluginEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const pluginsConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '插件管理器',
  resourceType: 'plugin',
  resourceLabel: '插件',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Plugins/plugins' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Plugins' : undefined,
  contentFiles: [],
  extraManifestFields: [
    { key: 'type', label: '插件类型', type: 'select', options: [
      { value: 'content-generation', label: '内容生成' },
      { value: 'functional', label: '功能扩展' },
    ]},
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: PluginEditor,
  defaultManifest: {
    resourceType: 'plugin',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
  hasRolesField: true,

  aiGenerate: {
    systemPromptTemplate: `你是一个 AiDocPlus 插件创建专家。用户会描述他们想要的插件功能，你需要生成插件的配置。
每个插件只有 manifest（无附属内容文件），插件源码需开发者手动编写。manifest 中除标准字段外，还需包含：
- type: "content-generation"（内容生成类）或 "functional"（功能扩展类）
- roles: 关联角色数组（如 ["default", "programmer"]）
- i18n: { "en": { "name": "英文名", "description": "英文描述" } }
id 建议使用简短有意义的英文标识符。`,
    outputFiles: ['manifest.json'],
    exampleResources: ['summary', 'translator'],
  },
};
