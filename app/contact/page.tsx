import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - VaultX AI Tools',
  description: 'Get in touch with the VaultX AI Tools team. We\'re here to help with questions, feedback, or collaboration opportunities.',
  keywords: ['contact', 'support', 'feedback', 'AI tools', 'help'],
  openGraph: {
    title: 'Contact Us - VaultX AI Tools',
    description: 'Get in touch with the VaultX AI Tools team for support and feedback.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 