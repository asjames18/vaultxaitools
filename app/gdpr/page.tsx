import { Metadata } from 'next';
import GdprClient from './GdprClient';

export const metadata: Metadata = {
  title: 'GDPR Compliance - Melanated In Tech',
  description: 'Learn about Melanated In Tech GDPR compliance and your data protection rights under the General Data Protection Regulation.',
  keywords: 'GDPR, data protection, privacy rights, compliance, Melanated In Tech',
  openGraph: {
    title: 'GDPR Compliance - Melanated In Tech',
    description: 'Learn about Melanated In Tech GDPR compliance and your data protection rights under the General Data Protection Regulation.',
    type: 'website',
  },
};

export default function GdprPage() {
  return <GdprClient />;
} 