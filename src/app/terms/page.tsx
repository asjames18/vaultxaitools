import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for VaultX AI Tools',
};

export default function TermsPage() {
  return <TermsClient />;
} 