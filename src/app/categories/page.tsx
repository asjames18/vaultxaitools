import { getToolsFromDB } from '@/data';
import CategoriesClient from './CategoriesClient';
import type { Tool } from '@/data';

export default async function Categories() {
  // Fetch data at the server level
  let tools: Tool[] = [];
  
  try {
    tools = await getToolsFromDB();
  } catch (error) {
    console.error('Error loading tools for categories page:', error);
    // Return empty array if database fails
    tools = [];
  }

  return <CategoriesClient tools={tools} />;
} 