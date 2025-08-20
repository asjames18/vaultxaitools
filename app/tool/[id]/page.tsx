import { Metadata } from 'next';
import ToolDetailsClient from './ToolDetailsClient';
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo';
import type { Tool } from '@/data';
import { createClientWithoutCookies } from '@/lib/supabase-server';

interface ToolDetailsProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all tools
export async function generateStaticParams() {
  try {
    const supabase = createClientWithoutCookies();
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error generating static params for tools:', error);
      return [];
    }
    
    return tools?.map((tool: any) => ({
      id: tool.id,
    })) || [];
  } catch (error) {
    console.error('Error generating static params for tools:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ToolDetailsProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const supabase = createClientWithoutCookies();
    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();
    
    if (error || !tool) {
      return {
        title: 'Tool Not Found',
        description: 'The requested AI tool could not be found.',
      };
    }
    
    // Map database tool to frontend tool type
    const mappedTool: Tool = {
      id: tool.id || '',
      name: tool.name || '',
      logo: tool.logo || '🔧',
      description: tool.description || '',
      longDescription: tool.long_description || undefined,
      category: tool.category || '',
      rating: tool.rating || 0,
      reviewCount: tool.review_count || 0,
      weeklyUsers: tool.weekly_users || 0,
      growth: tool.growth || '0%',
      website: tool.website || '',
      pricing: tool.pricing || 'Unknown',
      features: tool.features || undefined,
      pros: tool.pros || undefined,
      cons: tool.cons || undefined,
      alternatives: tool.alternatives || undefined,
      tags: tool.tags || undefined,
      createdAt: tool.created_at || '',
      updatedAt: tool.updated_at || ''
    };
    
    return generateToolMetadata(mappedTool);
  } catch (error) {
    console.error('Error generating metadata for tool:', resolvedParams.id, error);
    return {
      title: 'Tool Not Found',
      description: 'The requested AI tool could not be found.',
    };
  }
}

export default async function ToolDetails({ params }: ToolDetailsProps) {
  const resolvedParams = await params;
  
  try {
    const supabase = createClientWithoutCookies();
    const { data: tool, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();
    
    if (error || !tool) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Tool not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The tool you&apos;re looking for doesn&apos;t exist.
            </p>
            <a 
              href="/AITools" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Browse all tools
            </a>
          </div>
        </div>
      );
    }

    // Map database tool to frontend tool type
    const mappedTool: Tool = {
      id: tool.id || '',
      name: tool.name || '',
      logo: tool.logo || '🔧',
      description: tool.description || '',
      longDescription: tool.long_description || undefined,
      category: tool.category || '',
      rating: tool.rating || 0,
      reviewCount: tool.review_count || 0,
      weeklyUsers: tool.weekly_users || 0,
      growth: tool.growth || '0%',
      website: tool.website || '',
      pricing: tool.pricing || 'Unknown',
      features: tool.features || undefined,
      pros: tool.pros || undefined,
      cons: tool.cons || undefined,
      alternatives: tool.alternatives || undefined,
      tags: tool.tags || undefined,
      createdAt: tool.created_at || '',
      updatedAt: tool.updated_at || ''
    };

    const toolStructuredData = generateToolStructuredData(mappedTool);
    const anyTool: any = mappedTool as any;
    const faqStructuredData = anyTool.faq && anyTool.faq.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: anyTool.faq.map((f: any) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;
    const breadcrumbStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://vaultxaitools.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: mappedTool.category,
          item: `https://vaultxaitools.com/AITools?category=${mappedTool.category?.toLowerCase() || 'general'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: mappedTool.name,
          item: `https://vaultxaitools.com/tool/${mappedTool.id}`,
        },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} />
        {faqStructuredData && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
        )}
        <ToolDetailsClient tool={mappedTool} />
      </>
    );
  } catch (error) {
    console.error('Error loading tool details:', resolvedParams.id, error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error loading tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was an error loading the tool details.
          </p>
          <a 
            href="/AITools" 
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Browse all tools
          </a>
        </div>
      </div>
    );
  }
} 