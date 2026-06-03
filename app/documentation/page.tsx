import { Metadata } from 'next';
import DocumentationClient from './DocumentationClient';

export const metadata: Metadata = {
  title: 'Documentation - Melanated In Tech',
  description: 'Learn how to use the Melanated In Tech platform — browse AI tools, submit resources, write reviews, and navigate all features to support your tech learning journey.',
  keywords: 'documentation, help, guide, how to use, Melanated In Tech, tutorial, AI tools, tech education',
  openGraph: {
    title: 'Documentation - Melanated In Tech',
    description: 'Learn how to use the Melanated In Tech platform to discover AI tools, submit resources, and support your tech learning journey.',
    type: 'website',
  },
};

export default function DocumentationPage() {
  return <DocumentationClient />;
} 