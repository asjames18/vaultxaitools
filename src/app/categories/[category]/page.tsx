import { getToolsByCategory, getCategoryByName } from '@/data';
import CategoryPageClient from './CategoryPageClient';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  const category = getCategoryByName(categoryName);
  const categoryTools = getToolsByCategory(categoryName);

  return <CategoryPageClient category={category} categoryTools={categoryTools} />;
} 