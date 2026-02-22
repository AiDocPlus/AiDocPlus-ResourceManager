import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { RoleEditor } from './panels/RoleEditor';
import { AIProviderEditor } from './panels/AIProviderEditor';
import { PromptTemplateEditor } from './panels/PromptTemplateEditor';
import { ProjectTemplateEditor } from './panels/ProjectTemplateEditor';
import { DocTemplateEditor } from './panels/DocTemplateEditor';
import { PluginEditor } from './panels/PluginEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

// ============================================================
// 资源类型标识
// ============================================================

export type ResourceTypeKey =
  | 'roles'
  | 'ai-providers'
  | 'prompt-templates'
  | 'project-templates'
  | 'doc-templates'
  | 'plugins';

// ============================================================
// 资源类型元信息（用于切换栏显示）
// ============================================================

export interface ResourceTypeMeta {
  key: ResourceTypeKey;
  label: string;
  icon: string;
  config: ResourceTypeConfig<ComponentType<EditorPanelProps>>;
  /** 默认数据目录子路径（相对于 ~/AiDocPlus/），null 表示需要外部传入 */
  dataDirSuffix: string | null;
}

// ============================================================
// 6 种资源类型配置
// ============================================================

const rolesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '角色管理器',
  resourceType: 'role',
  resourceLabel: '角色',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Roles/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Roles' : undefined,
  contentFiles: [
    { filename: 'system-prompt.md', type: 'markdown', label: '系统提示词', defaultContent: '# 系统提示词\n\n请在此输入角色的系统提示词...' },
  ],
  extraManifestFields: [
    { key: 'i18n', label: '国际化', type: 'i18n-editor' },
  ],
  CustomEditorPanel: RoleEditor,
  defaultManifest: { resourceType: 'role', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
  hasRolesField: false,
  aiGenerate: {
    systemPromptTemplate: `你是一个 AI 角色创建专家。用户会描述他们想要的角色，你需要生成完整的角色定义。
每个角色包含一个 manifest（元数据）和一个 system-prompt.md（系统提示词，Markdown 格式）。
system-prompt.md 应详细定义角色的行为、专业领域、回答风格、限制条件等，内容充实完整。
manifest 中应包含 i18n 字段提供英文翻译：i18n: { "en": { "name": "英文名", "description": "英文描述" } }。`,
    outputFiles: ['manifest.json', 'system-prompt.md'],
    exampleResources: ['default', 'programmer'],
  },
};

const aiProvidersConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
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
  defaultManifest: { resourceType: 'ai-provider', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
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

const promptTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '提示词模板管理器',
  resourceType: 'prompt-template',
  resourceLabel: '提示词模板',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-PromptTemplates/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-PromptTemplates' : undefined,
  dataMode: 'json-file',
  contentFiles: [
    { filename: 'content.md', type: 'markdown', label: '提示词内容', defaultContent: '# 提示词模板\n\n请在此输入提示词内容...' },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: PromptTemplateEditor,
  defaultManifest: { resourceType: 'prompt-template', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
  hasRolesField: true,
  aiGenerate: {
    systemPromptTemplate: `你是一个提示词模板创建专家。用户会描述他们想要的提示词模板，你需要生成完整的资源。
每个提示词模板包含一个 manifest（元数据）和一个 content.md（提示词正文，Markdown 格式）。
content.md 应包含详细的提示词模板内容，结构清晰，可直接使用。`,
    outputFiles: ['manifest.json', 'content.md'],
    exampleResources: ['academic-abstract', 'code-review'],
  },
};

const projectTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '项目模板管理器',
  resourceType: 'project-template',
  resourceLabel: '项目模板',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-ProjectTemplates/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-ProjectTemplates' : undefined,
  contentFiles: [
    { filename: 'content.json', type: 'json', label: '模板内容', defaultContent: JSON.stringify({ authorNotes: '', aiGeneratedContent: '', content: '' }, null, 2) },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: ProjectTemplateEditor,
  defaultManifest: { resourceType: 'project-template', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
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

const docTemplatesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '文档模板管理器',
  resourceType: 'doc-template',
  resourceLabel: '文档模板',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-DocTemplates/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-DocTemplates' : undefined,
  contentFiles: [
    { filename: 'content.json', type: 'json', label: '模板内容', defaultContent: JSON.stringify({ authorNotes: '', content: '' }, null, 2) },
  ],
  extraManifestFields: [
    { key: 'roles', label: '关联角色', type: 'tags' },
  ],
  CustomEditorPanel: DocTemplateEditor,
  defaultManifest: { resourceType: 'doc-template', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
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

const pluginsConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
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
  defaultManifest: { resourceType: 'plugin', version: '1.0.0', author: 'AiDocPlus', enabled: true, source: isDevMode ? 'builtin' : 'custom', tags: [], order: 0 },
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

// ============================================================
// 所有资源类型列表（用于切换栏）
// ============================================================

export const ALL_RESOURCE_TYPES: ResourceTypeMeta[] = [
  { key: 'roles',              label: '角色',       icon: '👤', config: rolesConfig,            dataDirSuffix: 'Roles' },
  { key: 'ai-providers',       label: 'AI服务商',   icon: '🤖', config: aiProvidersConfig,      dataDirSuffix: 'AIProviders' },
  { key: 'prompt-templates',   label: '提示词模板', icon: '📝', config: promptTemplatesConfig,  dataDirSuffix: null },
  { key: 'project-templates',  label: '项目模板',   icon: '📄', config: projectTemplatesConfig, dataDirSuffix: 'ProjectTemplates' },
  { key: 'doc-templates',      label: '文档模板',   icon: '📑', config: docTemplatesConfig,     dataDirSuffix: 'DocTemplates' },
  { key: 'plugins',            label: '插件',       icon: '🔌', config: pluginsConfig,          dataDirSuffix: 'Plugins' },
];

export function getResourceTypeMeta(key: string): ResourceTypeMeta | undefined {
  return ALL_RESOURCE_TYPES.find((t) => t.key === key);
}
