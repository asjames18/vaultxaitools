import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - VaultX Tech',
  description: 'Learn how VaultX Tech collects, uses, and protects your personal information.',
  keywords: 'privacy policy, data protection, GDPR, user privacy, VaultX Tech',
  openGraph: {
    title: 'Privacy Policy - VaultX Tech',
    description: 'Learn how VaultX Tech collects, uses, and protects your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
} 