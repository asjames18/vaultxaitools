import Link from 'next/link';
import { categories } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data/tools';
import { createClientWithoutCookies } from '@/lib/supabase-server';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

export default async function HomePage() {
  let allTools: Tool[] = [];
  let popularTools: Tool[] = [];
  let trendingTools: Tool[] = [];
  let sponsoredTools: Tool[] = [];
  let error: string | null = null;

  try {
    // Use server-side Supabase client without cookies
    const supabase = createClientWithoutCookies();
    
    // Fetch tools from database
    const { data: toolsData, error: dbError } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (dbError) {
      throw dbError;
    }
    
    if (toolsData && toolsData.length > 0) {
      // Map database tools to frontend tool type
      allTools = toolsData.map(dbTool => ({
        id: dbTool.id || '',
        name: dbTool.name || '',
        logo: dbTool.logo || '🔧',
        description: dbTool.description || '',
        longDescription: dbTool.long_description || undefined,
        category: dbTool.category || '',
        rating: dbTool.rating || 0,
        reviewCount: dbTool.review_count || 0,
        weeklyUsers: dbTool.weekly_users || 0,
        growth: dbTool.growth || '0%',
        website: dbTool.website || '',
        pricing: dbTool.pricing || 'Unknown',
        features: dbTool.features || undefined,
        pros: dbTool.pros || undefined,
        cons: dbTool.cons || undefined,
        alternatives: dbTool.alternatives || undefined,
        tags: dbTool.tags || undefined,
        createdAt: dbTool.created_at || '',
        updatedAt: dbTool.updated_at || ''
      }));
      
      // Get popular tools (top rated)
      popularTools = allTools
        .filter(tool => tool.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      
      // Get trending tools (most reviews)
      trendingTools = allTools
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 6);
      
      // For now, sponsored tools will be empty since we don't have that field
      sponsoredTools = [];
    }
  } catch (err) {
    error = 'Failed to load tools';
    console.error('Error loading tools:', err);
    
    // Don't fallback to static data - let the error propagate
    allTools = [];
    popularTools = [];
    trendingTools = [];
    sponsoredTools = [];
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
