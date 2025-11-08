'use client';

import React, { useState, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'boolean';
  options?: FilterOption[];
  placeholder?: string;
}

interface AdminSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  filterConfigs: FilterConfig[];
  onClearAll?: () => void;
  className?: string;
  showFilters?: boolean;
  searchPlaceholder?: string;
}

export function AdminSearchFilter({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  filterConfigs,
  onClearAll,
  className = '',
  showFilters = true,
  searchPlaceholder = 'Search...'
}: AdminSearchFilterProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  }, [localFilters, onFilterChange]);

  const handleClearFilter = useCallback((key: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[key];
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  }, [localFilters, onFilterChange]);

  const handleClearAll = useCallback(() => {
    setLocalFilters({});
    onFilterChange({});
    if (onClearAll) {
      onClearAll();
    }
  }, [onFilterChange, onClearAll]);

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.trim() !== '';

  const renderFilterInput = (config: FilterConfig) => {
    switch (config.type) {
      case 'select':
        return (
          <select
            value={localFilters[config.key] || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value || undefined)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{config.placeholder || `Select ${config.label}`}</option>
            {config.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {option.count !== undefined && `(${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        const selectedValues = localFilters[config.key] || [];
        return (
          <div className="space-y-2">
            {config.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v: string) => v !== option.value);
                    handleFilterChange(config.key, newValues.length > 0 ? newValues : undefined);
                  }}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={localFilters[config.key] || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value || undefined)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'boolean':
        return (
          <select
            value={localFilters[config.key] || ''}
            onChange={(e) => handleFilterChange(config.key, e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{config.placeholder || `Select ${config.label}`}</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Toggle Button */}
        {showFilters && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium ${
              isFiltersOpen
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {Object.keys(filters).length + (searchQuery.trim() !== '' ? 1 : 0)}
              </span>
            )}
          </button>
        )}

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery.trim() !== '' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {Object.entries(filters).map(([key, value]) => {
            const config = filterConfigs.find(c => c.key === key);
            if (!config) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (typeof value === 'boolean') {
              displayValue = value ? 'Yes' : 'No';
            }

            return (
              <span key={key} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {config.label}: {displayValue}
                <button
                  onClick={() => handleClearFilter(key)}
                  className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && isFiltersOpen && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterConfigs.map((config) => (
              <div key={config.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {config.label}
                </label>
                {renderFilterInput(config)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing search and filter state
export function useSearchFilter(initialFilters: Record<string, any> = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
  }, []);

  const clearAll = useCallback(() => {
    setSearchQuery('');
    setFilters({});
  }, []);

  return {
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    clearAll
  };
}
