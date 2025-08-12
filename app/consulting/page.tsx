import type { Metadata } from 'next';
import ConsultingClient from './ConsultingClient';

export const metadata: Metadata = {
  title: 'AI Consulting Services - Expert AI Strategy & Implementation | VaultX',
  description: 'Get expert AI consulting services from VaultX. We help businesses implement AI solutions, develop AI strategies, and transform operations with cutting-edge artificial intelligence.',
  keywords: 'AI consulting, artificial intelligence consulting, AI strategy, AI implementation, AI transformation, machine learning consulting, AI business solutions',
  openGraph: {
    title: 'AI Consulting Services - Expert AI Strategy & Implementation | VaultX',
    description: 'Get expert AI consulting services from VaultX. We help businesses implement AI solutions, develop AI strategies, and transform operations.',
    type: 'website',
  },
};

export default function Consulting() {
  return <ConsultingClient />;
}
