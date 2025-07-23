import Link from 'next/link';
import { categories } from '@/data';
import { getToolsFromDB } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data/tools';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

export default async function HomePage() {
  let allTools: Tool[] = [];
  let popularTools: Tool[] = [];
  let trendingTools: Tool[] = [];
  let sponsoredTools: Tool[] = [];
  let error: string | null = null;

  try {
    // Fetch tools from database with cache tags for fine-grained invalidation
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
    }
  } catch (err) {
    console.error('Error loading tools for home page:', err);
    error = 'Failed to load tools';
  }

  return (
    <HomeClient 
      allTools={allTools}
      popularTools={popularTools}
      trendingTools={trendingTools}
      sponsoredTools={sponsoredTools}
      error={error}
      categories={categories}
    />
  );
}
