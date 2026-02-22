import { ManagerApp } from '@aidocplus/manager-ui';
import { projectTemplatesConfig } from './config';

export function App() {
  return <ManagerApp config={projectTemplatesConfig} />;
}
