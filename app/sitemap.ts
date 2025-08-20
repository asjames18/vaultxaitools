import { MetadataRoute } from 'next';
import { categories } from '@/data';
import { blogPosts } from '@/data/blog';
import { Tool } from '@/lib/database';
import { createClientWithoutCookies } from '@/lib/supabase-server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://vaultxaitools.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/AITools`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
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
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Fetch tools from database
  let tools: Tool[] = [];
  try {
    const supabase = createClientWithoutCookies();
    const { data: toolsData, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Map database tools to frontend tool type
    tools = (toolsData || []).map(dbTool => ({
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
    priority: 0.8,
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