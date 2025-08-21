'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  SparklesIcon,
  XMarkIcon,
  LightBulbIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../AdminLoadingStates';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: any;
  label: string;
  type: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'ai_suggested';
  relevance: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter[]) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  data?: any[];
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
            relevance: 0.8
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
        relevance: 0.9
      });
    }

    if (queryLower.includes('user') || queryLower.includes('member')) {
      suggestions.push({
        id: 'semantic_users',
        text: 'User Management & Profiles',
        type: 'ai_suggested',
        relevance: 0.9
      });
    }

    return suggestions.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }, [data]);

  // Load recent searches from localStorage
  const loadRecentSearches = useCallback(() => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }, []);

  // Save search to recent searches
  const saveSearch = useCallback((query: string) => {
    try {
      const recent = loadRecentSearches();
      const updated = [query, ...recent.filter((item: string) => item !== query)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, [loadRecentSearches]);

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

  // Update suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim() && showSuggestions) {
      const aiSuggestions = generateAISuggestions(searchQuery);
      const recentSearches = loadRecentSearches()
        .filter((item: string) => item.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((item: string) => ({
          id: `recent_${item}`,
          text: item,
          type: 'recent' as const,
          relevance: 0.7
        }));
      
      setSuggestions([...aiSuggestions, ...recentSearches]);
      setShowSuggestionsPanel(true);
    } else {
      setShowSuggestionsPanel(false);
    }
  }, [searchQuery, showSuggestions, generateAISuggestions, loadRecentSearches]);

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
        {/* Simple Filter Builder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.value) {
                addFilter({
                  field: e.target.value,
                  operator: 'contains',
                  value: '',
                  label: `${e.target.value} contains...`,
                  type: 'text'
                });
              }
            }}
          >
            <option value="">Add Filter...</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="rating">Rating</option>
            <option value="status">Status</option>
          </select>
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
            <div className="space-y-2">
              {filters.map((filter) => (
                <div key={filter.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filter.label}
                  </span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Suggestions panel component
  const SuggestionsPanel = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      <div className="p-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionSelect(suggestion)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2"
          >
            {suggestion.type === 'ai_suggested' && <SparklesIcon className="h-4 w-4 text-blue-500" />}
            {suggestion.type === 'recent' && <ClockIcon className="h-4 w-4 text-gray-500" />}
            {suggestion.type === 'popular' && <LightBulbIcon className="h-4 w-4 text-yellow-500" />}
            <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />

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
              return Number(itemValue) >= Number(filter.value) && Number(itemValue) <= Number(filter.value);
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
      
      // Add to search history
      setSearchHistory(prev => [{
        query,
        filters,
        timestamp: new Date(),
        resultCount: results.length
      }, ...prev.slice(0, 9)]);
      
      return results;
    } finally {
      setIsSearching(false);
    }
  }, [initialData]);

  return {
    searchResults,
    searchHistory,
    isSearching,
    performSearch
  };
}
