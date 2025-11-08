'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { trackSearch, trackEvent } from './GoogleAnalytics';
import type { Tool, Category } from '@/data/tools';

interface EnhancedSearchProps {
  tools: Tool[];
  categories: Category[];
  onResultsChange: (tools: Tool[]) => void;
  className?: string;
}

interface SearchSuggestion {
  type: 'tool' | 'category' | 'tag';
  value: string;
  count: number;
}

export default function EnhancedSearch({ 
  tools, 
  categories, 
  onResultsChange, 
  className = '' 
}: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const searchTerm = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    
    // Tool name suggestions
    tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'tool',
          value: tool.name,
          count: 1
        });
      }
    });
    
    // Category suggestions
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({
          type: 'category',
          value: category.name,
          count: tools.filter(t => t.category === category.name).length
        });
      }
    });
    
    // Tag suggestions
    tools.forEach(tool => {
      if (tool.tags) {
        tool.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm)) {
            const existing = suggestions.find(s => s.value === tag);
            if (existing) {
              existing.count++;
            } else {
              suggestions.push({
                type: 'tag',
                value: tag,
                count: 1
              });
            }
          }
        });
      }
    });
    
    // Remove duplicates and sort by relevance
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.value === suggestion.value)
    );
    
    return uniqueSuggestions
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [searchQuery, tools, categories]);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vaultx-recent-searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, []);

  // Generate popular searches based on tool data
  useEffect(() => {
    const popular = tools
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(tool => tool.name);
    setPopularSearches(popular);
  }, [tools]);

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);
    
    // Track search input
    if (value.length > 2) {
      trackEvent('search_input', 'engagement', value);
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((query: string) => {
    if (!query.trim()) return;
    
    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('vaultx-recent-searches', JSON.stringify(updated));
    
    // Track search
    trackSearch(query, tools.length);
    
    // Close suggestions
    setShowSuggestions(false);
    setSearchQuery(query);
    
    // Update results
    const filtered = tools.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    onResultsChange(filtered);
  }, [recentSearches, tools, onResultsChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && searchSuggestions[selectedSuggestionIndex]) {
        handleSearchSubmit(searchSuggestions[selectedSuggestionIndex].value);
      } else {
        handleSearchSubmit(searchQuery);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [searchSuggestions, selectedSuggestionIndex, searchQuery, handleSearchSubmit]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    handleSearchSubmit(suggestion.value);
  }, [handleSearchSubmit]);

  // Handle recent search click
  const handleRecentSearchClick = useCallback((search: string) => {
    handleSearchSubmit(search);
  }, [handleSearchSubmit]);

  // Handle popular search click
  const handlePopularSearchClick = useCallback((search: string) => {
    handleSearchSubmit(search);
  }, [handleSearchSubmit]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    onResultsChange(tools);
  }, [tools, onResultsChange]);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search AI tools by name, description, or category..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Search Suggestions */}
          {searchQuery && searchSuggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggestions
              </div>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    index === selectedSuggestionIndex
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{suggestion.value}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.type} • {suggestion.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!searchQuery && popularSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handlePopularSearchClick(search)}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchSuggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm">No suggestions found for "{searchQuery}"</div>
              <div className="text-xs mt-1">Try a different search term</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
