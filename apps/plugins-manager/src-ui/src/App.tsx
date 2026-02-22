import { ManagerApp } from '@aidocplus/manager-ui';
import { pluginsConfig } from './config';

export function App() {
  return <ManagerApp config={pluginsConfig} />;
}
