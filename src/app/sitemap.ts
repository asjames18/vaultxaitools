import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { categories } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
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

  return [...staticPages, ...toolPages, ...categoryPages];
} 