import { Metadata } from 'next';
import Link from 'next/link';
import { createClientWithoutCookies } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Browse AI Tool Categories - Melanated In Tech',
  description: 'Explore AI tools by category. Find the right tools for writing, video, coding, research, productivity, and more.',
};

export const revalidate = 300;

interface CategoryCount {
  category: string;
  count: number;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Writing': '✍️',
  'Image Generation': '🎨',
  'Video': '🎥',
  'Code': '💻',
  'Coding': '💻',
  'Research': '🔬',
  'Productivity': '⚡',
  'Business': '💼',
  'Marketing': '📣',
  'Audio': '🎵',
  'Music': '🎵',
  'Education': '📚',
  'Healthcare': '🏥',
  'Finance': '💰',
  'Customer Service': '🤝',
  'Design': '🎭',
  'Analytics': '📊',
  'Automation': '🤖',
  'Developer Tools': '🛠️',
  'Security': '🔒',
  'Data': '📂',
  'Agents': '🧠',
  'Chat': '💬',
  'Search': '🔍',
  'Translation': '🌐',
};

function getCategoryIcon(name: string): string {
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '🔧';
}

export default async function CategoriesPage() {
  let categories: CategoryCount[] = [];

  try {
    const supabase = createClientWithoutCookies();
    const { data, error } = await supabase
      .from('tools')
      .select('category')
      .eq('status', 'published');

    if (!error && data) {
      const counts: Record<string, number> = {};
      for (const row of data) {
        if (row.category) {
          counts[row.category] = (counts[row.category] || 0) + 1;
        }
      }
      categories = Object.entries(counts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    }
  } catch {
    // Render with empty state if DB unavailable
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Browse by Category
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {categories.length > 0
              ? `Explore ${categories.reduce((s, c) => s + c.count, 0)}+ tools across ${categories.length} categories`
              : 'Explore AI tools organized by use case'}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(({ category, count }) => (
              <Link
                key={category}
                href={`/AITools?category=${encodeURIComponent(category)}`}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-3xl mb-3">{getCategoryIcon(category)}</div>
                <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-sm sm:text-base leading-tight mb-1">
                  {category}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {count} tool{count !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No categories available yet.</p>
            <Link href="/AITools" className="text-green-500 hover:text-green-400 font-medium">
              Browse all AI tools →
            </Link>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/AITools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
