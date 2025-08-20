import { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/data';
import HomeClient from './HomeClient';
import type { Tool } from '@/data/tools';
import { createClientWithoutCookies } from '@/lib/supabase-server';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

// Generate metadata for homepage
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    description: 'Access only the best AI tools, hand-picked and tested by our experts. Quality over quantity - every tool is verified for effectiveness and reliability.',
    keywords: [
      'curated AI tools',
      'expert-tested AI', 
      'verified AI solutions',
      'quality AI tools',
      'hand-picked AI',
      'artificial intelligence tools',
      'AI software directory',
      'best AI tools 2024',
      'AI tool reviews',
      'AI tool comparisons',
      'AI productivity tools',
      'AI development tools',
      'AI design tools'
    ],
    openGraph: {
      title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
      description: 'Access only the best AI tools, hand-picked and tested by our experts.',
      url: 'https://vaultxaitools.com',
      siteName: 'VaultX AI Tools',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@vaultxaitools',
      creator: '@vaultxaitools',
      title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
      description: 'Access only the best AI tools, hand-picked and tested by our experts.',
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
    
    // Return a minimal error component that won't crash
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We encountered an error while loading this page.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
