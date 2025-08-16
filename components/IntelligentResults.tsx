'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, TrendingUp, Clock, Filter, SortAsc, SortDesc, Zap, Heart, Eye, ThumbsUp, Search } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  popularity: number;
  lastUpdated: string;
  relevance: number;
  type: 'tool' | 'article' | 'category' | 'user';
  views: number;
  likes: number;
  price: 'free' | 'paid' | 'freemium';
  features: string[];
  userRating: number;
  reviewCount: number;
}

interface SortOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  sortFn: (a: SearchResult, b: SearchResult) => number;
}

interface IntelligentResultsProps {
  results: SearchResult[];
  query: string;
  userPreferences?: {
    favoriteCategories: string[];
    preferredPrice: 'free' | 'paid' | 'freemium' | 'all';
    minRating: number;
    sortPreference: string;
  };
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export default function IntelligentResults({
  results,
  query,
  userPreferences,
  onResultClick,
  className = ''
}: IntelligentResultsProps) {
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid' | 'freemium'>('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Available sort options
  const sortOptions: SortOption[] = [
    {
      id: 'relevance',
      label: 'Relevance',
      icon: <Zap className="w-4 h-4" />,
      sortFn: (a, b) => b.relevance - a.relevance
    },
    {
      id: 'rating',
      label: 'Rating',
      icon: <Star className="w-4 h-4" />,
      sortFn: (a, b) => b.rating - a.rating
    },
    {
      id: 'popularity',
      label: 'Popularity',
      icon: <TrendingUp className="w-4 h-4" />,
      sortFn: (a, b) => b.popularity - a.popularity
    },
    {
      id: 'newest',
      label: 'Newest',
      icon: <Clock className="w-4 h-4" />,
      sortFn: (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    },
    {
      id: 'views',
      label: 'Most Viewed',
      icon: <Eye className="w-4 h-4" />,
      sortFn: (a, b) => b.views - a.views
    },
    {
      id: 'likes',
      label: 'Most Liked',
      icon: <Heart className="w-4 h-4" />,
      sortFn: (a, b) => b.likes - a.likes
    }
  ];

  // Get available categories from results
  const availableCategories = useMemo(() => {
    const categories = new Set(results.map(result => result.category));
    return Array.from(categories);
  }, [results]);

  // Apply intelligent ranking and filtering
  const processedResults = useMemo(() => {
    let filtered = [...results];

    // Apply price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(result => result.price === priceFilter);
    }

    // Apply rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(result => result.rating >= ratingFilter);
    }

    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(result => categoryFilter.includes(result.category));
    }

    // Apply intelligent relevance scoring
    filtered = filtered.map(result => {
      let relevanceScore = result.relevance;

      // Boost results that match user preferences
      if (userPreferences) {
        if (userPreferences.favoriteCategories.includes(result.category)) {
          relevanceScore += 0.3;
        }
        if (userPreferences.preferredPrice !== 'all' && result.price === userPreferences.preferredPrice) {
          relevanceScore += 0.2;
        }
        if (result.rating >= userPreferences.minRating) {
          relevanceScore += 0.1;
        }
      }

      // Boost results with recent activity
      const daysSinceUpdate = (Date.now() - new Date(result.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceUpdate < 7) relevanceScore += 0.2;
      if (daysSinceUpdate < 30) relevanceScore += 0.1;

      // Boost results with high engagement
      if (result.views > 1000) relevanceScore += 0.1;
      if (result.likes > 100) relevanceScore += 0.1;
      if (result.reviewCount > 10) relevanceScore += 0.1;

      return { ...result, relevance: relevanceScore };
    });

    // Sort by selected option
    const selectedSort = sortOptions.find(option => option.id === sortBy);
    if (selectedSort) {
      filtered.sort(selectedSort.sortFn);
    }

    return filtered;
  }, [results, priceFilter, ratingFilter, categoryFilter, sortBy, userPreferences, sortOptions]);

  // Get current sort option
  const currentSort = sortOptions.find(option => option.id === sortBy);

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setCategoryFilter(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceFilter('all');
    setRatingFilter(0);
    setCategoryFilter([]);
  };

  // Get filter summary
  const getFilterSummary = () => {
    const activeFilters = [];
    if (priceFilter !== 'all') activeFilters.push(priceFilter);
    if (ratingFilter > 0) activeFilters.push(`Rating ${ratingFilter}+`);
    if (categoryFilter.length > 0) activeFilters.push(`${categoryFilter.length} categories`);

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  // Get price badge color
  const getPriceBadgeColor = (price: string) => {
    switch (price) {
      case 'free': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'freemium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paid': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {processedResults.length} results for "{query}"
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <div className="w-4 h-4 space-y-1">
                <div className="w-full h-1 bg-current rounded-sm"></div>
                <div className="w-full h-1 bg-current rounded-sm"></div>
                <div className="w-full h-1 bg-current rounded-sm"></div>
              </div>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {currentSort?.icon}
            </div>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-colors ${
              showFilters
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Price
              </label>
              <div className="space-y-2">
                {(['all', 'free', 'freemium', 'paid'] as const).map((price) => (
                  <label key={price} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value={price}
                      checked={priceFilter === price}
                      onChange={(e) => setPriceFilter(e.target.value as any)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {price === 'all' ? 'All prices' : price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Minimum Rating
              </label>
              <div className="space-y-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={ratingFilter === rating}
                      onChange={(e) => setRatingFilter(Number(e.target.value))}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={categoryFilter.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getFilterSummary()}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {processedResults.length} results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {processedResults.map((result) => (
          <div
            key={result.id}
            onClick={() => handleResultClick(result)}
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-600 ${
              viewMode === 'list' ? 'flex items-start gap-4' : ''
            }`}
          >
            {/* Result Header */}
            <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                  {result.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriceBadgeColor(result.price)}`}>
                  {result.price}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {result.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {result.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {result.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{result.tags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Result Footer */}
            <div className={`flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 ${
              viewMode === 'list' ? 'flex-shrink-0' : ''
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{result.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({result.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{result.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{result.likes.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs">{formatDate(result.lastUpdated)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {processedResults.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
