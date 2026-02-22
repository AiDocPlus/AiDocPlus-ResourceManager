import { ManagerApp } from '@aidocplus/manager-ui';
import { aiProvidersConfig } from './config';

export function App() {
  return <ManagerApp config={aiProvidersConfig} />;
}
