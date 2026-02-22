import type { ResourceTypeConfig } from '@aidocplus/manager-shared';
import type { ComponentType } from 'react';
import type { EditorPanelProps } from '@aidocplus/manager-shared';
import { RoleEditor } from './panels/RoleEditor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDevMode = !!(import.meta as any).env?.DEV;

export const rolesConfig: ResourceTypeConfig<ComponentType<EditorPanelProps>> = {
  appTitle: '角色管理器',
  resourceType: 'role',
  resourceLabel: '角色',
  defaultDataDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Roles/data' : '',
  repoDir: isDevMode ? '/Users/jdh/Code/AiDocPlus-Roles' : undefined,
  contentFiles: [
    {
      filename: 'system-prompt.md',
      type: 'markdown',
      label: '系统提示词',
      defaultContent: '# 系统提示词\n\n请在此输入角色的系统提示词...',
    },
  ],
  extraManifestFields: [
    {
      key: 'i18n',
      label: '国际化',
      type: 'i18n-editor',
    },
  ],
  CustomEditorPanel: RoleEditor,
  defaultManifest: {
    resourceType: 'role',
    version: '1.0.0',
    author: 'AiDocPlus',
    enabled: true,
    source: isDevMode ? 'builtin' : 'custom',
    tags: [],
    order: 0,
  },
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
