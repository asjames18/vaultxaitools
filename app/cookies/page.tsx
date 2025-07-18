import { Metadata } from 'next';
import CookiesClient from './CookiesClient';

export const metadata: Metadata = {
  title: 'Cookie Policy - VaultX AI Tools',
  description: 'Learn how VaultX AI Tools uses cookies and similar technologies to enhance your experience.',
  keywords: 'cookie policy, cookies, tracking, privacy, VaultX AI Tools',
  openGraph: {
    title: 'Cookie Policy - VaultX AI Tools',
    description: 'Learn how VaultX AI Tools uses cookies and similar technologies to enhance your experience.',
    type: 'website',
  },
};

export default function CookiesPage() {
  return <CookiesClient />;
} 