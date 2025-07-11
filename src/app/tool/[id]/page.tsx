import { Metadata } from 'next';
import ToolDetailsClient from './ToolDetailsClient';
import { getToolById } from '@/data';
import { generateToolMetadata, generateToolStructuredData } from '@/lib/seo';

interface ToolDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ToolDetailsProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = await getToolById(resolvedParams.id);
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested AI tool could not be found.',
    };
  }
  
  return generateToolMetadata(tool);
}

export default async function ToolDetails({ params }: ToolDetailsProps) {
  const resolvedParams = await params;
  const tool = await getToolById(resolvedParams.id);
  
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The tool you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const toolStructuredData = generateToolStructuredData(tool);
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
        name: tool.category,
        item: `https://vaultxaitools.com/categories/${tool.category?.toLowerCase() || 'general'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `https://vaultxaitools.com/tool/${tool.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(toolStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <ToolDetailsClient toolId={resolvedParams.id} />
    </>
  );
} 