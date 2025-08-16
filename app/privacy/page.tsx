import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - VaultX AI Tools',
  description: 'Learn how VaultX AI Tools collects, uses, and protects your personal information.',
  keywords: 'privacy policy, data protection, GDPR, user privacy, VaultX AI Tools',
  openGraph: {
    title: 'Privacy Policy - VaultX AI Tools',
    description: 'Learn how VaultX AI Tools collects, uses, and protects your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
} 