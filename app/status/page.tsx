import { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
  title: 'System Status - Melanated In Tech',
  description: 'Check the current status of Melanated In Tech platform, uptime, and any ongoing issues.',
  keywords: 'status, uptime, system health, maintenance, Melanated In Tech',
  openGraph: {
    title: 'System Status - Melanated In Tech',
    description: 'Check the current status of Melanated In Tech platform, uptime, and any ongoing issues.',
    type: 'website',
  },
};

export default function StatusPage() {
  return <StatusClient />;
} 