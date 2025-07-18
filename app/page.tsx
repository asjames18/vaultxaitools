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
      
      // Get sponsored tools (if any)
      sponsoredTools = toolsData
        .filter(tool => tool.sponsored)
        .slice(0, 3);
    } else {
      // Fallback to sample data if no tools found
      error = "No tools found in database";
      popularTools = [
        {
          id: '1',
          name: 'ChatGPT',
          description: 'Advanced language model for conversation and text generation',
          url: 'https://chat.openai.com',
          category: 'Language',
          rating: 4.7,
          reviewCount: 1200000,
          pricing: 'Freemium',
          sponsored: false,
          image: '/api/placeholder/400/300',
          features: ['Text Generation', 'Conversation', 'Code Help'],
          tags: ['AI', 'Language', 'Chatbot']
        },
        {
          id: '2',
          name: 'Midjourney',
          description: 'AI-powered image generation from text descriptions',
          url: 'https://midjourney.com',
          category: 'Image',
          rating: 4.6,
          reviewCount: 230000,
          pricing: 'Paid',
          sponsored: false,
          image: '/api/placeholder/400/300',
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
        description: 'Advanced language model for conversation and text generation',
        url: 'https://chat.openai.com',
        category: 'Language',
        rating: 4.7,
        reviewCount: 1200000,
        pricing: 'Freemium',
        sponsored: false,
        image: '/api/placeholder/400/300',
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
