import { Metadata } from 'next';
import Link from 'next/link';
import { getToolsFromDB, categories } from '@/data';
import CategoryPageClient from './CategoryPageClient';
import { generateCategoryMetadata } from '@/lib/seo';
import type { Tool } from '@/data';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  
  try {
    const currentCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!currentCategory) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }
    
    return generateCategoryMetadata(currentCategory);
  } catch (error) {
    console.error('Error generating metadata for category:', categoryName, error);
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  let categoryName = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  // Capitalize first letter to match data structure
  categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  
  try {
    // Get all tools and filter by category
    const allTools = await getToolsFromDB();
    const categoryTools = allTools.filter(tool => 
      tool.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    // Find the current category info
    const currentCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!currentCategory) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Category not found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The category "{categoryName}" doesn&apos;t exist.
            </p>
            <Link 
              href="/categories" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Browse all categories
            </Link>
          </div>
        </div>
      );
    }

    return (
      <CategoryPageClient 
        category={currentCategory} 
        categoryTools={categoryTools} 
      />
    );
  } catch (error) {
    console.error('Error loading category page:', categoryName, error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error loading category
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was an error loading the category "{categoryName}".
          </p>
          <Link 
            href="/categories" 
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Browse all categories
          </Link>
        </div>
      </div>
    );
  }
}