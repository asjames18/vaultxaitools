'use client';

import { useState, useMemo, useCallback } from 'react';
import { categories } from '@/data/tools';
import SearchAndFilter from '@/components/SearchAndFilter';
import type { Tool } from '@/data/tools';
import { Search, Filter, Grid, List, Star, TrendingUp, Users, Zap } from 'lucide-react';

interface SearchClientProps {
  tools: Tool[];
}

export default function SearchClient({ tools }: SearchClientProps) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'users' | 'growth' | 'name'>('rating');

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

  // Sort tools based on selected criteria
  const sortedTools = useMemo(() => {
    return [...filteredTools].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'users':
          return b.weeklyUsers - a.weeklyUsers;
        case 'growth':
          return parseInt(b.growth.replace('+', '').replace('%', '')) - 
                 parseInt(a.growth.replace('+', '').replace('%', ''));
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredTools, sortBy]);

  // Get search suggestions based on current results
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    // Add category names
    categories.forEach(cat => suggestions.add(cat.name));
    
    // Add popular tool names
    tools.slice(0, 10).forEach((tool: Tool) => suggestions.add(tool.name));
    
    // Add common tags
    tools.forEach((tool: Tool) => {
      tool.tags?.forEach((tag: string) => suggestions.add(tag));
    });

    return Array.from(suggestions).slice(0, 8);
  }, [tools]);

  if (tools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover AI Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the perfect AI tool for your needs. Search, filter, and compare thousands of AI solutions.
            </p>
          </div>

          {/* Enhanced Search and Filter Component */}
          <SearchAndFilter
            tools={tools}
            categories={categories}
            onResultsChange={handleResultsChange}
            className="max-w-5xl mx-auto"
          />
        </div>
      </div>

      {/* Enhanced Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header with Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Search className="w-4 h-4" />
                <span>{filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found</span>
              </div>
              
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Rating</option>
                  <option value="users">Users</option>
                  <option value="growth">Growth</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">No tools found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchSuggestions.slice(0, 6).map((suggestion) => (
                <span
                  key={suggestion}
                  className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {sortedTools.map((tool) => (
              <div
                key={tool.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Tool Image */}
                <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-48'
                }`}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={`text-gray-400 dark:text-gray-500 ${
                      viewMode === 'list' ? 'text-4xl' : 'text-6xl'
                    }`}>
                      {tool.logo}
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tool.category}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {tool.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tool Content */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Enhanced Tool Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>{tool.weeklyUsers.toLocaleString()}/week</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>{tool.growth}</span>
                    </div>
                  </div>

                  {/* Pricing and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tool.pricing}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tool.reviewCount.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3 h-3" />
                      Visit Tool
                    </a>
                    <a
                      href={`/tool/${tool.id}`}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Learn more about ${tool.name}`}
                    >
                      Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 