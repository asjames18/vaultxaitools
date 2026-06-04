import CategoriesClient from '../categories/CategoriesClient';
import type { Tool } from '@/lib/types/tool';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { Suspense } from 'react';
import { createClientWithoutCookies } from '@/lib/supabase-server';

// Revalidate this page every 5 minutes to keep data fresh
export const revalidate = 300;

// Add cache tags for on-demand revalidation
export const tags = ['tools', 'aitools'];

export const metadata: Metadata = {
  title: 'AI Tools Directory — Discover & Compare the Best AI Tools',
  description: 'Explore our curated directory of AI tools, automation platforms, development tools, and productivity resources. Discover, compare, and find the right technology to learn, build, and grow.',
  keywords: 'AI tools directory, best AI tools, artificial intelligence tools, automation tools, AI agents, development tools, productivity tools, prompt engineering, no-code tools, tech education',
  openGraph: {
    title: 'AI Tools Directory — Discover & Compare the Best AI Tools',
    description: 'Explore our curated directory of AI tools, automation platforms, and development resources. Find the right technology to learn, build, and grow.',
    type: 'website',
  },
};

export const dynamic = 'force-static';

export default async function AITools() {
  // Fetch data at the server level
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
    console.error('Error loading tools for AI Tools page:', error);
    // Return empty array if database fails
    tools = [];
  }

  return (
    <div className="w-full">
      <Suspense fallback={<div />}> 
        <CategoriesClient tools={tools} />
      </Suspense>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: tools.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://vaultxaitools.com/tool/${t.id}`,
          name: t.name
        }))
      }} />
    </div>
  );
}

