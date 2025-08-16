// Export types and interfaces
export type { Tool, Category } from './tools';

// Export static data for categories (these don't change often)
export { categories } from './tools';

// Import client-side database functions
import { 
  getToolsClient, 
  getToolsByCategoryClient, 
  searchToolsClient, 
  getToolByIdClient,
  getReviewsByToolIdClient,
  addReviewClient,
  updateReviewHelpfulClient,
  updateToolRatingClient
} from '@/lib/database-client';
import type { Tool as StaticTool } from './tools';
import type { Database } from '@/lib/database.types';

type DatabaseTool = Database['public']['Tables']['tools']['Row'];
type DatabaseReview = Database['public']['Tables']['reviews']['Row'];
type DatabaseReviewInsert = Database['public']['Tables']['reviews']['Insert'];

// Map database tool to frontend tool type
function mapDatabaseToolToTool(dbTool: DatabaseTool): StaticTool {
  return {
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
  };
}

// Database-based functions
export async function getToolsFromDB(): Promise<StaticTool[]> {
  try {
    const dbTools = await getToolsClient();
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error fetching tools from database:', error);
    throw error; // Don't fallback to static data, let the error propagate
  }
}

export async function getToolsByCategoryFromDB(category: string): Promise<StaticTool[]> {
  try {
    const dbTools = await getToolsByCategoryClient(category);
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error fetching tools by category from database:', error);
    throw error; // Don't fallback to static data, let the error propagate
  }
}

export async function searchToolsFromDB(query: string): Promise<StaticTool[]> {
  try {
    const dbTools = await searchToolsClient(query);
    return dbTools.map(mapDatabaseToolToTool);
  } catch (error) {
    console.error('Error searching tools from database:', error);
    throw error; // Don't fallback to static data, let the error propagate
  }
}

export async function getToolByIdFromDB(id: string): Promise<StaticTool | null> {
  try {
    const dbTool = await getToolByIdClient(id);
    return dbTool ? mapDatabaseToolToTool(dbTool) : null;
  } catch (error) {
    console.error('Error fetching tool by ID from database:', error);
    throw error; // Don't fallback to static data, let the error propagate
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

// Review functions
export async function getReviewsByToolIdFromDB(toolId: string): Promise<DatabaseReview[]> {
  try {
    return await getReviewsByToolIdClient(toolId);
  } catch (error) {
    console.error('Error fetching reviews from database:', error);
    throw error; // Don't fallback to static data, let the error propagate
  }
}

export async function addReviewToDB(review: DatabaseReviewInsert): Promise<DatabaseReview> {
  try {
    return await addReviewClient(review);
  } catch (error) {
    console.error('Error adding review to database:', error);
    throw error;
  }
}

export async function updateReviewHelpfulInDB(reviewId: string, helpful: number): Promise<DatabaseReview> {
  try {
    return await updateReviewHelpfulClient(reviewId, helpful);
  } catch (error) {
    console.error('Error updating review helpful count in database:', error);
    throw error;
  }
}

export async function updateToolRatingInDB(toolId: string, rating: number, reviewCount: number): Promise<DatabaseTool> {
  try {
    return await updateToolRatingClient(toolId, rating, reviewCount);
  } catch (error) {
    console.error('Error updating tool rating in database:', error);
    throw error;
  }
} 