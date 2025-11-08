import { Metadata } from 'next';
import DocumentationClient from './DocumentationClient';

export const metadata: Metadata = {
  title: 'Documentation - VaultX Tech',
  description: 'Learn how to use VaultX Tech platform, submit media resources, write reviews, and navigate the features for church and ministry media production.',
  keywords: 'documentation, help, guide, how to use, VaultX Tech, tutorial, church media, ministry media',
  openGraph: {
    title: 'Documentation - VaultX Tech',
    description: 'Learn how to use VaultX Tech platform, submit media resources, write reviews, and navigate the features for church and ministry media production.',
    type: 'website',
  },
};

export default function DocumentationPage() {
  return <DocumentationClient />;
} 