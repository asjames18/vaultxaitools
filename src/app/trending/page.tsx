import { Metadata } from 'next';
import { getToolsFromDB } from '@/data';
import { 
  getTrendingTools, 
  getTrendingCategories, 
  getTrendingInsights, 
  getTimeBasedTrending 
} from '@/lib/trending';
import TrendingClient from './TrendingClient';
import { generateTrendingMetadata } from '@/lib/seo';
import type { Tool } from '@/data';

export const metadata: Metadata = generateTrendingMetadata();

export default async function Trending() {
  // Fetch data at the server level
  let tools: Tool[] = [];
  
  try {
    tools = await getToolsFromDB();
  } catch (error) {
    console.error('Error loading tools for trending page:', error);
    // Return empty array if database fails
    tools = [];
  }

  // Calculate trending data
  const trendingTools = getTrendingTools(tools, 12);
  const trendingCategories = getTrendingCategories(tools);
  const trendingInsights = getTrendingInsights(tools);
  
  // Get time-based trending for different periods
  const dailyTrending = getTimeBasedTrending(tools, 'day');
  const weeklyTrending = getTimeBasedTrending(tools, 'week');
  const monthlyTrending = getTimeBasedTrending(tools, 'month');

  return (
    <TrendingClient 
      tools={tools}
      trendingTools={trendingTools}
      trendingCategories={trendingCategories}
      trendingInsights={trendingInsights}
      dailyTrending={dailyTrending}
      weeklyTrending={weeklyTrending}
      monthlyTrending={monthlyTrending}
    />
  );
} 