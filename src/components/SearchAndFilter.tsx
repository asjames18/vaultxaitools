'use client';

import Fuse from 'fuse.js';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Tool, Category } from '@/data/tools';
import { Search, Filter, X, ChevronDown, Star, Users, TrendingUp, Zap } from 'lucide-react';

interface SearchAndFilterProps {
  tools: Tool[];
  categories: Category[];
  onResultsChange: (tools: Tool[]) => void;
  className?: string;
}

// Icons
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <Search className={className} />
);

const FilterIcon = ({ className }: { className?: string }) => (
  <Filter className={className} />
);

export default function SearchAndFilter({ tools, categories, onResultsChange, className = '' }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState<string>('any');
  const [userCount, setUserCount] = useState<string>('any');
  const [growthRate, setGrowthRate] = useState<string>('any');

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(tools, {
      keys: ['name', 'description', 'category', 'tags'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [tools]);

  // Get unique pricing options
  const pricingOptions = useMemo(() => {
    const pricing = new Set(tools.map(tool => tool.pricing));
    return Array.from(pricing).sort();
  }, [tools]);

  // Filter and search tools
  const filteredTools = useMemo(() => {
    let results = tools;

    // Apply search
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery);
      results = searchResults.map(result => result.item);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(tool => selectedCategories.includes(tool.category));
    }

    // Apply pricing filter
    if (selectedPricing.length > 0) {
      results = results.filter(tool => selectedPricing.includes(tool.pricing));
    }

    // Apply rating filter
    if (minRating > 0) {
      results = results.filter(tool => tool.rating >= minRating);
    }

    // Apply max price filter
    if (maxPrice !== 'any') {
      results = results.filter(tool => {
        if (maxPrice === 'free') return tool.pricing === 'Free';
        if (maxPrice === 'freemium') return ['Free', 'Freemium'].includes(tool.pricing);
        if (maxPrice === 'paid') return ['Paid', 'Freemium'].includes(tool.pricing);
        return true;
      });
    }

    // Apply user count filter
    if (userCount !== 'any') {
      results = results.filter(tool => {
        const users = tool.weeklyUsers;
        if (userCount === 'small') return users < 10000;
        if (userCount === 'medium') return users >= 10000 && users < 100000;
        if (userCount === 'large') return users >= 100000;
        return true;
      });
    }

    // Apply growth rate filter
    if (growthRate !== 'any') {
      results = results.filter(tool => {
        const growth = parseInt(tool.growth.replace('+', '').replace('%', ''));
        if (growthRate === 'slow') return growth < 20;
        if (growthRate === 'medium') return growth >= 20 && growth < 50;
        if (growthRate === 'fast') return growth >= 50;
        return true;
      });
    }

    return results;
  }, [tools, searchQuery, selectedCategories, selectedPricing, minRating, maxPrice, userCount, growthRate, fuse]);

  // Update parent component with filtered results
  useEffect(() => {
    onResultsChange(filteredTools);
  }, [filteredTools, onResultsChange]);

  // Handle category toggle
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  // Handle pricing toggle
  const togglePricing = useCallback((pricing: string) => {
    setSelectedPricing(prev => 
      prev.includes(pricing) 
        ? prev.filter(p => p !== pricing)
        : [...prev, pricing]
    );
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPricing([]);
    setMinRating(0);
    setMaxPrice('any');
    setUserCount('any');
    setGrowthRate('any');
  }, []);

  // Get active filter count
  const activeFiltersCount = selectedCategories.length + selectedPricing.length + 
    (minRating > 0 ? 1 : 0) + (maxPrice !== 'any' ? 1 : 0) + 
    (userCount !== 'any' ? 1 : 0) + (growthRate !== 'any' ? 1 : 0);

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search AI tools by name, description, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Filter Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FilterIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        {showFilters && (
          <div className="p-4 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => toggleCategory(category.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategories.includes(category.name)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {pricingOptions.map((pricing) => (
                  <button
                    key={pricing}
                    onClick={() => togglePricing(pricing)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedPricing.includes(pricing)
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pricing}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Minimum Rating: {minRating > 0 ? `${minRating}+ stars` : 'Any rating'}
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                  {minRating > 0 ? `${minRating}+` : 'Any'}
                </span>
              </div>
            </div>

            {/* Max Price Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Max Price</h3>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Any price</option>
                <option value="free">Free only</option>
                <option value="freemium">Free & Freemium</option>
                <option value="paid">Paid tools</option>
              </select>
            </div>

            {/* User Count Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Base
              </h3>
              <select
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Any size</option>
                <option value="small">Small (&lt;10K users)</option>
                <option value="medium">Medium (10K-100K users)</option>
                <option value="large">Large (&gt;100K users)</option>
              </select>
            </div>

            {/* Growth Rate Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Growth Rate
              </h3>
              <select
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Any growth</option>
                <option value="slow">Slow (&lt;20%)</option>
                <option value="medium">Medium (20-50%)</option>
                <option value="fast">Fast (&gt;50%)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedPricing.length > 0 || minRating > 0 || maxPrice !== 'any' || userCount !== 'any' || growthRate !== 'any') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
            >
              {category}
              <button
                onClick={() => toggleCategory(category)}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedPricing.map((pricing) => (
            <span
              key={pricing}
              className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
            >
              {pricing}
              <button
                onClick={() => togglePricing(pricing)}
                className="hover:text-green-600 dark:hover:text-green-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
              {minRating}+ stars
              <button
                onClick={() => setMinRating(0)}
                className="hover:text-yellow-600 dark:hover:text-yellow-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {maxPrice !== 'any' && (
            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
              Max: {maxPrice}
              <button
                onClick={() => setMaxPrice('any')}
                className="hover:text-purple-600 dark:hover:text-purple-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {userCount !== 'any' && (
            <span className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm">
              {userCount} users
              <button
                onClick={() => setUserCount('any')}
                className="hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {growthRate !== 'any' && (
            <span className="inline-flex items-center gap-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-3 py-1 rounded-full text-sm">
              {growthRate} growth
              <button
                onClick={() => setGrowthRate('any')}
                className="hover:text-pink-600 dark:hover:text-pink-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}