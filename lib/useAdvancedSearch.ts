import { useState, useCallback, useRef, useEffect } from 'react';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  popularity: number;
  lastUpdated: string;
  relevance: number;
  type: 'tool' | 'article' | 'category' | 'user';
  views: number;
  likes: number;
  price: string;
  userRating: number;
  reviewCount: number;
}

export interface SearchFilter {
  category: string[];
  rating: number;
  popularity: number;
  dateRange: 'all' | 'week' | 'month' | 'year';
  price: 'free' | 'paid' | 'freemium' | 'all';
  features: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: SearchFilter;
  query: string;
}

export interface UseAdvancedSearchReturn {
  // State
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
  filters: SearchFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  
  // Actions
  search: (query: string, filters?: Partial<SearchFilter>, page?: number) => Promise<void>;
  updateFilters: (newFilters: Partial<SearchFilter>) => void;
  clearFilters: () => void;
  loadMore: () => Promise<void>;
  resetSearch: () => void;
  
  // Utilities
  hasMore: boolean;
  totalResults: number;
}

const DEFAULT_FILTERS: SearchFilter = {
  category: [],
  rating: 0,
  popularity: 0,
  dateRange: 'all',
  price: 'all',
  features: []
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
};

export function useAdvancedSearch(): UseAdvancedSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string, searchFilters: SearchFilter, page: number = 1) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery, searchFilters, page);
    }, 300);
  }, []);

  // Perform the actual search
  const performSearch = async (searchQuery: string, searchFilters: SearchFilter, page: number = 1) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          filters: searchFilters,
          page,
          limit: pagination.limit
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      
      if (page === 1) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }
      
      setPagination(data.pagination);
      setQuery(searchQuery);
      setFilters(searchFilters);

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Main search function
  const search = useCallback(async (searchQuery: string, searchFilters: Partial<SearchFilter> = {}, page: number = 1) => {
    const mergedFilters = { ...filters, ...searchFilters };
    
    if (page === 1) {
      // Reset results for new search
      setResults([]);
      setPagination(DEFAULT_PAGINATION);
    }
    
    debouncedSearch(searchQuery, mergedFilters, page);
  }, [filters, debouncedSearch]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Auto-search with new filters if we have a query
    if (query.trim()) {
      search(query, updatedFilters, 1);
    }
  }, [filters, query, search]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = DEFAULT_FILTERS;
    setFilters(clearedFilters);
    
    // Re-search with cleared filters
    if (query.trim()) {
      search(query, clearedFilters, 1);
    }
  }, [query, search]);

  // Load more results
  const loadMore = useCallback(async () => {
    if (loading || pagination.page >= pagination.pages) return;
    
    await search(query, filters, pagination.page + 1);
  }, [loading, pagination.page, pagination.pages, query, filters, search]);

  // Reset search
  const resetSearch = useCallback(() => {
    setResults([]);
    setLoading(false);
    setError(null);
    setQuery('');
    setFilters(DEFAULT_FILTERS);
    setPagination(DEFAULT_PAGINATION);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    results,
    loading,
    error,
    query,
    filters,
    pagination,
    
    // Actions
    search,
    updateFilters,
    clearFilters,
    loadMore,
    resetSearch,
    
    // Utilities
    hasMore: pagination.page < pagination.pages,
    totalResults: pagination.total
  };
}
