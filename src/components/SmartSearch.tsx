'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

interface SmartSearchProps {
  tools: Tool[];
  onSearch?: (query: string) => void;
}

const popularSearches = [
  "AI writing tools",
  "Image generation",
  "Code assistants",
  "Video editing",
  "Chatbots",
  "Data analysis"
];

const aiSuggestions = [
  "Tools for content creators",
  "AI for small business",
  "Free AI tools",
  "Best AI for productivity"
];

export default function SmartSearch({ tools, onSearch }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Tool[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, tools]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto" ref={searchRef}>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search AI tools, categories, or use cases..."
          className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Smart Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Tool Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4" />
                AI Tools
              </h3>
              <div className="space-y-2">
                {suggestions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSearch(tool.name)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{tool.logo || tool.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{tool.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              AI Suggestions
            </h3>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-600 dark:text-gray-400"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isFocused && !showSuggestions && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Quick access:</span>
          {['ChatGPT', 'Midjourney', 'Notion AI', 'Cursor'].map((tool) => (
            <button
              key={tool}
              onClick={() => handleSearch(tool)}
              className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
            >
              {tool}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 