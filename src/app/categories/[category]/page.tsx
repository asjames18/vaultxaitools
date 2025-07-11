import { Metadata } from 'next';
import { getToolsByCategory, getCategories } from '@/lib/database';
import CategoryPageClient from './CategoryPageClient';
import { generateCategoryMetadata } from '@/lib/seo';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  
  try {
    const allCategories = await getCategories();
    const currentCategory = allCategories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (!currentCategory) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }
    
    // Transform database category to match the expected interface
    const categoryForSEO = {
      name: currentCategory.name,
      icon: currentCategory.icon,
      description: currentCategory.description,
      count: currentCategory.count,
      color: currentCategory.color,
      popularTools: currentCategory.popular_tools,
    };
    
    return generateCategoryMetadata(categoryForSEO);
  } catch (error) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  
  try {
    // Get tools for this category from the database
    const categoryTools = await getToolsByCategory(categoryName);
    
    // Get all categories for navigation
    const allCategories = await getCategories();
    
    // Find the current category info
    const currentCategory = allCategories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    console.log('Category page debug:', {
      categoryName,
      categoryToolsCount: categoryTools.length,
      categoryTools: categoryTools.map(t => ({ id: t.id, name: t.name, category: t.category })),
      currentCategory: currentCategory ? { name: currentCategory.name, count: currentCategory.count } : null,
      allCategories: allCategories.map(c => ({ name: c.name, count: c.count }))
    });

    return (
      <CategoryPageClient 
        category={currentCategory} 
        categoryTools={categoryTools} 
      />
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Category: {categoryName}</h1>
        <p className="text-gray-600">No tools found in this category or error loading data.</p>
      </div>
    );
  }
} 