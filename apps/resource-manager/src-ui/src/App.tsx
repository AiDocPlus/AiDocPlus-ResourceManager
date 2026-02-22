import { useEffect, useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ManagerApp } from '@aidocplus/manager-ui';
import { ALL_RESOURCE_TYPES, type ResourceTypeKey, type ResourceTypeMeta } from './configs';

export function App() {
  const [activeType, setActiveType] = useState<ResourceTypeKey>('roles');
  const [promptTemplatesDataDir, setPromptTemplatesDataDir] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  // 初始化：从后端获取 --resource-type 和 --data-dir
  useEffect(() => {
    Promise.all([
      invoke<string>('cmd_get_resource_type').catch(() => ''),
      invoke<string | null>('cmd_get_data_dir').catch(() => null),
    ]).then(([resourceType, dataDir]) => {
      if (resourceType && ALL_RESOURCE_TYPES.some((t) => t.key === resourceType)) {
        setActiveType(resourceType as ResourceTypeKey);
      }
      if (dataDir) {
        setPromptTemplatesDataDir(dataDir);
      }
      setInitialized(true);
    });
  }, []);

  // 获取当前活跃类型的配置
  const activeMeta = ALL_RESOURCE_TYPES.find((t) => t.key === activeType)!;

  // 计算当前类型的 config（可能需要覆盖 defaultDataDir）
  const getConfigForType = useCallback(
    (meta: ResourceTypeMeta) => {
      const config = { ...meta.config };
      // 提示词模板：使用主程序传入的 data-dir
      if (meta.key === 'prompt-templates' && promptTemplatesDataDir) {
        config.defaultDataDir = promptTemplatesDataDir;
      }
      return config;
    },
    [promptTemplatesDataDir]
  );

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        加载中...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* 左侧资源类型切换栏 */}
      <div className="w-[52px] shrink-0 flex flex-col items-center py-2 gap-1 bg-muted/40 border-r border-border">
        {ALL_RESOURCE_TYPES.map((meta) => (
          <button
            key={meta.key}
            onClick={() => setActiveType(meta.key)}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-lg
              transition-colors cursor-pointer
              ${activeType === meta.key
                ? 'bg-primary/10 ring-1 ring-primary/30'
                : 'hover:bg-muted/80'
              }
            `}
            title={meta.label}
          >
            {meta.icon}
          </button>
        ))}
      </div>

      {/* 右侧管理器主体 */}
      <div className="flex-1 min-w-0">
        <ManagerApp
          key={activeType}
          config={getConfigForType(activeMeta)}
        />
      </div>
    </div>
  );
}
