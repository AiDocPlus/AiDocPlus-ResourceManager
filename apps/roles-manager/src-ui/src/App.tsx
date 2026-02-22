import { ManagerApp } from '@aidocplus/manager-ui';
import { rolesConfig } from './config';

export function App() {
  return <ManagerApp config={rolesConfig} />;
}
