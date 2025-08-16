import React, { useState, useEffect } from 'react';
import { Search, Filter, X, TrendingUp, Star, Zap } from 'lucide-react';

interface FilterOptions {
  category: string;
  pricing: string;
  integration: string;
  language: string;
  aiModel: string;
  rating: number;
  weeklyUsers: string;
  growth: string;
}

interface EnhancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  onSearch?: (query: string) => void;
  categories: string[];
  searchQuery?: string;
  totalResults?: number;
  isLoading?: boolean;
}

export default function EnhancedFilters({ 
  onFiltersChange, 
  onSearch, 
  categories, 
  searchQuery = '', 
  totalResults = 0,
  isLoading = false 
}: EnhancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    pricing: '',
    integration: '',
    language: '',
    aiModel: '',
    rating: 0,
    weeklyUsers: '',
    growth: ''
  });
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      pricing: '',
      integration: '',
      language: '',
      aiModel: '',
      rating: 0,
      weeklyUsers: '',
      growth: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Update search input when prop changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search AI tools by name, features, or use case..."
            className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-white/50 hover:text-white/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Results Summary */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 text-white/80">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{totalResults} tools found</span>
          </div>
          <button
            onClick={clearFilters}
            className="text-white/70 hover:text-white text-sm underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </span>
        </button>
        {showAdvancedFilters && (
          <button
            onClick={clearFilters}
            className="text-white/70 hover:text-white text-sm underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Pricing Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Pricing</label>
            <select
              value={filters.pricing}
              onChange={(e) => handleFilterChange('pricing', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Pricing</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid">Paid</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Minimum Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>

          {/* Weekly Users Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Popularity</label>
            <select
              value={filters.weeklyUsers}
              onChange={(e) => handleFilterChange('weeklyUsers', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">Any Popularity</option>
              <option value="1000">1K+ users</option>
              <option value="10000">10K+ users</option>
              <option value="100000">100K+ users</option>
              <option value="1000000">1M+ users</option>
            </select>
          </div>

          {/* Growth Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Growth Rate</label>
            <select
              value={filters.growth}
              onChange={(e) => handleFilterChange('growth', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">Any Growth</option>
              <option value="10">10%+ growth</option>
              <option value="20">20%+ growth</option>
              <option value="50">50%+ growth</option>
              <option value="100">100%+ growth</option>
            </select>
          </div>

          {/* Integration Filter */}
          <div>
            <label className="block text-white/80 text-sm mb-2">Integration Type</label>
            <select
              value={filters.integration}
              onChange={(e) => handleFilterChange('integration', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="">All Integrations</option>
              <option value="api">API</option>
              <option value="mobile">Mobile App</option>
              <option value="browser">Browser Extension</option>
              <option value="desktop">Desktop App</option>
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {Object.values(filters).some(value => value !== '' && value !== 0) && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white/80 text-sm font-medium">Active Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="text-blue-300 hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.pricing && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">
                Pricing: {filters.pricing}
                <button
                  onClick={() => handleFilterChange('pricing', '')}
                  className="text-green-300 hover:text-green-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.rating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">
                Rating: {filters.rating}+ <Star className="w-3 h-3" />
                <button
                  onClick={() => handleFilterChange('rating', 0)}
                  className="text-yellow-300 hover:text-yellow-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.weeklyUsers && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                Users: {filters.weeklyUsers}+
                <button
                  onClick={() => handleFilterChange('weeklyUsers', '')}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.growth && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-200 text-xs rounded-full">
                Growth: {filters.growth}%+
                <button
                  onClick={() => handleFilterChange('growth', '')}
                  className="text-orange-300 hover:text-orange-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
