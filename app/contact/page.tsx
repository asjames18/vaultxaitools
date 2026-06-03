import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - Melanated In Tech',
  description: 'Get in touch with the Melanated In Tech team. We\'re here to help with questions about AI, automation, software development, education, or collaboration opportunities.',
  keywords: ['contact', 'support', 'feedback', 'AI education', 'tech learning', 'collaboration', 'help'],
  openGraph: {
    title: 'Contact Us - Melanated In Tech',
    description: 'Get in touch with the Melanated In Tech team for support, learning resources, and collaboration opportunities.',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
} 