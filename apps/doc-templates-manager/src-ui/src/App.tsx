import { ManagerApp } from '@aidocplus/manager-ui';
import { docTemplatesConfig } from './config';

export function App() {
  return <ManagerApp config={docTemplatesConfig} />;
}
