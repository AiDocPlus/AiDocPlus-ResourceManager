import { ManagerApp } from '@aidocplus/manager-ui';
import { promptTemplatesConfig } from './config';

export function App() {
  return <ManagerApp config={promptTemplatesConfig} />;
}
