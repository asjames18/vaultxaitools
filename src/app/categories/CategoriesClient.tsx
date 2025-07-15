'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { categories } from '@/data';
import type { Tool } from '@/data/tools';

// Type for search suggestions
type SearchSuggestion = 
  | { type: 'category'; name: string; description: string; color: string; icon: string }
  | { type: 'tool'; id: string; name: string; category: string; description: string };

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

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

interface CategoriesClientProps {
  tools: Tool[];
}

export default function CategoriesClient({ tools }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const filteredTools = searchQuery || selectedCategory !== 'All' 
    ? tools.filter(tool => {
        const matchesSearch = !searchQuery || 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : tools;

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'users':
        return b.weeklyUsers - a.weeklyUsers;
      case 'growth':
        return parseFloat(b.growth.replace('%', '')) - parseFloat(a.growth.replace('%', ''));
      default:
        return b.weeklyUsers - a.weeklyUsers; // popular
    }
  });

  // Get search suggestions
  const searchSuggestions: SearchSuggestion[] = searchQuery ? [
    ...categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(cat => ({ 
      type: 'category' as const, 
      name: cat.name, 
      description: cat.description, 
      color: cat.color, 
      icon: cat.icon 
    })),
    ...tools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(tool => ({ 
      type: 'tool' as const, 
      id: tool.id, 
      name: tool.name, 
      category: tool.category, 
      description: tool.description 
    }))
  ] : [];

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

  if (tools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <SparklesIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discovering amazing AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 animate-fade-in shadow-sm">
              <SparklesIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Explore AI Tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-slide-up">
              AI Tool Categories
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Discover the perfect AI tools organized by category. From productivity to creativity, find exactly what you need.
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12 animate-scale-in">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI tools or categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl text-black placeholder-gray-400"
                />
              </div>
              
              {/* Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    {searchSuggestions.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors group hover:bg-blue-100 shadow-sm"
                        onClick={() => {
                          if (item.type === 'category') {
                            // It's a category
                            setSelectedCategory(item.name);
                            setSearchQuery('');
                          } else {
                            // It's a tool
                            window.location.href = `/tool/${item.id}`;
                          }
                        }}
                      >
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
                          <span className="text-2xl text-blue-700">
                            {item.type === 'category' ? '📁' : '🔧'}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-black text-base group-hover:text-blue-700">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-blue-600">
                            {item.type === 'category' ? 'Category' : item.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{tools.length}+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect AI tool for your specific needs across different domains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              // Dynamically count tools for this category
              const toolsInCategory = tools.filter(tool => tool.category === category.name);
              const toolCount = toolsInCategory.length;
              // Dynamically get top 3 popular tools by weeklyUsers
              const popularTools = toolsInCategory
                .sort((a, b) => b.weeklyUsers - a.weeklyUsers)
                .slice(0, 3)
                .map(tool => tool.name);
               
              // Calculate average rating for this category
              const avgRating = toolsInCategory.length > 0 
                ? toolsInCategory.reduce((sum, tool) => sum + tool.rating, 0) / toolsInCategory.length 
                : 0;
               
              return (
                <Link
                  key={category.name}
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 dark:hover:border-blue-700">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {category.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white text-center">
                      {category.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{toolCount}</div>
                        <div className="text-gray-600 dark:text-gray-400">Tools</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</div>
                        <div className="text-gray-600 dark:text-gray-400">Avg Rating</div>
                      </div>
                    </div>
                    
                    {/* Popular Tools Preview */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center uppercase tracking-wide">
                        Popular Tools
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {popularTools.length === 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            Coming soon
                          </span>
                        ) : (
                          popularTools.map((tool, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium"
                            >
                              {tool}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                      <span className="font-semibold">Explore Category</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                All AI Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {filteredTools.length} tools found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white text-black border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm appearance-none hover:border-blue-300"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white text-black border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm appearance-none hover:border-blue-300"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="users">Most Users</option>
                <option value="growth">Fastest Growing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTools.map((tool, index) => (
              <div 
                key={tool.id} 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{tool.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white mb-2">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {renderStars(tool.rating)}
                            <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1">
                              {tool.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({tool.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        {tool.category}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                        <TrendingUpIcon className="w-4 h-4" />
                        {tool.growth}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">{tool.weeklyUsers.toLocaleString()}</span> weekly users
                    </div>
                    <Link
                      href={`/tool/${tool.id}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      View Details
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTools.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No tools found</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or category filter to find what you're looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Advanced Search
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 