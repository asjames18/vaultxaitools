import Link from 'next/link';
import { categories } from '@/data';
import { getToolsFromDB } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data';

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
    <HomeClient 
      allTools={tools}
      popularTools={popularTools}
      trendingTools={trendingTools}
      sponsoredTools={sponsoredTools}
      error={error}
    />
  );
}
