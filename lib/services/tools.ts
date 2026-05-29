import {
  getToolByIdClient,
  getToolsClient,
  getToolsByCategoryClient,
  searchToolsClient,
  updateToolRatingClient,
} from '@/lib/database-client';
import { mapDbToolToTool, type Tool } from '@/lib/types/tool';

export type { Tool, Category } from '@/lib/types/tool';

export async function getToolById(id: string): Promise<Tool | null> {
  const dbTool = await getToolByIdClient(id);
  return dbTool ? mapDbToolToTool(dbTool) : null;
}

export async function getTools(): Promise<Tool[]> {
  const dbTools = await getToolsClient();
  return dbTools.map(mapDbToolToTool);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const dbTools = await getToolsByCategoryClient(category);
  return dbTools.map(mapDbToolToTool);
}

export async function searchTools(query: string): Promise<Tool[]> {
  const dbTools = await searchToolsClient(query);
  return dbTools.map(mapDbToolToTool);
}

export async function updateToolRating(
  toolId: string,
  rating: number,
  reviewCount: number
) {
  return updateToolRatingClient(toolId, rating, reviewCount);
}
