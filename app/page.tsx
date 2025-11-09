import { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data';
import HomeClient from './HomeClient';
import HomeErrorFallback from './HomeErrorFallback';
import type { Tool } from '@/data/tools';
import { createClientWithoutCookies } from '@/lib/supabase-server';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

// Add cache tags for on-demand revalidation
export const tags = ['tools', 'homepage'];

// Generate metadata for homepage
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'VaultX Tech - Church & Ministry Media Consultant',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production. Expert advice for video editing, graphics design, social media, live streaming, and audio production.',
    keywords: [
      'church media consultant',
      'ministry media tools',
      'church video production',
      'ministry graphics design',
      'church social media',
      'ministry live streaming',
      'church audio production',
      'ministry media resources',
      'church media guidance',
      'ministry media consulting',
      'church media tutorials',
      'ministry media best practices'
    ],
    openGraph: {
      title: 'VaultX Tech - Church & Ministry Media Consultant',
      description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production.',
      url: 'https://vaultxaitools.com',
      siteName: 'VaultX Tech',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'VaultX Tech - Church & Ministry Media Consultant',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vaultxaitools',
      creator: '@vaultxaitools',
      title: 'VaultX Tech - Church & Ministry Media Consultant',
      description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production.',
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default async function HomePage() {
  try {
    let allTools: Tool[] = [];
    let popularTools: Tool[] = [];
    let trendingTools: Tool[] = [];
    let sponsoredTools: Tool[] = [];
    let error: string | null = null;

    try {
      // Use server-side Supabase client without cookies
      const supabase = createClientWithoutCookies();
      
      // Check if environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Missing Supabase environment variables');
        error = 'Configuration error - missing database credentials';
        // Return with empty data instead of crashing
        return (
          <HomeClient 
            allTools={[]}
            popularTools={[]}
            trendingTools={[]}
            sponsoredTools={[]}
            error={error}
            categories={[]}
          />
        );
      }
      
      // Fetch tools from database
      const { data: toolsData, error: dbError } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dbError) {
        console.error('Database error:', dbError);
        error = 'Failed to load tools from database';
        // Return with empty data instead of crashing
        return (
          <HomeClient 
            allTools={[]}
            popularTools={[]}
            trendingTools={[]}
            sponsoredTools={[]}
            error={error}
            categories={[]}
          />
        );
      }
      
      if (toolsData && toolsData.length > 0) {
        // Map database tools to frontend tool type
        allTools = toolsData.map(dbTool => ({
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
        
        // Get popular tools (top rated)
        popularTools = allTools
          .filter(tool => tool.rating >= 4.0)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);
        
        // Get trending tools (most reviews)
        trendingTools = allTools
          .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
          .slice(0, 6);
        
        // For now, sponsored tools will be empty since we don't have that field
        sponsoredTools = [];
      }
    } catch (err) {
      console.error('Error loading tools:', err);
      error = 'Failed to load tools';
      
      // Don't fallback to static data - let the error propagate
      allTools = [];
      popularTools = [];
      trendingTools = [];
      sponsoredTools = [];
    }

    return (
      <HomeClient 
        allTools={allTools}
        popularTools={popularTools}
        trendingTools={trendingTools}
        sponsoredTools={sponsoredTools}
        error={error}
        categories={categories}
      />
    );
  } catch (outerError) {
    console.error('Critical error in HomePage:', outerError);
    
    // Return a client component for error handling that won't crash
    return <HomeErrorFallback />;
  }
}
