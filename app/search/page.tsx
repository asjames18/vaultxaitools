import { getToolsFromDB, categories } from '@/data';
import SearchClient from './SearchClient';
import type { Tool } from '@/data/tools';

export default async function SearchPage() {
  // Fetch data at the server level
  let tools: Tool[] = [];
  
  try {
    tools = await getToolsFromDB();
  } catch (error) {
    console.error('Error loading tools for search page:', error);
    // Return empty array if database fails
    tools = [];
  }

  return <SearchClient tools={tools} categories={categories} />;
} 