import { Metadata } from 'next';
import GdprClient from './GdprClient';

export const metadata: Metadata = {
  title: 'GDPR Compliance - VaultX AI Tools',
  description: 'Learn about VaultX AI Tools GDPR compliance and your data protection rights under the General Data Protection Regulation.',
  keywords: 'GDPR, data protection, privacy rights, compliance, VaultX AI Tools',
  openGraph: {
    title: 'GDPR Compliance - VaultX AI Tools',
    description: 'Learn about VaultX AI Tools GDPR compliance and your data protection rights under the General Data Protection Regulation.',
    type: 'website',
  },
};

export default function GdprPage() {
  return <GdprClient />;
} 