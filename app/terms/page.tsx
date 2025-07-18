import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service - VaultX AI Tools',
  description: 'Read the terms and conditions for using VaultX AI Tools platform and services.',
  keywords: 'terms of service, terms and conditions, user agreement, VaultX AI Tools',
  openGraph: {
    title: 'Terms of Service - VaultX AI Tools',
    description: 'Read the terms and conditions for using VaultX AI Tools platform and services.',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
} 