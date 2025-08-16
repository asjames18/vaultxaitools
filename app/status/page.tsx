import { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
  title: 'System Status - VaultX AI Tools',
  description: 'Check the current status of VaultX AI Tools platform, uptime, and any ongoing issues.',
  keywords: 'status, uptime, system health, maintenance, VaultX AI Tools',
  openGraph: {
    title: 'System Status - VaultX AI Tools',
    description: 'Check the current status of VaultX AI Tools platform, uptime, and any ongoing issues.',
    type: 'website',
  },
};

export default function StatusPage() {
  return <StatusClient />;
} 