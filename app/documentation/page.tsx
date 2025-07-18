import { Metadata } from 'next';
import DocumentationClient from './DocumentationClient';

export const metadata: Metadata = {
  title: 'Documentation - VaultX AI Tools',
  description: 'Learn how to use VaultX AI Tools platform, submit tools, write reviews, and navigate the features.',
  keywords: 'documentation, help, guide, how to use, VaultX AI Tools, tutorial',
  openGraph: {
    title: 'Documentation - VaultX AI Tools',
    description: 'Learn how to use VaultX AI Tools platform, submit tools, write reviews, and navigate the features.',
    type: 'website',
  },
};

export default function DocumentationPage() {
  return <DocumentationClient />;
} 