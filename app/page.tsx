import Link from 'next/link';
import { categories } from '@/data/tools';
import { getToolsFromDB } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data/tools';

export default async function HomePage() {
  let allTools: Tool[] = [];
  let popularTools: Tool[] = [];
  let trendingTools: Tool[] = [];
  let sponsoredTools: Tool[] = [];
  let error: string | null = null;

  try {
    // Fetch tools from database
    const toolsData = await getToolsFromDB();
    
    if (toolsData && toolsData.length > 0) {
      allTools = toolsData;
      
      // Get popular tools (top rated)
      popularTools = toolsData
        .filter(tool => tool.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      
      // Get trending tools (most reviews)
      trendingTools = toolsData
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 6);
      
      // For now, sponsored tools will be empty since we don't have that field
      // In the future, you can add a sponsored field to the Tool interface
      sponsoredTools = [];
    } else {
      // Fallback to sample data if no tools found
      error = "No tools found in database";
      popularTools = [
        {
          id: '1',
          name: 'ChatGPT',
          logo: '🤖',
          description: 'Advanced language model for conversation and text generation',
          category: 'Language',
          rating: 4.7,
          reviewCount: 1200000,
          weeklyUsers: 15420,
          growth: '+45%',
          website: 'https://chat.openai.com',
          pricing: 'Freemium',
          features: ['Text Generation', 'Conversation', 'Code Help'],
          tags: ['AI', 'Language', 'Chatbot']
        },
        {
          id: '2',
          name: 'Midjourney',
          logo: '🎨',
          description: 'AI-powered image generation from text descriptions',
          category: 'Image',
          rating: 4.6,
          reviewCount: 230000,
          weeklyUsers: 12850,
          growth: '+32%',
          website: 'https://midjourney.com',
          pricing: 'Paid',
          features: ['Image Generation', 'Text-to-Image', 'Art'],
          tags: ['AI', 'Image', 'Art']
        }
      ];
    }
  } catch (err) {
    console.error('Error fetching tools:', err);
    error = "Failed to load tools";
    
    // Fallback sample data
    popularTools = [
      {
        id: '1',
        name: 'ChatGPT',
        logo: '🤖',
        description: 'Advanced language model for conversation and text generation',
        category: 'Language',
        rating: 4.7,
        reviewCount: 1200000,
        weeklyUsers: 15420,
        growth: '+45%',
        website: 'https://chat.openai.com',
        pricing: 'Freemium',
        features: ['Text Generation', 'Conversation', 'Code Help'],
        tags: ['AI', 'Language', 'Chatbot']
      }
    ];
  }

  return <HomeClient 
    allTools={allTools}
    popularTools={popularTools}
    trendingTools={trendingTools}
    sponsoredTools={sponsoredTools}
    error={error}
  />;
}
