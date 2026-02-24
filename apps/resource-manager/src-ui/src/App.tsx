import { useEffect, useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ManagerApp } from '@aidocplus/manager-ui';
import { ALL_RESOURCE_TYPES, type ResourceTypeKey, type ResourceTypeMeta } from './configs';

// 资源类型 → bundled-resources 子目录名
const BUNDLED_SUB_DIRS: Record<string, string> = {
  'prompt-templates': 'prompt-templates',
  'doc-templates': 'document-templates',
};

export function App() {
  const [activeType, setActiveType] = useState<ResourceTypeKey>('prompt-templates');
  const [initialResourceType, setInitialResourceType] = useState<string>('');
  const [externalDataDir, setExternalDataDir] = useState<string>('');
  const [bundledDirs, setBundledDirs] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // 初始化：从后端获取 --resource-type、--data-dir，以及各资源类型的 bundled 路径
  useEffect(() => {
    Promise.all([
      invoke<string>('cmd_get_resource_type').catch(() => ''),
      invoke<string | null>('cmd_get_data_dir').catch(() => null),
      // 为每种资源类型查询 bundled-resources 路径
      ...Object.entries(BUNDLED_SUB_DIRS).map(([key, sub]) =>
        invoke<string | null>('cmd_get_bundled_sub_dir', { sub })
          .then((dir) => [key, dir] as [string, string | null])
          .catch(() => [key, null] as [string, string | null])
      ),
    ]).then(([resourceType, dataDir, ...bundledResults]) => {
      const rt = resourceType as string;
      if (rt && ALL_RESOURCE_TYPES.some((t) => t.key === rt)) {
        setActiveType(rt as ResourceTypeKey);
        setInitialResourceType(rt);
      }
      if (dataDir) {
        setExternalDataDir(dataDir as string);
      }
      // 收集 bundled 路径
      const dirs: Record<string, string> = {};
      for (const result of bundledResults) {
        const [key, dir] = result as [string, string | null];
        if (dir) dirs[key] = dir;
      }
      setBundledDirs(dirs);
      console.log('[DEBUG] 初始化完成:', { resourceType, dataDir, bundledDirs: dirs });
      setInitialized(true);
    });
  }, []);

  // 获取当前活跃类型的配置
  const activeMeta = ALL_RESOURCE_TYPES.find((t) => t.key === activeType)!;

  // 计算当前类型的 config，自动填充数据目录
  const getConfigForType = useCallback(
    (meta: ResourceTypeMeta) => {
      const config = { ...meta.config };

      // 启动时指定的资源类型：使用主程序传入的 --data-dir
      if (meta.key === initialResourceType && externalDataDir) {
        config.defaultDataDir = externalDataDir;
      }
      // 其他类型：使用 bundled-resources 路径
      else if (bundledDirs[meta.key]) {
        config.defaultDataDir = bundledDirs[meta.key];
      }
      // fallback：从 externalDataDir 推导兄弟资源类型的路径
      // 例如 externalDataDir = .../bundled-resources/prompt-templates
      // 则 doc-templates 的路径 = .../bundled-resources/document-templates
      else if (externalDataDir && BUNDLED_SUB_DIRS[meta.key]) {
        // 跨平台：同时匹配 / 和 \（Windows 路径使用反斜杠）
        const sep = externalDataDir.includes('\\') ? '\\' : '/';
        const parentDir = externalDataDir.replace(/[/\\][^/\\]+[/\\]?$/, '');
        config.defaultDataDir = `${parentDir}${sep}${BUNDLED_SUB_DIRS[meta.key]}`;
      }

      return config;
    },
    [initialResourceType, externalDataDir, bundledDirs]
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
