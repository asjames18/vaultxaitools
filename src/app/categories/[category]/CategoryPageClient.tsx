'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database } from '@/lib/database.types';

type Tool = Database['public']['Tables']['tools']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

// Simple SVG icons as fallback
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

interface CategoryPageClientProps {
  category: Category | undefined;
  categoryTools: Tool[];
}

export default function CategoryPageClient({ category, categoryTools }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // If category doesn't exist, show error
  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Category not found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The category you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  // Filter tools based on search query
  const filteredTools = searchQuery 
    ? categoryTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryTools;

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'users':
        return b.weekly_users - a.weekly_users;
      case 'growth':
        const aGrowth = parseInt(a.growth.replace('+', '').replace('%', ''));
        const bGrowth = parseInt(b.growth.replace('+', '').replace('%', ''));
        return bGrowth - aGrowth;
      case 'name':
        return a.name.localeCompare(b.name);
      default: // popular
        return b.weekly_users - a.weekly_users;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : i < rating
            ? 'text-yellow-500 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${category.color} text-4xl mb-8 shadow-xl`}>
              {category.icon}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {category.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-lg text-gray-600 dark:text-gray-400 mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                <div className="text-sm">Tools</div>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {category.popular_tools.slice(0, 3).join(', ')}
                </div>
                <div className="text-sm">Popular Tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${category.name} tools...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="users">Most Users</option>
              <option value="growth">Fastest Growing</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {category.name} Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {sortedTools.length} tool{sortedTools.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                View All Categories
              </Link>
            </div>
          </div>

          {/* Enhanced Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTools.map((tool, index) => (
              <Link
                key={tool.id}
                href={`/tool/${tool.id}`}
                className="group"
              >
                <div 
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group-hover:border-blue-200 dark:group-hover:border-blue-700"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-4xl">{tool.logo}</div>
                    <div className="flex items-center gap-1">
                      {renderStars(tool.rating)}
                      <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                        {tool.rating}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">{tool.weekly_users.toLocaleString()} users</span>
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <TrendingUpIcon className="w-4 h-4" />
                        {tool.growth}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="font-semibold">View Details</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {sortedTools.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No tools found</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No ${category.name} tools match "${searchQuery}". Try different search terms.`
                  : `No tools found in ${category.name} category yet.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 