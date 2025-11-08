'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, Sparkles, TrendingUp, Clock, Star, Zap, ChevronDown, ChevronUp } from 'lucide-react';

import { SearchResult, SearchFilter } from '@/lib/useAdvancedSearch';

interface AdvancedSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string, filters: SearchFilter) => void;
  showFilters?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
}

export default function AdvancedSearch({
  className = '',
  placeholder = 'Search AI tools, articles, and more...',
  onSearch,
  showFilters = true,
  showSuggestions = true,
  maxSuggestions = 5
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    category: [],
    rating: 0,
    popularity: 0,
    dateRange: 'all',
    price: 'all',
    features: []
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vaultx-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Generate AI-powered suggestions based on query
  const generateSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    // Simulate AI-powered suggestions
    const mockSuggestions = [
      `${searchQuery} for beginners`,
      `${searchQuery} tutorial`,
      `${searchQuery} alternatives`,
      `${searchQuery} best practices`,
      `${searchQuery} examples`,
      `${searchQuery} comparison`,
      `${searchQuery} review`,
      `${searchQuery} pricing`
    ];

    // Filter and limit suggestions
    const filteredSuggestions = mockSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, maxSuggestions);

    setSuggestions(filteredSuggestions);
  }, [maxSuggestions]);

  // Generate trending searches
  useEffect(() => {
    const mockTrending = [
      'AI image generation',
      'ChatGPT alternatives',
      'Code completion tools',
      'Video editing AI',
      'Writing assistants',
      'Design automation',
      'Data analysis tools',
      'Language learning AI'
    ];
    setTrendingSearches(mockTrending);
  }, []);

  // Handle search input changes
  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsExpanded(true);
    generateSuggestions(value);
  };

  // Handle search submission
  const handleSearch = (searchQuery: string = query, searchFilters: SearchFilter = filters) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 10);
    setRecentSearches(updatedRecent);
    localStorage.setItem('vaultx-recent-searches', JSON.stringify(updatedRecent));

    // Call onSearch callback
    onSearch?.(searchQuery, searchFilters);

    // Close suggestions
    setIsExpanded(false);
    setSuggestions([]);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle recent search click
  const handleRecentSearchClick = (recentSearch: string) => {
    setQuery(recentSearch);
    handleSearch(recentSearch);
  };

  // Handle trending search click
  const handleTrendingSearchClick = (trendingSearch: string) => {
    setQuery(trendingSearch);
    handleSearch(trendingSearch);
  };

  // Update filters
  const updateFilter = <K extends keyof SearchFilter>(key: K, value: SearchFilter[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle category filter
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: [],
      rating: 0,
      popularity: 0,
      dateRange: 'all',
      price: 'all',
      features: []
    });
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    } else if (event.key === 'Escape') {
      setIsExpanded(false);
      setSuggestions([]);
    }
  };

  // Get filter summary
  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.category.length > 0) activeFilters.push(`${filters.category.length} categories`);
    if (filters.rating > 0) activeFilters.push(`Rating ${filters.rating}+`);
    if (filters.popularity > 0) activeFilters.push(`Popularity ${filters.popularity}+`);
    if (filters.dateRange !== 'all') activeFilters.push(filters.dateRange);
    if (filters.price !== 'all') activeFilters.push(filters.price);
    if (filters.features.length > 0) activeFilters.push(`${filters.features.length} features`);

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {showFilters && (
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`p-1.5 rounded-md transition-colors ${
                  showFiltersPanel
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title="Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            )}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Search Filters</h3>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categories */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {['AI Tools', 'Articles', 'Tutorials', 'Reviews', 'Comparisons'].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.rating}
                  onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                  {filters.rating}+
                </span>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', e.target.value as any)}
                className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All time</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
                <option value="year">Past year</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <select
                value={filters.price}
                onChange={(e) => updateFilter('price', e.target.value as any)}
                className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All prices</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getFilterSummary()}
              </span>
              <button
                onClick={() => setShowFiltersPanel(false)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {isExpanded && showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  AI Suggestions
                </span>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Recent Searches
                </span>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((recentSearch, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(recentSearch)}
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {recentSearch}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {trendingSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Trending
                </span>
              </div>
              <div className="space-y-1">
                {trendingSearches.slice(0, 5).map((trendingSearch, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendingSearchClick(trendingSearch)}
                    className="w-full text-left px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {trendingSearch}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
