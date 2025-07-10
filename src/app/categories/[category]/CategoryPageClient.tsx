'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchTools, Tool, Category } from '@/data';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Category not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The category you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  // Filter and sort tools
  const filteredTools = searchQuery 
    ? searchTools(searchQuery).filter(tool => tool.category === category.name)
    : categoryTools;

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'users':
        return b.weeklyUsers - a.weeklyUsers;
      case 'growth':
        const aGrowth = parseInt(a.growth.replace('+', '').replace('%', ''));
        const bGrowth = parseInt(b.growth.replace('+', '').replace('%', ''));
        return bGrowth - aGrowth;
      case 'name':
        return a.name.localeCompare(b.name);
      default: // popular
        return b.weeklyUsers - a.weeklyUsers;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/categories"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back to Categories
            </Link>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} text-3xl mb-4`}>
              {category.icon}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {category.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <span>{category.count} tools</span>
              <span>•</span>
              <span>Popular: {category.popularTools.slice(0, 3).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${category.name} tools...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="users">Most Users</option>
            <option value="growth">Fastest Growing</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {sortedTools.length} tool{sortedTools.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{tool.logo}</div>
                  <div className="flex items-center gap-1">
                    {renderStars(tool.rating)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                      {tool.rating}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <span>{tool.weeklyUsers.toLocaleString()} users</span>
                    <span className="text-green-600 font-medium">{tool.growth}</span>
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {sortedTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or browse all categories.
            </p>
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 