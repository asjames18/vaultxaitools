'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/data';
import type { Tool, Category } from '@/data';

// Simple SVG icons as fallback
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

interface CategoryPageClientProps {
  category: Category | undefined;
  categoryTools: Tool[];
}

export default function CategoryPageClient({ category, categoryTools }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedPriceTiers, setSelectedPriceTiers] = useState<string[]>(['Free', 'Paid', 'Freemium']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedCompanySize, setSelectedCompanySize] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [recentlyViewedTools, setRecentlyViewedTools] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  // Available filter options
  const availableFeatures = ['AI-Powered', 'API Access', 'Integrations', 'Free Plan', 'Team Collaboration', 'Real-time', 'Mobile App'];
  const availableCompanySizes = ['Solo', 'Small Team', 'Enterprise'];

  // Handle feature filter change
  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Handle company size filter change
  const handleCompanySizeChange = (size: string) => {
    setSelectedCompanySize(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Remove filter chip
  const removeFilter = (type: string, value: string) => {
    switch (type) {
      case 'price':
        setSelectedPriceTiers(prev => prev.filter(t => t !== value));
        break;
      case 'feature':
        setSelectedFeatures(prev => prev.filter(f => f !== value));
        break;
      case 'company':
        setSelectedCompanySize(prev => prev.filter(s => s !== value));
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedPriceTiers(['Free', 'Paid', 'Freemium']);
    setSelectedFeatures([]);
    setSelectedCompanySize([]);
    setSearchQuery('');
  };

  // Load favorites and recently viewed from localStorage
  useEffect(() => {
    const fav = localStorage.getItem('favoriteTools');
    if (fav) setFavoriteTools(JSON.parse(fav));
    const recent = localStorage.getItem('recentlyViewedTools');
    if (recent) setRecentlyViewedTools(JSON.parse(recent));
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteTools', JSON.stringify(favoriteTools));
  }, [favoriteTools]);

  // Add to recently viewed when a tool is clicked
  const handleToolClick = (toolId: string) => {
    setRecentlyViewedTools(prev => {
      const updated = [toolId, ...prev.filter(id => id !== toolId)].slice(0, 8);
      localStorage.setItem('recentlyViewedTools', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle favorite
  const toggleFavorite = (toolId: string) => {
    setFavoriteTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  // Handle tool selection for comparison
  const toggleToolComparison = (toolId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else if (prev.length < 3) {
        return [...prev, toolId];
      }
      return prev; // Don't add if already at max
    });
  };

  // Clear comparison selection
  const clearComparison = () => {
    setSelectedForComparison([]);
  };

  // Helper: get featured tools (top 3 by users or rating)
  const featuredTools = [...categoryTools]
    .sort((a, b) => (b.weeklyUsers || 0) - (a.weeklyUsers || 0))
    .slice(0, 3)
    .map(tool => tool.id);

  // Enhanced filtering logic
  const filteredTools = categoryTools.filter(tool => {
    const matchesSearch = searchQuery
      ? (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesPrice = selectedPriceTiers.includes(tool.pricing || 'Unknown');
    
    // Mock feature matching (in real app, this would be based on tool.features array)
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.some(feature => 
        tool.description.toLowerCase().includes(feature.toLowerCase()) ||
        tool.name.toLowerCase().includes(feature.toLowerCase())
      );
    
    // Mock company size matching (in real app, this would be based on tool.companySizes array)
    const matchesCompanySize = selectedCompanySize.length === 0 || 
      selectedCompanySize.some(size => 
        tool.description.toLowerCase().includes(size.toLowerCase())
      );
    
    return matchesSearch && matchesPrice && matchesFeatures && matchesCompanySize;
  });
  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'users':
        return (b.weeklyUsers || 0) - (a.weeklyUsers || 0);
      case 'growth': {
        const aGrowth = parseInt((a.growth || '0%').replace('+', '').replace('%', ''));
        const bGrowth = parseInt((b.growth || '0%').replace('+', '').replace('%', ''));
        return bGrowth - aGrowth;
      }
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      default: // popular
        return (b.weeklyUsers || 0) - (a.weeklyUsers || 0);
    }
  });

  // Unified, prioritized tool order: featured, favorites, recently viewed, all others (no duplicates)
  const orderedToolIds = [
    ...featuredTools,
    ...favoriteTools.filter(id => !featuredTools.includes(id)),
    ...recentlyViewedTools.filter(id => !featuredTools.includes(id) && !favoriteTools.includes(id)),
    ...sortedTools.map(tool => tool.id).filter(
      id => !featuredTools.includes(id) && !favoriteTools.includes(id) && !recentlyViewedTools.includes(id)
    ),
  ];
  const orderedTools = orderedToolIds
    .map(id => sortedTools.find(tool => tool.id === id))
    .filter(Boolean);

  // Helper: get badge for a tool
  const getToolBadge = (toolId: string) => {
    if (featuredTools.includes(toolId)) return 'Featured';
    if (favoriteTools.includes(toolId)) return 'Your Favorite';
    if (recentlyViewedTools.includes(toolId)) return 'Recently Viewed';
    return null;
  };

  // Helper: get all unique price tiers from tools
  const allPriceTiers = Array.from(new Set(categoryTools.map(tool => tool.pricing || 'Unknown')));

  // Handle price tier checkbox change
  const handlePriceTierChange = (tier: string) => {
    setSelectedPriceTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };

  const renderStars = (rating: number) => {
    const safeRating = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(safeRating)
            ? 'text-yellow-500 fill-current'
            : i < safeRating
            ? 'text-yellow-500 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Helper function to generate use case tags based on tool
  const getUseCaseTags = (tool: any) => {
    const tags = [];
    const name = tool.name.toLowerCase();
    const desc = tool.description.toLowerCase();
    
    // Mock logic to assign use case tags based on tool name/description
    if (desc.includes('blog') || desc.includes('content') || desc.includes('writing')) {
      tags.push('For Bloggers');
    }
    if (desc.includes('develop') || desc.includes('code') || desc.includes('api')) {
      tags.push('For Developers');
    }
    if (desc.includes('team') || desc.includes('collaboration') || desc.includes('workspace')) {
      tags.push('For Teams');
    }
    if (desc.includes('beginner') || desc.includes('easy') || desc.includes('simple')) {
      tags.push('For Beginners');
    }
    if (desc.includes('enterprise') || desc.includes('business') || desc.includes('scale')) {
      tags.push('For Enterprises');
    }
    if (desc.includes('design') || desc.includes('creative')) {
      tags.push('For Designers');
    }
    if (desc.includes('marketing') || desc.includes('social')) {
      tags.push('For Marketers');
    }
    
    return tags.slice(0, 2); // Limit to 2 tags per tool
  };

  // If category doesn't exist, show error
  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Category not found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            The category you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <div className="space-y-8">
      {/* Subscribe for Updates CTA */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800 p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Stay Updated!</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-4">Subscribe to get the latest {category?.name} tools and updates delivered to your inbox.</p>
        <form className="flex flex-col gap-2" onSubmit={e => { e.preventDefault(); }}>
          <label htmlFor="sidebar-subscribe-email" className="sr-only">Email address</label>
          <input
            id="sidebar-subscribe-email"
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 w-full"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-base shadow hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
      {/* Quick Links */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Suggest a Tool</a>
          </li>
          <li>
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact / Help</a>
          </li>
        </ul>
      </div>
    </div>
  );

  // Get related categories (exclude current category)
  const relatedCategories = categories
    .filter(cat => cat.name !== category?.name)
    .slice(0, 4); // Show 4 related categories

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Floating Comparison Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
            <span className="font-semibold">
              {selectedForComparison.length} tool{selectedForComparison.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => {
                // In a real app, this would navigate to a comparison page
                alert(`Comparing ${selectedForComparison.length} tools: ${selectedForComparison.join(', ')}`);
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Compare Tools
            </button>
            <button
              onClick={clearComparison}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Enhanced Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${category.color} text-4xl mb-8 shadow-xl`}>
              {category.icon}
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              {category.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-lg text-gray-600 dark:text-gray-400 mb-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{category.count}</div>
                <div className="text-sm">Tools</div>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {category.popularTools.slice(0, 3).join(', ')}
                </div>
                <div className="text-sm">Popular Tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Search and Filters */}
          <div className="mb-8">
            {/* Search bar */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${category?.name} tools...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="users">Most Users</option>
                <option value="growth">Fastest Growing</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            {/* Filter panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Price Filter */}
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-3 block">Price</span>
                {allPriceTiers.map(tier => (
                  <label key={tier} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedPriceTiers.includes(tier)}
                      onChange={() => handlePriceTierChange(tier)}
                      className="accent-blue-600"
                    />
                    {tier}
                  </label>
                ))}
              </div>

              {/* Features Filter */}
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-3 block">Features</span>
                {availableFeatures.map(feature => (
                  <label key={feature} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="accent-blue-600"
                    />
                    {feature}
                  </label>
                ))}
              </div>

              {/* Company Size Filter */}
              <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <span className="font-semibold text-gray-700 dark:text-gray-200 mb-3 block">Company Size</span>
                {availableCompanySizes.map(size => (
                  <label key={size} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCompanySize.includes(size)}
                      onChange={() => handleCompanySizeChange(size)}
                      className="accent-blue-600"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Active Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1">×</button>
                </span>
              )}
              {selectedPriceTiers.filter(tier => tier !== 'Free' && tier !== 'Paid' && tier !== 'Freemium').map(tier => (
                <span key={tier} className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                  {tier}
                  <button onClick={() => removeFilter('price', tier)} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-1">×</button>
                </span>
              ))}
              {selectedFeatures.map(feature => (
                <span key={feature} className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                  {feature}
                  <button onClick={() => removeFilter('feature', feature)} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-1">×</button>
                </span>
              ))}
              {selectedCompanySize.map(size => (
                <span key={size} className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                  {size}
                  <button onClick={() => removeFilter('company', size)} className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-1">×</button>
                </span>
              ))}
              {(selectedFeatures.length > 0 || selectedCompanySize.length > 0 || searchQuery) && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {category.name} Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {sortedTools.length} tool{sortedTools.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                View All Categories
              </Link>
            </div>
          </div>

          {/* Enhanced Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main grid: spans 3 columns on desktop, full width on mobile */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg">
                      <div className="w-16 h-16 mb-6 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-2/3 mx-auto" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-5/6 mx-auto" />
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </div>
                  ))
                ) : (
                  orderedTools.map((tool, index) => {
                    if (!tool) return null;
                    const isFavorited = favoriteTools.includes(tool.id);
                    const isSelectedForComparison = selectedForComparison.includes(tool.id);
                    const badge = getToolBadge(tool.id);
                    return (
                      <div
                        key={tool.id}
                        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                      >
                        {/* Comparison checkbox */}
                        <div className="absolute top-4 left-4 z-10">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelectedForComparison}
                              onChange={() => toggleToolComparison(tool.id)}
                              disabled={!isSelectedForComparison && selectedForComparison.length >= 3}
                              className="w-4 h-4 accent-blue-600 rounded"
                              title="Select for comparison"
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              Compare
                            </span>
                          </label>
                        </div>

                        {/* Favorite button */}
                        <button
                          type="button"
                          aria-label={isFavorited ? 'Unfavorite tool' : 'Favorite tool'}
                          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                          className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors ${isFavorited ? 'text-pink-600' : 'text-gray-400'}`}
                          onClick={e => { e.stopPropagation(); toggleFavorite(tool.id); }}
                        >
                          <StarIcon className="w-6 h-6" />
                        </button>

                        {/* Badge */}
                        {badge && (
                          <span className={`absolute top-16 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold ${
                            badge === 'Recently Viewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {badge}
                          </span>
                        )}

                        <Link
                          href={`/tool/${tool.id}`}
                          className="block mt-8"
                          onClick={() => handleToolClick(tool.id)}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="text-4xl">{tool.logo}</div>
                            <div className="flex items-center gap-1">
                              {renderStars(tool.rating)}
                              <span className="text-sm font-semibold text-gray-900 dark:text-white ml-1" title="Tool rating">
                                {tool.rating || 0}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {tool.description}
                          </p>
                          
                          {/* Use Case Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {getUseCaseTags(tool).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                              <span className="font-semibold" title="Weekly users">{(tool.weeklyUsers || 0).toLocaleString()} users</span>
                              <div className="flex items-center gap-1 text-green-600 font-semibold" title="Growth">
                                <TrendingUpIcon className="w-4 h-4" />
                                {tool.growth || 'N/A'}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                              <span className="font-semibold">View Details</span>
                              <ArrowRightIcon className="w-4 h-4" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Related Categories Section */}
              {relatedCategories.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    You might also like
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedCategories.map((relatedCategory) => (
                      <Link
                        key={relatedCategory.name}
                        href={`/categories/${relatedCategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group"
                      >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group-hover:border-blue-200 dark:group-hover:border-blue-700">
                          <div className={`w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br ${relatedCategory.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            {relatedCategory.icon}
                          </div>
                          <h4 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white">
                            {relatedCategory.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4">
                            {relatedCategory.description}
                          </p>
                          <div className="flex items-center gap-2 text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                            <span className="font-medium text-sm">Explore</span>
                            <ArrowRightIcon className="w-3 h-3" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
            {/* Sidebar: visible on desktop, below grid on mobile */}
            <div className="lg:col-span-1 space-y-8">
              <div className="hidden lg:block sticky top-24">{SidebarContent}</div>
              <div className="block lg:hidden mt-12">{SidebarContent}</div>
            </div>
          </div>

          {/* Enhanced Empty State */}
          {sortedTools.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No tools found</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No ${category.name} tools match "${searchQuery}". Try different search terms.`
                  : `No tools found in ${category.name} category yet.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ/Guide Section at the bottom */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">{category?.name} Tools: Guide & FAQ</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
            Not sure where to start? Here’s a quick guide to help you find the perfect {category?.name} tool, plus answers to common questions.
          </p>
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">How to choose the right {category?.name} tool?</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Consider your main goal and the features you need. Use the filters above to narrow down your options. Each tool card highlights key features and stats to help you decide.
            </p>
          </div>
          <dl className="space-y-6">
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white">How are tools selected for this category?</dt>
              <dd className="text-gray-700 dark:text-gray-300">
                Tools are curated based on quality, popularity, and relevance to the {category?.name} category. We regularly review and update the list.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white">Can I suggest a new tool?</dt>
              <dd className="text-gray-700 dark:text-gray-300">
                Absolutely! If you know a great {category?.name} tool, <a href="/contact" className="text-blue-600 hover:underline">contact us</a> and let us know.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white">What makes a tool featured?</dt>
              <dd className="text-gray-700 dark:text-gray-300">
                Featured tools are selected based on user engagement, ratings, and recent trends. We aim to highlight tools that offer great value and innovation.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
} 