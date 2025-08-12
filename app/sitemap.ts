import { MetadataRoute } from 'next';
import { getToolsFromDB } from '@/data';
import { categories } from '@/data';
import { blogPosts } from '@/data/blog';
import { Tool } from '@/lib/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vaultxaitools.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },

    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Fetch tools from database
  let tools: Tool[] = [];
  try {
    tools = await getToolsFromDB();
  } catch (error) {
    console.error('Failed to fetch tools for sitemap:', error);
    // Fallback to empty array if database fails
    tools = [];
  }

  // Tool pages
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/tool/${tool.id}`,
    lastModified: new Date(tool.updatedAt || tool.createdAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Blog post pages
  const blogPostPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...blogPostPages];
} 