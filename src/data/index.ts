// Export types and interfaces
export type { Tool, Category } from './tools';

// Export static data for categories (these don't change often)
export { categories } from './tools';

// Import database functions
import { getTools, getToolsByCategory, searchTools as dbSearchTools, getToolById as dbGetToolById } from '@/lib/database';
import type { Tool as StaticTool } from './tools';
import type { Database } from '@/lib/database.types';

type DatabaseTool = Database['public']['Tables']['tools']['Row'];

// Map database tool to frontend tool type
function mapDatabaseToolToTool(dbTool: DatabaseTool): StaticTool {
  return {
    id: dbTool.id,
    name: dbTool.name,
    logo: dbTool.logo,
    description: dbTool.description,
    longDescription: dbTool.long_description || undefined,
    category: dbTool.category,
    rating: dbTool.rating,
    reviewCount: dbTool.review_count,
    weeklyUsers: dbTool.weekly_users,
    growth: dbTool.growth,
    website: dbTool.website,
    pricing: dbTool.pricing,
    features: dbTool.features || undefined,
    pros: dbTool.pros || undefined,
    cons: dbTool.cons || undefined,
    alternatives: dbTool.alternatives || undefined,
    tags: dbTool.tags || undefined,
    createdAt: dbTool.created_at,
    updatedAt: dbTool.updated_at
  };
}

// Database-based functions
export async function getToolsFromDB(): Promise<StaticTool[]> {
  try {
    const dbTools = await getTools();
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error fetching tools from database:', error);
    // Fallback to static data if database fails
    const { tools } = await import('./tools');
    return tools;
  }
}

export async function getToolsByCategoryFromDB(category: string): Promise<StaticTool[]> {
  try {
    const dbTools = await getToolsByCategory(category);
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error fetching tools by category from database:', error);
    // Fallback to static data if database fails
    const { getToolsByCategory: staticGetToolsByCategory } = await import('./tools');
    return staticGetToolsByCategory(category);
  }
}

export async function searchToolsFromDB(query: string): Promise<StaticTool[]> {
  try {
    const dbTools = await dbSearchTools(query);
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error searching tools from database:', error);
    // Fallback to static data if database fails
    const { searchTools: staticSearchTools } = await import('./tools');
    return staticSearchTools(query);
  }
}

export async function getToolByIdFromDB(id: string): Promise<StaticTool | null> {
  try {
    const dbTool = await dbGetToolById(id);
    return dbTool ? mapDatabaseToolToTool(dbTool) : null;
  } catch (error) {
    console.error('Error fetching tool by ID from database:', error);
    // Fallback to static data if database fails
    const { getToolById: staticGetToolById } = await import('./tools');
    const staticTool = staticGetToolById(id);
    return staticTool || null;
  }
}

// Keep static functions for backward compatibility
export { getPopularTools, getTrendingTools, getCategoryByName } from './tools';

// Legacy function that now uses database
export async function searchTools(query: string): Promise<StaticTool[]> {
  return await searchToolsFromDB(query);
}

// Legacy function that now uses database
export async function getToolById(id: string): Promise<StaticTool | null> {
  return await getToolByIdFromDB(id);
} 