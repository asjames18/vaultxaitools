'use client';

import Fuse from 'fuse.js';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Tool, Category } from '@/data/tools';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

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

    return results;
  }, [tools, searchQuery, selectedCategories, selectedPricing, minRating, fuse]);

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
  }, []);

  // Get active filter count
  const activeFiltersCount = selectedCategories.length + selectedPricing.length + (minRating > 0 ? 1 : 0);

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
            <span className="font-medium text-gray-900 dark:text-white">Filters</span>
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
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
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
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
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
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategories.length > 0 || selectedPricing.length > 0 || minRating > 0) && (
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
        </div>
      )}
    </div>
  );
}