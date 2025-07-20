'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { categories } from '@/data/tools';
import type { Tool } from '@/data/tools';
import { Search, Filter, Grid, List, Star, TrendingUp, Users, Zap, Clock, Sparkles, Flame, Target, Bookmark, Mic, MicOff, Eye, EyeOff, Share2, Download, Filter as FilterIcon, SortAsc, SortDesc, RefreshCw, Heart, MessageCircle, BarChart3, X, ChevronDown } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchClientProps {
  tools: Tool[];
}

// Popular search terms based on user behavior
const popularSearches = [
  "AI writing tools",
  "Image generation",
  "Code assistants", 
  "Video editing",
  "Chatbots",
  "Data analysis",
  "Productivity tools",
  "Marketing AI"
];

// Search suggestions for better UX
const searchSuggestions = [
  "Tools for content creators",
  "AI for small business",
  "Free AI tools",
  "Best AI for productivity",
  "AI tools for developers",
  "Creative AI applications"
];

  // AI-powered search recommendations
  const aiRecommendations = [
    "Based on your search history, you might like:",
    "Popular in your category:",
    "Trending this week:",
    "Similar to what you've viewed:"
  ];



export default function SearchClient({ tools }: SearchClientProps) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'users' | 'growth' | 'name' | 'recent'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [userCountFilter, setUserCountFilter] = useState<number>(0);
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    averageResults: 0,
    mostSearched: '',
    searchTime: 0
  });
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Generate dynamic search suggestions based on current query
  const getDynamicSuggestions = useCallback((query: string) => {
    if (!query.trim()) return searchSuggestions;
    
    const suggestions = [];
    const queryLower = query.toLowerCase();
    
    // Category-based suggestions
    const matchingCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(queryLower)
    );
    suggestions.push(...matchingCategories.map(cat => `${cat.name} tools`));
    
    // Popular tools matching query
    const matchingTools = tools.filter(tool => 
      tool.name.toLowerCase().includes(queryLower) ||
      tool.description.toLowerCase().includes(queryLower)
    ).slice(0, 3);
    suggestions.push(...matchingTools.map(tool => tool.name));
    
    // Generic suggestions
    if (queryLower.includes('ai') || queryLower.includes('artificial')) {
      suggestions.push('AI writing tools', 'AI image generators', 'AI video editors');
    }
    if (queryLower.includes('free')) {
      suggestions.push('Free AI tools', 'Free alternatives', 'Freemium options');
    }
    if (queryLower.includes('productivity')) {
      suggestions.push('Productivity AI tools', 'Task automation', 'Workflow optimization');
    }
    
    return [...new Set(suggestions)].slice(0, 6);
  }, [tools]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('vaultx-search-history');
    const savedFavorites = localStorage.getItem('vaultx-favorites');
    const savedRecent = localStorage.getItem('vaultx-recent');
    const savedStats = localStorage.getItem('vaultx-search-stats');
    
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavoriteTools(JSON.parse(savedFavorites));
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
    if (savedStats) setSearchStats(JSON.parse(savedStats));
  }, []);

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

  // Track search analytics separately
  const trackSearchAnalytics = useCallback((searchTime: number) => {
    const newStats = {
      ...searchStats,
      totalSearches: searchStats.totalSearches + 1,
      averageResults: Math.round((searchStats.averageResults + filteredTools.length) / 2),
      searchTime: Math.round((searchStats.searchTime + searchTime) / 2)
    };
    setSearchStats(newStats);
    localStorage.setItem('vaultx-search-stats', JSON.stringify(newStats));
  }, [searchStats, filteredTools.length]);

  // Reset search stats if they're corrupted
  const resetSearchStats = useCallback(() => {
    const defaultStats = {
      totalSearches: 0,
      averageResults: 0,
      mostSearched: '',
      searchTime: 0
    };
    setSearchStats(defaultStats);
    localStorage.setItem('vaultx-search-stats', JSON.stringify(defaultStats));
  }, []);

  // Add search to history
  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('vaultx-search-history', JSON.stringify(newHistory));
      
      // Track most searched term
      setSearchStats(prev => ({
        ...prev,
        mostSearched: query
      }));
    }
  }, [searchHistory]);

  // Handle search with history tracking
  const handleSearch = useCallback((query: string) => {
    const startTime = Date.now();
    setSearchQuery(query);
    addToSearchHistory(query);
    setShowSuggestions(false);
    
    // Track search analytics after a short delay to allow results to update
    setTimeout(() => {
      const searchTime = Date.now() - startTime;
      trackSearchAnalytics(searchTime);
    }, 100);
  }, [addToSearchHistory, trackSearchAnalytics]);

  // Voice search functionality
  const startVoiceSearch = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSearch(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser');
    }
  }, [handleSearch]);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ['name', 'description', 'category', 'tags'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [tools]);

  // Filter tools based on search query and filters
  const filteredAndSearchedTools = useMemo(() => {
    let results = tools;

    // Apply search query
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      results = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(tool => selectedCategories.includes(tool.category));
    }

    // Apply price filter
    results = results.filter(tool => {
      const price = parseFloat(tool.pricing.replace(/[^0-9.]/g, '')) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply rating filter
    if (ratingFilter > 0) {
      results = results.filter(tool => tool.rating >= ratingFilter);
    }

    // Apply user count filter
    if (userCountFilter > 0) {
      results = results.filter(tool => tool.weeklyUsers >= userCountFilter);
    }

    return results;
  }, [tools, searchQuery, selectedCategories, fuse]);

  // Update filtered tools when search or filters change
  useEffect(() => {
    setFilteredTools(filteredAndSearchedTools);
    handleResultsChange(filteredAndSearchedTools);
  }, [filteredAndSearchedTools, handleResultsChange]);

  // Click outside handlers for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Close search suggestions if clicking outside
      if (showSuggestions && !target.closest('.search-suggestions') && !target.closest('.search-input')) {
        setShowSuggestions(false);
      }
      
      // Close filter dropdown if clicking outside
      if (showFilters && !target.closest('.filter-dropdown') && !target.closest('.filter-button')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions, showFilters]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key to close dropdowns
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setShowFilters(false);
      }
      
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + F to open filters
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        setShowFilters(!showFilters);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFilters]);

  // Toggle favorite tool
  const toggleFavorite = useCallback((toolId: string) => {
    const newFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId];
    
    setFavoriteTools(newFavorites);
    localStorage.setItem('vaultx-favorites', JSON.stringify(newFavorites));
  }, [favoriteTools]);

  // Add to recently viewed
  const addToRecentlyViewed = useCallback((toolId: string) => {
    const newRecent = [toolId, ...recentlyViewed.filter(id => id !== toolId)].slice(0, 10);
    setRecentlyViewed(newRecent);
    localStorage.setItem('vaultx-recent', JSON.stringify(newRecent));
  }, [recentlyViewed]);

  // Toggle tool selection for comparison
  const toggleToolSelection = useCallback((toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  }, []);

  // Export search results
  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(filteredTools, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-tools-search-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredTools]);

  // Share search results
  const shareResults = useCallback(async () => {
    const shareData = {
      title: 'AI Tools Search Results',
      text: `Found ${filteredTools.length} AI tools matching "${searchQuery}"`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert('Search URL copied to clipboard!');
    }
  }, [filteredTools.length, searchQuery]);

  // Sort tools based on selected criteria
  const sortedTools = useMemo(() => {
    return [...filteredTools].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rating':
          comparison = b.rating - a.rating;
          break;
        case 'users':
          comparison = b.weeklyUsers - a.weeklyUsers;
          break;
        case 'growth':
          comparison = parseInt(b.growth.replace('+', '').replace('%', '')) - 
                      parseInt(a.growth.replace('+', '').replace('%', ''));
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'recent':
          comparison = (b.reviewCount || 0) - (a.reviewCount || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'desc' ? comparison : -comparison;
    });
  }, [filteredTools, sortBy, sortDirection]);

  // Get search suggestions based on current results
  const currentSearchSuggestions = useMemo(() => {
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

  // Get favorite tools
  const getFavoriteTools = useCallback(() => {
    return tools.filter(tool => favoriteTools.includes(tool.id));
  }, [tools, favoriteTools]);

  // Get recently viewed tools
  const getRecentlyViewedTools = useCallback(() => {
    return tools.filter(tool => recentlyViewed.includes(tool.id));
  }, [tools, recentlyViewed]);

  // Get AI recommendations based on search history
  const getAIRecommendations = useCallback(() => {
    if (searchHistory.length === 0) return [];
    
    // Simple recommendation algorithm based on search history
    const recentSearches = searchHistory.slice(0, 3);
    const recommendations = tools.filter(tool => 
      recentSearches.some(search => 
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.category.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
      )
    );
    
    return recommendations.slice(0, 4);
  }, [tools, searchHistory]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover AI Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the perfect AI tool for your needs. Search, filter, and compare thousands of AI solutions.
            </p>
          </div>



          {/* Enhanced Search Bar */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Main Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search AI tools by name, description, or category... (Ctrl+K)"
                  className="search-input block w-full pl-12 pr-20 py-4 text-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                
                {/* Voice Search Button */}
                <button
                  onClick={startVoiceSearch}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                    isListening 
                      ? 'text-red-500 animate-pulse' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="search-suggestions absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  {/* Popular Search Categories */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => {
                            setSearchQuery(search);
                            setShowSuggestions(false);
                            handleSearch(search);
                          }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Suggestions</span>
                    </div>
                    <div className="space-y-2">
                      {getDynamicSuggestions(searchQuery).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setShowSuggestions(false);
                            handleSearch(suggestion);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</span>
                      </div>
                      <div className="space-y-2">
                        {searchHistory.slice(0, 5).map((search) => (
                          <button
                            key={search}
                            onClick={() => {
                              setSearchQuery(search);
                              setShowSuggestions(false);
                              handleSearch(search);
                            }}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="mt-4 flex flex-wrap gap-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter-button flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters (Ctrl+F)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="filter-dropdown absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4">
                    <div className="space-y-4">
                      {/* Categories */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {categories.map((category) => (
                            <label key={category.name} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCategories(prev => [...prev, category.name]);
                                  } else {
                                    setSelectedCategories(prev => prev.filter(c => c !== category.name));
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Price Range ($)</h3>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h3>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                              className={`p-1 rounded ${ratingFilter >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                          {ratingFilter > 0 && (
                            <span className="text-xs text-gray-500 ml-2">{ratingFilter}+ stars</span>
                          )}
                        </div>
                      </div>

                      {/* User Count Filter */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Minimum Users</h3>
                        <select
                          value={userCountFilter}
                          onChange={(e) => setUserCountFilter(parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value={0}>Any</option>
                          <option value={1000}>1K+ users/week</option>
                          <option value={10000}>10K+ users/week</option>
                          <option value={100000}>100K+ users/week</option>
                          <option value={1000000}>1M+ users/week</option>
                        </select>
                      </div>

                      {/* Clear All Filters */}
                      {(selectedCategories.length > 0 || ratingFilter > 0 || userCountFilter > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <button
                          onClick={() => {
                            setSelectedCategories([]);
                            setRatingFilter(0);
                            setUserCountFilter(0);
                            setPriceRange([0, 1000]);
                          }}
                          className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {category}
                      <button
                        onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                        className="hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header with Advanced Controls */}
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
                  <option value="recent">Recently Added</option>
                  <option value="name">Name</option>
                </select>
                <button
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Advanced Controls */}
            <div className="flex items-center gap-2">
              {/* Analytics Toggle */}
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={`p-2 rounded-lg transition-colors ${
                  showAnalytics 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Search Analytics"
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              {/* Export Results */}
              <button
                onClick={exportResults}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Export Results"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Share Results */}
              <button
                onClick={shareResults}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Share Results"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Compare Tools */}
              {selectedTools.length > 0 && (
                <button
                  onClick={() => setShowCompare(!showCompare)}
                  className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 transition-colors"
                  title={`Compare ${selectedTools.length} tools`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="ml-1 text-xs">{selectedTools.length}</span>
                </button>
              )}

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

          {/* Search Analytics */}
          {showAnalytics && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Analytics</h4>
                <button
                  onClick={resetSearchStats}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Reset analytics"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{searchStats.totalSearches}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total Searches</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{searchStats.averageResults}</div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Results</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {searchStats.searchTime > 10000 ? 'N/A' : `${searchStats.searchTime}ms`}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{searchStats.mostSearched || 'None'}</div>
                  <div className="text-gray-500 dark:text-gray-400">Most Searched</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {getAIRecommendations().length > 0 && filteredTools.length === tools.length && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Recommendations</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Based on your search history, you might like these tools:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getAIRecommendations().map((tool) => (
                  <div key={tool.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{tool.logo || tool.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{tool.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tool.category}</p>
                    </div>
                    <button
                      onClick={() => addToRecentlyViewed(tool.id)}
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personalization Section */}
        {(getFavoriteTools().length > 0 || getRecentlyViewedTools().length > 0) && filteredTools.length === tools.length && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Favorite Tools */}
              {getFavoriteTools().length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bookmark className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Favorites</h3>
                  </div>
                  <div className="space-y-3">
                    {getFavoriteTools().slice(0, 3).map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-sm">{tool.logo || tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(tool.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed */}
              {getRecentlyViewedTools().length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Viewed</h3>
                  </div>
                  <div className="space-y-3">
                    {getRecentlyViewedTools().slice(0, 3).map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <span className="text-sm">{tool.logo || tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                          </div>
                        </div>
                        <a
                          href={`/tool/${tool.id}`}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <Target className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isSearching ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Searching...</h3>
            <p className="text-gray-600 dark:text-gray-400">Finding the best AI tools for you</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">No tools found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {currentSearchSuggestions.slice(0, 6).map((suggestion) => (
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
                } ${selectedTools.includes(tool.id) ? 'ring-2 ring-green-500' : ''}`}
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

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      favoriteTools.includes(tool.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${favoriteTools.includes(tool.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Compare Selection */}
                  <button
                    onClick={() => toggleToolSelection(tool.id)}
                    className={`absolute bottom-3 left-3 p-2 rounded-full transition-all duration-200 ${
                      selectedTools.includes(tool.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-green-500'
                    }`}
                    title="Add to comparison"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
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
                      onClick={() => addToRecentlyViewed(tool.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3 h-3" />
                      Visit Tool
                    </a>
                    <a
                      href={`/tool/${tool.id}`}
                      onClick={() => addToRecentlyViewed(tool.id)}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Learn more about ${tool.name}`}
                    >
                      Details
                    </a>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: tool.name,
                              text: tool.description,
                              url: tool.website
                            });
                          } else {
                            navigator.clipboard.writeText(`${tool.name} - ${tool.website}`);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Share tool"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const data = `${tool.name}\n${tool.description}\nWebsite: ${tool.website}\nCategory: ${tool.category}\nRating: ${tool.rating}/5`;
                          const blob = new Blob([data], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${tool.name.replace(/\s+/g, '_')}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Download tool info"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{tool.weeklyUsers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tool Comparison Modal */}
        {showCompare && selectedTools.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Compare {selectedTools.length} Tools
                  </h3>
                  <button
                    onClick={() => setShowCompare(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTools.map((toolId) => {
                    const tool = tools.find(t => t.id === toolId);
                    if (!tool) return null;
                    
                    return (
                      <div key={tool.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{tool.logo || tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                            <span className="font-medium">{tool.rating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Users:</span>
                            <span className="font-medium">{tool.weeklyUsers.toLocaleString()}/week</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Growth:</span>
                            <span className="font-medium">{tool.growth}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Pricing:</span>
                            <span className="font-medium">{tool.pricing}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 