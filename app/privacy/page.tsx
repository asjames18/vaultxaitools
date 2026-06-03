import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy - Melanated In Tech',
  description: 'Learn how Melanated In Tech collects, uses, and protects your personal information.',
  keywords: 'privacy policy, data protection, GDPR, user privacy, Melanated In Tech',
  openGraph: {
    title: 'Privacy Policy - Melanated In Tech',
    description: 'Learn how Melanated In Tech collects, uses, and protects your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
} 