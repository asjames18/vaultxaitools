'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/data';
import { getToolsFromDB } from '@/data';
import SearchAndFilter from '@/components/SearchAndFilter';
import SearchResults from '@/components/SearchResults';
import type { Tool } from '@/data';

export default function SearchPage() {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tools from database on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const tools = await getToolsFromDB();
        setAllTools(tools);
        setFilteredTools(tools);
      } catch (error) {
        console.error('Error loading tools:', error);
        setFilteredTools([]);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

  // Get search suggestions based on current results
  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    
    // Add category names
    categories.forEach(cat => suggestions.add(cat.name));
    
    // Add popular tool names
    allTools.slice(0, 10).forEach((tool: Tool) => suggestions.add(tool.name));
    
    // Add common tags
    allTools.forEach((tool: Tool) => {
      tool.tags?.forEach((tag: string) => suggestions.add(tag));
    });

    return Array.from(suggestions).slice(0, 8);
  }, [allTools]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Search AI Tools
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect AI tool for your needs with our advanced search and filtering system
            </p>
          </div>

          {/* Search and Filter Component */}
          <SearchAndFilter
            tools={allTools}
            categories={categories}
            onResultsChange={handleResultsChange}
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchResults tools={filteredTools} />
      </div>
    </div>
  );
} 