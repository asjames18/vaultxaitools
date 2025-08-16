import type { Metadata } from 'next';
import GettingStartedClient from './GettingStartedClient';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Getting Started with AI Tools | VaultX',
  description: 'Learn how to find, compare, and use the best AI tools for your needs. A comprehensive guide for beginners to AI tools.',
  keywords: 'AI tools guide, getting started with AI, AI tools tutorial, how to use AI tools, AI tools for beginners',
  openGraph: {
    title: 'Getting Started with AI Tools | VaultX',
    description: 'Learn how to find, compare, and use the best AI tools for your needs.',
    type: 'website',
  },
};

export default function GettingStarted() {
  return (
    <div className="w-full">
      <GettingStartedClient />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Getting Started with AI Tools',
        description: 'A comprehensive guide for beginners to find and use AI tools effectively',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Browse AI Tools',
            text: 'Explore our curated collection of AI tools organized by category and use case'
          },
          {
            '@type': 'HowToStep',
            name: 'Filter and Search',
            text: 'Use our advanced filters to find tools that match your specific needs'
          },
          {
            '@type': 'HowToStep',
            name: 'Compare Tools',
            text: 'Compare features, pricing, and capabilities to make informed decisions'
          },
          {
            '@type': 'HowToStep',
            name: 'Get Started',
            text: 'Visit tool websites and start using AI tools to enhance your productivity'
          }
        ]
      }} />
    </div>
  );
}
