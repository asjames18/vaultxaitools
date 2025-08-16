'use client';

import { useState, useMemo } from 'react';
import AdvancedSearch from '../../components/AdvancedSearch';
import IntelligentResults from '../../components/IntelligentResults';
import SearchAnalytics from '../../components/SearchAnalytics';
import { Search, Filter, BarChart3, Zap, TrendingUp, Activity, Target, Eye, MousePointer } from 'lucide-react';

// Mock search results for demonstration
const mockSearchResults = [
  {
    id: '1',
    title: 'ChatGPT - AI Language Model',
    description: 'Advanced AI language model for natural conversations, writing assistance, and creative content generation.',
    category: 'AI Tools',
    tags: ['AI', 'Language', 'Chatbot', 'Writing'],
    rating: 4.8,
    popularity: 95,
    lastUpdated: '2024-01-15T10:30:00Z',
    relevance: 0.95,
    type: 'tool' as const,
    views: 15420,
    likes: 892,
    price: 'freemium' as const,
    features: ['Conversation', 'Writing', 'Translation'],
    userRating: 4.8,
    reviewCount: 156
  },
  {
    id: '2',
    title: 'Midjourney - AI Image Generation',
    description: 'Create stunning artwork and images using AI-powered text-to-image generation with incredible detail.',
    category: 'AI Tools',
    tags: ['AI', 'Image', 'Art', 'Creative'],
    rating: 4.7,
    popularity: 92,
    lastUpdated: '2024-01-14T15:45:00Z',
    relevance: 0.88,
    type: 'tool' as const,
    views: 12850,
    likes: 756,
    price: 'paid' as const,
    features: ['Image Generation', 'Art Creation', 'Style Transfer'],
    userRating: 4.7,
    reviewCount: 89
  },
  {
    id: '3',
    title: 'GitHub Copilot - AI Code Assistant',
    description: 'AI-powered code completion tool that helps developers write better code faster with intelligent suggestions.',
    category: 'Development',
    tags: ['AI', 'Coding', 'Development', 'Productivity'],
    rating: 4.6,
    popularity: 88,
    lastUpdated: '2024-01-13T09:20:00Z',
    relevance: 0.85,
    type: 'tool' as const,
    views: 9650,
    likes: 623,
    price: 'paid' as const,
    features: ['Code Completion', 'AI Suggestions', 'Multi-language'],
    userRating: 4.6,
    reviewCount: 134
  },
  {
    id: '4',
    title: 'Notion AI - Smart Workspace',
    description: 'AI-powered workspace that helps organize thoughts, create content, and collaborate with intelligent assistance.',
    category: 'Productivity',
    tags: ['AI', 'Productivity', 'Organization', 'Collaboration'],
    rating: 4.5,
    popularity: 85,
    lastUpdated: '2024-01-12T14:15:00Z',
    relevance: 0.82,
    type: 'tool' as const,
    views: 8750,
    likes: 534,
    price: 'freemium' as const,
    features: ['Note-taking', 'AI Writing', 'Project Management'],
    userRating: 4.5,
    reviewCount: 98
  },
  {
    id: '5',
    title: 'Jasper - AI Content Creator',
    description: 'Create high-quality content for marketing, blogs, and social media with AI-powered writing assistance.',
    category: 'Marketing',
    tags: ['AI', 'Content', 'Marketing', 'Writing'],
    rating: 4.4,
    popularity: 82,
    lastUpdated: '2024-01-11T11:30:00Z',
    relevance: 0.78,
    type: 'tool' as const,
    views: 7450,
    likes: 445,
    price: 'paid' as const,
    features: ['Content Creation', 'Marketing Copy', 'SEO Optimization'],
    userRating: 4.4,
    reviewCount: 76
  },
  {
    id: '6',
    title: 'Runway ML - AI Video Editor',
    description: 'Professional video editing powered by AI with advanced features for creators and filmmakers.',
    category: 'Creative',
    tags: ['AI', 'Video', 'Editing', 'Creative'],
    rating: 4.3,
    popularity: 78,
    lastUpdated: '2024-01-10T16:45:00Z',
    relevance: 0.75,
    type: 'tool' as const,
    views: 6230,
    likes: 389,
    price: 'paid' as const,
    features: ['Video Editing', 'AI Effects', 'Motion Graphics'],
    userRating: 4.3,
    reviewCount: 67
  }
];

export default function AdvancedSearchDashboardClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    category: [],
    rating: 0,
    popularity: 0,
    dateRange: 'all' as const,
    price: 'all' as const,
    features: []
  });
  const [activeTab, setActiveTab] = useState<'search' | 'results' | 'analytics'>('search');
  const [searchResults, setSearchResults] = useState(mockSearchResults);

  // Handle search
  const handleSearch = (query: string, filters: any) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setActiveTab('results');
    
    // Filter results based on query and filters
    const filtered = mockSearchResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                          result.description.toLowerCase().includes(query.toLowerCase()) ||
                          result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = filters.category.length === 0 || filters.category.includes(result.category);
      const matchesRating = result.rating >= filters.rating;
      const matchesPrice = filters.price === 'all' || result.price === filters.price;
      
      return matchesQuery && matchesCategory && matchesRating && matchesPrice;
    });
    
    setSearchResults(filtered);
  };

  // Handle result click
  const handleResultClick = (result: any) => {
    console.log('Result clicked:', result);
    // Navigate to result detail page or open modal
  };

  // User preferences for intelligent ranking
  const userPreferences = {
    favoriteCategories: ['AI Tools', 'Development'],
    preferredPrice: 'freemium' as const,
    minRating: 4.0,
    sortPreference: 'relevance'
  };

  const tabs = [
    { id: 'search', label: 'Advanced Search', icon: Search },
    { id: 'results', label: 'Search Results', icon: Filter },
    { id: 'analytics', label: 'Search Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Search Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {searchResults.length} tools available
              </div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Export Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'search' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Advanced Search & Discovery
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Find the perfect AI tools with intelligent search, advanced filtering, and personalized recommendations.
              </p>
            </div>

            {/* Search Component */}
            <div className="max-w-4xl mx-auto">
              <AdvancedSearch
                placeholder="Search AI tools, features, categories, and more..."
                onSearch={handleSearch}
                showFilters={true}
                showSuggestions={true}
                maxSuggestions={8}
              />
            </div>

            {/* Search Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  AI-Powered Suggestions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get intelligent search suggestions based on your query and preferences
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Filtering
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filter by category, rating, price, features, and more
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Smart Ranking
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Results ranked by relevance, popularity, and your preferences
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mockSearchResults.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(mockSearchResults.map(r => r.category)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockSearchResults.filter(r => r.price === 'free').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Free Tools</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(mockSearchResults.reduce((sum, r) => sum + r.rating, 0) / mockSearchResults.length * 10) / 10}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Search Results
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse all available tools'}
              </p>
            </div>

            <IntelligentResults
              results={searchResults}
              query={searchQuery || 'all tools'}
              userPreferences={userPreferences}
              onResultClick={handleResultClick}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Search Analytics
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Understand search patterns, user behavior, and optimization opportunities
              </p>
            </div>

            <SearchAnalytics timeRange="week" showCharts={true} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 VaultX AI Tools. Advanced search and discovery platform for AI tools and resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
