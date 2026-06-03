import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service - Melanated In Tech',
  description: 'Read the terms and conditions for using Melanated In Tech platform and services.',
  keywords: 'terms of service, terms and conditions, user agreement, Melanated In Tech',
  openGraph: {
    title: 'Terms of Service - Melanated In Tech',
    description: 'Read the terms and conditions for using Melanated In Tech platform and services.',
    type: 'website',
  },
};

export default function TermsPage() {
  return <TermsClient />;
} 