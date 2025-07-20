import Link from 'next/link';
import { Suspense } from 'react';
import { categories } from '@/data';
import { getToolsFromDB } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data';
import { Metadata } from 'next';

// Mock data for fallback
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    logo: '🤖',
    description: 'Advanced AI language model for conversation and text generation',
    category: 'Language',
    rating: 4.8,
    reviewCount: 1250,
    weeklyUsers: 50000,
    growth: '+15%',
    website: 'https://chat.openai.com',
    pricing: 'Freemium',
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Midjourney',
    logo: '🎨',
    description: 'AI-powered image generation from text descriptions',
    category: 'Design',
    rating: 4.6,
    reviewCount: 890,
    weeklyUsers: 25000,
    growth: '+25%',
    website: 'https://midjourney.com',
    pricing: 'Paid',
    createdAt: '2022-07-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    logo: '💻',
    description: 'AI pair programmer that helps you write code faster',
    category: 'Development',
    rating: 4.7,
    reviewCount: 1100,
    weeklyUsers: 35000,
    growth: '+30%',
    website: 'https://github.com/features/copilot',
    pricing: 'Paid',
    createdAt: '2022-06-01',
    updatedAt: '2024-01-12'
  }
];

export const metadata: Metadata = {
  title: 'VaultX AI Tools - Discover the Best AI Tools',
  description: 'Find and compare the best AI tools for your needs. From language models to image generators, discover powerful AI solutions.',
  keywords: 'AI tools, artificial intelligence, machine learning, productivity tools',
  authors: [{ name: 'VaultX' }],
  creator: 'VaultX',
  publisher: 'VaultX',
  robots: 'index, follow',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Find and compare the best AI tools for your needs.',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX AI Tools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Find and compare the best AI tools for your needs.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function Home() {
  // Fetch data at the server level
  let tools: Tool[] = [];
  let error: string | null = null;
  
  try {
    tools = await getToolsFromDB();
  } catch (dbError) {
    console.warn('Database load failed, using mock data:', dbError);
    tools = mockTools;
    error = 'Failed to load tools - showing sample data';
  }
  
  // Get popular tools for initial display
  const popularTools = tools
    .sort((a, b) => b.weeklyUsers - a.weeklyUsers)
    .slice(0, 6);

  // Get trending tools (simplified)
  const trendingTools = tools
    .sort((a, b) => parseFloat(b.growth.replace('%', '')) - parseFloat(a.growth.replace('%', '')))
    .slice(0, 6);

  // Mock sponsored tools
  const sponsoredTools: Tool[] = [];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <HomeClient 
        allTools={tools}
        popularTools={popularTools}
        trendingTools={trendingTools}
        sponsoredTools={sponsoredTools}
        error={error}
      />
    </Suspense>
  );
}
