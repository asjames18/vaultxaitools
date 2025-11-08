import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - VaultX Tech',
  description: 'Get in touch with the VaultX Tech team. We\'re here to help with questions about church and ministry media production, consulting services, or collaboration opportunities.',
  keywords: ['contact', 'support', 'feedback', 'church media', 'ministry media', 'media consulting', 'help'],
  openGraph: {
    title: 'Contact Us - VaultX Tech',
    description: 'Get in touch with the VaultX Tech team for support, consulting, and feedback on church and ministry media production.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 