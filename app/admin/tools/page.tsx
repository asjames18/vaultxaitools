import { Metadata } from 'next';
import ToolsManagementClient from './ToolsManagementClient';

export const metadata: Metadata = {
  title: 'Tools Management - Admin',
  description: 'Curate and manage tools displayed on VaultX.',
};

export default function ToolsManagementPage() {
  return <ToolsManagementClient />;
}



