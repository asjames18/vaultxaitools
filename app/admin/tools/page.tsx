import { Metadata } from 'next';
import ToolsManagementClient from './ToolsManagementClient';

export const metadata: Metadata = {
  title: 'Tools Management - Admin',
  description: 'Curate and manage tools displayed on Melanated In Tech.',
};

export default function ToolsManagementPage() {
  return <ToolsManagementClient />;
}



