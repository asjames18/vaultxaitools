import { getToolsFromDB } from '@/data';
import CategoriesClient from './CategoriesClient';
import type { Tool } from '@/data';
import type { Metadata } from 'next';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'AI Tools - Discover the Best AI Applications | VaultX',
  description: 'Explore our curated collection of AI tools across all categories. Find the perfect AI solution for your needs with detailed reviews, ratings, and comparisons.',
  keywords: 'AI tools, artificial intelligence, machine learning, AI applications, AI software, AI platforms',
  openGraph: {
    title: 'AI Tools - Discover the Best AI Applications | VaultX',
    description: 'Explore our curated collection of AI tools across all categories. Find the perfect AI solution for your needs.',
    type: 'website',
  },
};

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