import { Metadata } from 'next';
import CookiesClient from './CookiesClient';

export const metadata: Metadata = {
  title: 'Cookie Policy - VaultX Tech',
  description: 'Learn how VaultX Tech uses cookies and similar technologies to enhance your experience.',
  keywords: 'cookie policy, cookies, tracking, privacy, VaultX Tech',
  openGraph: {
    title: 'Cookie Policy - VaultX Tech',
    description: 'Learn how VaultX Tech uses cookies and similar technologies to enhance your experience.',
    type: 'website',
  },
};

export default function CookiesPage() {
  return <CookiesClient />;
} 