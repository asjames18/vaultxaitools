import { Metadata } from 'next';
import CookiesClient from './CookiesClient';

export const metadata: Metadata = {
  title: 'Cookie Policy - Melanated In Tech',
  description: 'Learn how Melanated In Tech uses cookies and similar technologies to enhance your experience.',
  keywords: 'cookie policy, cookies, tracking, privacy, Melanated In Tech',
  openGraph: {
    title: 'Cookie Policy - Melanated In Tech',
    description: 'Learn how Melanated In Tech uses cookies and similar technologies to enhance your experience.',
    type: 'website',
  },
};

export default function CookiesPage() {
  return <CookiesClient />;
} 