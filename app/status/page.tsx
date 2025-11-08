import { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
  title: 'System Status - VaultX Tech',
  description: 'Check the current status of VaultX Tech platform, uptime, and any ongoing issues.',
  keywords: 'status, uptime, system health, maintenance, VaultX Tech',
  openGraph: {
    title: 'System Status - VaultX Tech',
    description: 'Check the current status of VaultX Tech platform, uptime, and any ongoing issues.',
    type: 'website',
  },
};

export default function StatusPage() {
  return <StatusClient />;
} 