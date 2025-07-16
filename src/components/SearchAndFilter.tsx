'use client';

import Fuse from 'fuse.js';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Tool, Category } from '@/data';
import AccessibleRating from './AccessibleRating';
import ToolCard from './ToolCard';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'popularity' | 'growth'>('relevance');
  const [minRating, setMinRating] = useState<number>(0);
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  const toolsList = tools;
  const fuse = useMemo(
    () =>
      new Fuse(toolsList, {
        keys: ['name', 'blurb', 'category'],
        threshold: 0.3,
      }),
    [toolsList]
  );

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map(r => r.item)
    : toolsList;

  const displayedTools = searchResults.filter(
    t =>
      (selectedCategories.length === 0 || selectedCategories.includes(t.category)) &&
      (selectedTiers.length === 0 || selectedTiers.includes(t.pricing))
  );

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
    setSearchTerm(query);
    
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
    setSearchTerm('');
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
    searchTerm ? 1 : 0,
    selectedCategories.length,
    minRating > 0 ? 1 : 0,
    pricingFilter !== 'all' ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="flex">
      {/* Filters Sidebar */}
      <aside className="p-4 border-r">
        <h2 className="font-bold mb-2">Filters</h2>
        <h3 className="font-semibold">Category</h3>
        {[...new Set(toolsList.map(t => t.category))].map(cat => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              value={cat}
              checked={selectedCategories.includes(cat)}
              onChange={() =>
                setSelectedCategories(prev =>
                  prev.includes(cat)
                    ? prev.filter(c => c !== cat)
                    : [...prev, cat]
                )
              }
            />
            <span className="ml-2">{cat}</span>
          </label>
        ))}

        <h3 className="font-semibold mt-4">Price</h3>
        {[...new Set(toolsList.map(t => t.pricing))].map(tier => (
          <label key={tier} className="block">
            <input
              type="checkbox"
              value={tier}
              checked={selectedTiers.includes(tier)}
              onChange={() =>
                setSelectedTiers(prev =>
                  prev.includes(tier)
                    ? prev.filter(x => x !== tier)
                    : [...prev, tier]
                )
              }
            />
            <span className="ml-2">{tier}</span>
          </label>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayedTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </main>
    </div>
  );
}