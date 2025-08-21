'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  SparklesIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../AdminLoadingStates';

interface SearchFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in';
  value: any;
  secondaryValue?: any; // For 'between' operations
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'ai_suggested';
  relevance: number;
  metadata?: Record<string, any>;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  data?: any[]; // For AI suggestions
}

export function AdvancedSearch({ 
  onSearch, 
  onSuggestionSelect,
  placeholder = "Search with AI-powered intelligence...",
  className = '',
  showFilters = true,
  showSuggestions = true,
  data = []
}: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SearchFilter | null>(null);

  // Generate AI-powered suggestions based on data
  const generateAISuggestions = useCallback((query: string) => {
    if (!query.trim() || data.length === 0) return [];

    const queryLower = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Analyze data patterns and generate intelligent suggestions
    data.forEach((item, index) => {
      const itemKeys = Object.keys(item);
      
      itemKeys.forEach(key => {
        const value = item[key];
        if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
          suggestions.push({
            id: `ai_${index}_${key}`,
            text: `${key}: ${value}`,
            type: 'ai_suggested',
            relevance: 0.8,
            metadata: { field: key, value, itemId: index }
          });
        }
      });
    });

    // Add semantic suggestions
    if (queryLower.includes('tool') || queryLower.includes('ai')) {
      suggestions.push({
        id: 'semantic_tools',
        text: 'AI Tools & Applications',
        type: 'ai_suggested',
        relevance: 0.9,
        metadata: { category: 'tools', semantic: true }
      });
    }

    if (queryLower.includes('user') || queryLower.includes('member')) {
      suggestions.push({
        id: 'semantic_users',
        text: 'User Management & Profiles',
        type: 'ai_suggested',
        relevance: 0.9,
        metadata: { category: 'users', semantic: true }
      });
    }

    // Sort by relevance
    return suggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }, [data]);

  // Handle search input changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim() && showSuggestions) {
      const aiSuggestions = generateAISuggestions(query);
      const recentSuggestions = getRecentSearches(query);
      const popularSuggestions = getPopularSearches(query);
      
      setSuggestions([...aiSuggestions, ...recentSuggestions, ...popularSuggestions]);
      setShowSuggestionsPanel(true);
    } else {
      setShowSuggestionsPanel(false);
    }
  }, [generateAISuggestions, showSuggestions]);

  // Get recent searches from localStorage
  const getRecentSearches = (query: string): SearchSuggestion[] => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      return recent
        .filter((search: string) => search.toLowerCase().includes(query.toLowerCase()))
        .map((search: string, index: number) => ({
          id: `recent_${index}`,
          text: search,
          type: 'recent' as const,
          relevance: 0.6 - (index * 0.1)
        }))
        .slice(0, 3);
    } catch {
      return [];
    }
  };

  // Get popular searches (mock data)
  const getPopularSearches = (query: string): SearchSuggestion[] => {
    const popular = [
      'AI Writing Tools',
      'Image Generation',
      'Code Assistant',
      'Data Analysis',
      'Video Editing'
    ];
    
    return popular
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .map((search, index) => ({
        id: `popular_${index}`,
        text: search,
        type: 'popular' as const,
        relevance: 0.7 - (index * 0.05)
      }))
      .slice(0, 2);
  };

  // Save search to recent searches
  const saveSearch = useCallback((query: string) => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [query, ...recent.filter((item: string) => item !== query)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Handle search submission
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestionsPanel(false);
    
    try {
      // Save to recent searches
      saveSearch(searchQuery);
      
      // Execute search
      await onSearch(searchQuery, filters);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, filters, onSearch, saveSearch]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestionsPanel(false);
    
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  }, [onSuggestionSelect]);

  // Add filter
  const addFilter = useCallback((filter: Omit<SearchFilter, 'id'>) => {
    const newFilter: SearchFilter = {
      ...filter,
      id: `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setFilters(prev => [...prev, newFilter]);
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  // Update filter
  const updateFilter = useCallback((filterId: string, updates: Partial<SearchFilter>) => {
    setFilters(prev => prev.map(f => 
      f.id === filterId ? { ...f, ...updates } : f
    ));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        handleSearch();
      } else if (event.key === 'Escape') {
        setShowSuggestionsPanel(false);
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSearch]);

  // Filter panel component
  const FilterPanel = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Filters</h3>
        <button
          onClick={() => setShowFilterPanel(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Filter Builder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={activeFilter?.field || ''}
            onChange={(e) => setActiveFilter(prev => ({ ...prev, field: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Field</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="rating">Rating</option>
            <option value="status">Status</option>
            <option value="created_at">Created Date</option>
          </select>

          <select
            value={activeFilter?.operator || ''}
            onChange={(e) => setActiveFilter(prev => ({ ...prev, operator: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Operator</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
            <option value="starts_with">Starts With</option>
            <option value="ends_with">Ends With</option>
            <option value="greater_than">Greater Than</option>
            <option value="less_than">Less Than</option>
            <option value="between">Between</option>
            <option value="in">In</option>
            <option value="not_in">Not In</option>
          </select>

          <input
            type="text"
            placeholder="Value"
            value={activeFilter?.value || ''}
            onChange={(e) => setActiveFilter(prev => ({ ...prev, value: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Filter Button */}
        <button
          onClick={() => {
            if (activeFilter?.field && activeFilter?.operator && activeFilter?.value) {
              addFilter({
                field: activeFilter.field,
                operator: activeFilter.operator,
                value: activeFilter.value,
                label: `${activeFilter.field} ${activeFilter.operator} ${activeFilter.value}`,
                type: 'text'
              });
              setActiveFilter(null);
            }
          }}
          disabled={!activeFilter?.field || !activeFilter?.operator || !activeFilter?.value}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Filter
        </button>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters</h4>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {filter.label}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Suggestions panel component
  const SuggestionsPanel = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => handleSuggestionSelect(suggestion)}
          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {suggestion.type === 'ai_suggested' && (
                <SparklesIcon className="h-4 w-4 text-purple-500" />
              )}
              {suggestion.type === 'recent' && (
                <ClockIcon className="h-4 w-4 text-blue-500" />
              )}
              {suggestion.type === 'popular' && (
                <LightBulbIcon className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-gray-900 dark:text-white">{suggestion.text}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {suggestion.type.replace('_', ' ')}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onFocus={() => {
              if (searchQuery.trim() && suggestions.length > 0) {
                setShowSuggestionsPanel(true);
              }
            }}
          />
          
          {/* AI Indicator */}
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
            <SparklesIcon className="h-4 w-4 text-purple-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-2 rounded-md transition-colors ${
                showFilterPanel || filters.length > 0
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Advanced Filters"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          )}
          
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && <FilterPanel />}

      {/* Suggestions Panel */}
      {showSuggestionsPanel && suggestions.length > 0 && <SuggestionsPanel />}

      {/* Search Tips */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        💡 <strong>Pro Tips:</strong> Use Ctrl+Enter for quick search • Press Esc to close panels • Try semantic queries like "AI tools for writing"
      </div>
    </div>
  );
}

// Hook for managing search state
export function useAdvancedSearch(initialData: any[] = []) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{
    query: string;
    filters: SearchFilter[];
    timestamp: Date;
    resultCount: number;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string, filters: SearchFilter[]) => {
    setIsSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search logic - replace with actual API call
      let results = initialData;
      
      // Apply filters
      filters.forEach(filter => {
        results = results.filter(item => {
          const itemValue = item[filter.field];
          
          switch (filter.operator) {
            case 'equals':
              return itemValue === filter.value;
            case 'contains':
              return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'starts_with':
              return String(itemValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
            case 'ends_with':
              return String(itemValue).toLowerCase().endsWith(String(filter.value).toLowerCase());
            case 'greater_than':
              return Number(itemValue) > Number(filter.value);
            case 'less_than':
              return Number(itemValue) < Number(filter.value);
            case 'between':
              return Number(itemValue) >= Number(filter.value) && Number(itemValue) <= Number(filter.secondaryValue);
            case 'in':
              return Array.isArray(filter.value) && filter.value.includes(itemValue);
            case 'not_in':
              return Array.isArray(filter.value) && !filter.value.includes(itemValue);
            default:
              return true;
          }
        });
      });
      
      // Apply text search
      if (query.trim()) {
        const queryLower = query.toLowerCase();
        results = results.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(queryLower)
          )
        );
      }
      
      setSearchResults(results);
      
      // Save to history
      const searchRecord = {
        query,
        filters,
        timestamp: new Date(),
        resultCount: results.length
      };
      
      setSearchHistory(prev => [searchRecord, ...prev.slice(0, 9)]); // Keep last 10
      
      return results;
    } finally {
      setIsSearching(false);
    }
  }, [initialData]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  const getSearchStats = useCallback(() => {
    return {
      totalSearches: searchHistory.length,
      averageResults: searchHistory.length > 0 
        ? Math.round(searchHistory.reduce((sum, record) => sum + record.resultCount, 0) / searchHistory.length)
        : 0,
      mostRecentSearch: searchHistory[0]?.query || null,
      searchSuccessRate: searchHistory.length > 0 
        ? Math.round((searchHistory.filter(record => record.resultCount > 0).length / searchHistory.length) * 100)
        : 0
    };
  }, [searchHistory]);

  return {
    searchResults,
    searchHistory,
    isSearching,
    performSearch,
    clearSearch,
    getSearchStats
  };
}
