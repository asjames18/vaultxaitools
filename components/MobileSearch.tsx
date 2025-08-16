'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, X, Mic, MicOff, Camera, TrendingUp, History, Sparkles } from 'lucide-react';
import { Tool } from '@/data/tools';

interface MobileSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  searchQuery: string;
  totalResults: number;
  isLoading: boolean;
  categories: string[];
  recentSearches?: string[];
  popularSearches?: string[];
  suggestedTools?: Tool[];
}

export default function MobileSearch({
  onSearch,
  onFiltersChange,
  searchQuery,
  totalResults,
  isLoading,
  categories,
  recentSearches = [],
  popularSearches = [],
  suggestedTools = []
}: MobileSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return () => {
        recognition.abort();
      };
    }
  }, [onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setIsExpanded(false);
      setShowSuggestions(false);
    }
  };

  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.start();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (search: string) => {
    setInputValue(search);
    onSearch(search);
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setInputValue('');
    onSearch('');
    setIsExpanded(false);
    setShowSuggestions(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative">
      {/* Compact Search Bar */}
      {!isExpanded && (
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleExpanded}
            className="flex-1 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left text-gray-500 dark:text-gray-400"
          >
            <Search className="w-5 h-5" />
            <span className="text-sm">
              {searchQuery ? `"${searchQuery}"` : 'Search AI tools...'}
            </span>
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            aria-label="Toggle filters"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Expanded Search Bar */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleExpanded}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  placeholder="Search AI tools..."
                  className="w-full pl-10 pr-20 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {inputValue && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Voice search"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                {suggestedTools.slice(0, 3).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSuggestionClick(tool.name)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {tool.logo ? tool.logo.charAt(0) : tool.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {tool.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !showSuggestions && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && !showSuggestions && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSuggestionClick('Free AI tools')}
                className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                🆓 Free Tools
              </button>
              <button
                onClick={() => handleSuggestionClick('AI writing tools')}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                ✍️ Writing AI
              </button>
              <button
                onClick={() => handleSuggestionClick('Image generation')}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                🎨 Image AI
              </button>
              <button
                onClick={() => handleSuggestionClick('Code assistants')}
                className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                💻 Code AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {totalResults > 0 && !isExpanded && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{totalResults} tools found</span>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>
        </div>
      )}

      {/* Mobile Filters */}
      {showFilters && (
        <div className="px-4 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                onChange={(e) => onFiltersChange({ category: e.target.value })}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Pricing Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pricing
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Free', 'Freemium', 'Paid', 'Enterprise'].map((pricing) => (
                  <button
                    key={pricing}
                    onClick={() => onFiltersChange({ pricing })}
                    className="p-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {pricing}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  defaultValue="0"
                  onChange={(e) => onFiltersChange({ rating: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                  {parseFloat((document.querySelector('input[type="range"]') as HTMLInputElement)?.value || '0')}+
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
