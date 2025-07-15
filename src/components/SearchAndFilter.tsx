'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Tool, Category } from '@/data';
import AccessibleRating from './AccessibleRating';

// Icons
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SearchAndFilterProps {
  tools: Tool[];
  categories: Category[];
  onResultsChange?: (filteredTools: Tool[]) => void;
  showAdvancedFilters?: boolean;
  className?: string;
}

export default function SearchAndFilter({ 
  tools, 
  categories, 
  onResultsChange, 
  showAdvancedFilters = true,
  className = "" 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'popularity' | 'growth'>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const lastFilteredToolsRef = useRef<Tool[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Memoized search and filter logic
  const filteredTools = useMemo(() => {
    let results = tools;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        tool.features?.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(tool => selectedCategories.includes(tool.category));
    }

    // Rating filter
    if (minRating > 0) {
      results = results.filter(tool => tool.rating >= minRating);
    }

    // Pricing filter
    if (pricingFilter !== 'all') {
      results = results.filter(tool => {
        const pricing = tool.pricing.toLowerCase();
        switch (pricingFilter) {
          case 'free':
            return pricing.includes('free') || pricing.includes('freemium');
          case 'paid':
            return !pricing.includes('free');
          case 'freemium':
            return pricing.includes('freemium');
          default:
            return true;
        }
      });
    }

    // Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.weeklyUsers - a.weeklyUsers;
        case 'growth':
          const aGrowth = parseInt(a.growth.replace(/[^0-9]/g, ''));
          const bGrowth = parseInt(b.growth.replace(/[^0-9]/g, ''));
          return bGrowth - aGrowth;
        case 'relevance':
        default:
          // For relevance, prioritize exact matches and then by rating
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const aExactMatch = a.name.toLowerCase() === query;
            const bExactMatch = b.name.toLowerCase() === query;
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
          }
          return b.rating - a.rating;
      }
    });

    return results;
  }, [tools, searchQuery, selectedCategories, sortBy, minRating, pricingFilter]);

  // Handle category selection
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // Update parent if callback exists
      if (onResultsChange) {
        const newFilteredTools = tools.filter(tool => {
          if (newCategories.length === 0) return true;
          return newCategories.includes(tool.category);
        });
        onResultsChange(newFilteredTools);
      }
      
      return newCategories;
    });
  }, [tools, onResultsChange]);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Update parent if callback exists
    if (onResultsChange) {
      const newFilteredTools = tools.filter(tool => {
        if (!query.trim()) return true;
        const searchTerm = query.toLowerCase();
        return tool.name.toLowerCase().includes(searchTerm) ||
               tool.description.toLowerCase().includes(searchTerm) ||
               tool.category.toLowerCase().includes(searchTerm) ||
               tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
               tool.features?.some(feature => feature.toLowerCase().includes(searchTerm));
      });
      onResultsChange(newFilteredTools);
    }
  }, [tools, onResultsChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('relevance');
    setMinRating(0);
    setPricingFilter('all');
    
    // Reset parent to original tools
    if (onResultsChange) {
      onResultsChange(tools);
    }
  }, [tools, onResultsChange]);

  // Get active filter count
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedCategories.length,
    minRating > 0 ? 1 : 0,
    pricingFilter !== 'all' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Search AI tools by name, description, category, or features
        </label>
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={searchInputRef}
          id="search-input"
          type="text"
          placeholder="Search AI tools by name, description, category, or features..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm search-input"
          aria-describedby={searchQuery ? "search-clear-button" : undefined}
        />
        {searchQuery && (
          <button
            id="search-clear-button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showAdvancedFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium filter-toggle focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                showFilters 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
            >
              <FilterIcon className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full" aria-label={`${activeFilterCount} active filters`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {/* Sort Dropdown */}
          <label htmlFor="sort-select" className="sr-only">
            Sort tools by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            aria-label="Sort tools by"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="rating">Sort by Rating</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="growth">Sort by Growth</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite" aria-atomic="true">
          <span id="results-count">{filteredTools.length}</span> of {tools.length} tools
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && showFilters && (
        <section
          ref={filterPanelRef}
          id="filter-panel"
          role="region"
          aria-label="Filter tools"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6"
        >
          {/* Categories */}
          <fieldset>
            <legend className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Categories
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select categories">
              {categories.map((category) => (
                <label
                  key={category.name}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                    selectedCategories.includes(category.name)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                    className="sr-only"
                    aria-label={`Filter by ${category.name} category`}
                  />
                  {category.icon} {category.name}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Rating Filter */}
          <fieldset>
            <legend className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Minimum Rating
            </legend>
            <div className="flex items-center gap-4">
              <label htmlFor="rating-slider" className="sr-only">
                Minimum rating: {minRating} stars
              </label>
              <input
                id="rating-slider"
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="flex-1"
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={minRating}
                aria-valuetext={`${minRating} stars`}
              />
              <div className="flex items-center gap-1 min-w-[60px]" aria-hidden="true">
                <AccessibleRating rating={minRating} size="sm" aria-label={`Minimum rating: ${minRating} stars`} />
                <span className="text-sm font-medium">+</span>
              </div>
            </div>
          </fieldset>

          {/* Pricing Filter */}
          <fieldset>
            <legend className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Pricing
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select pricing type">
              {[
                { value: 'all', label: 'All' },
                { value: 'free', label: 'Free' },
                { value: 'freemium', label: 'Freemium' },
                { value: 'paid', label: 'Paid' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
                    pricingFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="pricing-filter"
                    value={option.value}
                    checked={pricingFilter === option.value}
                    onChange={(e) => setPricingFilter(e.target.value)}
                    className="sr-only"
                    aria-label={`Filter by ${option.label} pricing`}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`Clear all ${activeFilterCount} active filters`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="region" aria-label="Active filters">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Search: "{searchQuery}"
              <button 
                onClick={() => setSearchQuery('')} 
                className="ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Remove search filter"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategories.map((category) => (
            <span key={category} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {category}
              <button 
                onClick={() => toggleCategory(category)} 
                className="ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label={`Remove ${category} filter`}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Rating: {minRating}+
              <button 
                onClick={() => setMinRating(0)} 
                className="ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Remove rating filter"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {pricingFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              Pricing: {pricingFilter}
              <button 
                onClick={() => setPricingFilter('all')} 
                className="ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                aria-label="Remove pricing filter"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 