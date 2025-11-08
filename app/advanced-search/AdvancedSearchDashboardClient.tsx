'use client';

import { useState, useMemo } from 'react';
import AdvancedSearch from '../../components/AdvancedSearch';
import IntelligentResults from '../../components/IntelligentResults';
import SearchAnalytics from '../../components/SearchAnalytics';
import { useAdvancedSearch, SearchResult, SearchFilter } from '@/lib/useAdvancedSearch';
import { Search, Filter, BarChart3, Zap, TrendingUp, Activity, Target, Eye, MousePointer } from 'lucide-react';

export default function AdvancedSearchDashboardClient() {
  const {
    results,
    loading,
    error,
    query,
    filters,
    pagination,
    search,
    updateFilters,
    clearFilters,
    loadMore,
    resetSearch,
    hasMore,
    totalResults
  } = useAdvancedSearch();

  // Get available categories for filter options
  const availableCategories = useMemo(() => {
    const categories = [...new Set(results.map(result => result.category).filter(Boolean))];
    return categories.map(category => ({
      value: category,
      label: category,
      count: results.filter(result => result.category === category).length
    }));
  }, [results]);

  // Get available features for filter options
  const availableFeatures = useMemo(() => {
    const allFeatures = results.flatMap(result => result.tags || []);
    const uniqueFeatures = [...new Set(allFeatures)];
    return uniqueFeatures.map(feature => ({
      value: feature,
      label: feature,
      count: allFeatures.filter(f => f === feature).length
    }));
  }, [results]);

  // Handle search submission
  const handleSearch = (searchQuery: string, searchFilters: SearchFilter) => {
    search(searchQuery, searchFilters);
  };

  // Handle filter updates
  const handleFilterUpdate = (newFilters: Partial<SearchFilter>) => {
    updateFilters(newFilters);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  // Search statistics
  const searchStats = useMemo(() => {
    if (results.length === 0) return null;

    const avgRating = results.reduce((sum, result) => sum + (result.userRating || 0), 0) / results.length;
    const avgPopularity = results.reduce((sum, result) => sum + (result.popularity || 0), 0) / results.length;
    const topCategory = availableCategories.sort((a, b) => b.count - a.count)[0];
    const priceDistribution = results.reduce((acc, result) => {
      const price = result.price || 'unknown';
      acc[price] = (acc[price] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalResults,
      avgRating: avgRating.toFixed(1),
      avgPopularity: Math.round(avgPopularity),
      topCategory: topCategory?.label || 'N/A',
      priceDistribution
    };
  }, [results, totalResults, availableCategories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🔍 Advanced AI Search
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the perfect AI tools with our intelligent search engine. 
            Filter by category, rating, popularity, and more to find exactly what you need.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto mb-12">
          <AdvancedSearch
            onSearch={handleSearch}
            showFilters={true}
            showSuggestions={true}
            maxSuggestions={8}
            placeholder="Search AI tools, features, or categories..."
          />
        </div>

        {/* Search Results and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-800 dark:text-red-200">Search error: {error}</p>
                <button
                  onClick={resetSearch}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {query && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Search Results
                  </h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {totalResults > 0 ? `${totalResults} results found` : 'No results found'}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {Object.values(filters).some(value => 
                  Array.isArray(value) ? value.length > 0 : value !== 0 && value !== 'all'
                ) && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        Active filters: {Object.entries(filters)
                          .filter(([key, value]) => 
                            Array.isArray(value) ? value.length > 0 : value !== 0 && value !== 'all'
                          )
                          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                          .join(', ')}
                      </span>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {loading && results.length === 0 ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <IntelligentResults 
                  results={results.map(result => ({
                    id: result.id,
                    title: result.name,
                    description: result.description,
                    category: result.category,
                    tags: result.tags,
                    rating: result.rating,
                    popularity: result.popularity,
                    lastUpdated: result.lastUpdated,
                    relevance: result.relevance,
                    type: result.type,
                    views: result.views,
                    likes: result.likes,
                    price: (result.price === 'Free' || result.price === 'free' ? 'free' : 
                            result.price === 'Paid' || result.price === 'paid' ? 'paid' : 
                            result.price === 'Freemium' || result.price === 'freemium' ? 'freemium' : 'free') as 'free' | 'paid' | 'freemium',
                    features: result.tags || [],
                    userRating: result.userRating,
                    reviewCount: result.reviewCount
                  }))} 
                  query={query}
                />
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {loading ? 'Loading...' : 'Load More Results'}
                    </button>
                  </div>
                )}
              </div>
            ) : query && !loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={resetSearch}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Start New Search
                </button>
              </div>
            ) : null}
          </div>

          {/* Analytics Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SearchAnalytics 
                className=""
                timeRange="week"
                showCharts={true}
              />
            </div>
          </div>
        </div>

        {/* Search Tips */}
        {!query && (
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              💡 Search Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Be Specific</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use specific terms like "AI image generation" instead of just "AI"
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-3xl mb-3">🔧</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Use Filters</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Narrow results by category, rating, price, and features
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-3xl mb-3">⭐</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Check Ratings</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Look for tools with high ratings and many reviews
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
