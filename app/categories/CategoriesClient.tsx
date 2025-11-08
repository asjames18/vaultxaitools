'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/data';
import type { Tool } from '@/data';
import { useRealTimeTools } from '@/lib/useRealTimeTools';
import { useToolsUpdates } from '@/lib/useDataUpdates';


// Type for search suggestions
type SearchSuggestion = 
  | { type: 'category'; name: string; description: string; color: string; icon: string }
  | { type: 'tool'; id: string; name: string; category: string; description: string };

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

// Heart icons
const HeartIcon = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
  </svg>
);

interface CategoriesClientProps {
  tools: Tool[];
}

export default function CategoriesClient({ tools }: CategoriesClientProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '/categories';
  const searchParams = useSearchParams();
  
  // Use real-time tools data instead of static props
  const { tools: realTimeTools, loading: toolsLoading, error: toolsError } = useRealTimeTools();
  
  // Listen for admin updates and refresh data
  useToolsUpdates(() => {
    console.log('🔄 CategoriesClient received tools update, refreshing data...');
    // The useRealTimeTools hook will automatically refresh when Supabase data changes
  }, []);
  
  // Use real-time data when available, fallback to props
  const activeTools = realTimeTools.length > 0 ? realTimeTools : tools;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('quality');
  const [bestUseCase, setBestUseCase] = useState<string>('All');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showWhyQuality, setShowWhyQuality] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  // Use real-time loading state
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Update loading state based on real-time data
  useEffect(() => {
    if (realTimeTools.length > 0) {
      setIsLoading(false);
    } else if (!toolsLoading) {
      // Fallback to static data loading
      const timer = setTimeout(() => setIsLoading(false), 900);
      return () => clearTimeout(timer);
    }
  }, [realTimeTools, toolsLoading]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favoriteCategories');
    if (stored) setFavoriteCategories(JSON.parse(stored));
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('favoriteCategories', JSON.stringify(favoriteCategories));
  }, [favoriteCategories]);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewedCategories');
    if (stored) setRecentlyViewed(JSON.parse(stored));
  }, []);

  // Add to recently viewed when a category is clicked
  const handleCategoryClick = (categoryName: string) => {
    setRecentlyViewed(prev => {
      const updated = [categoryName, ...prev.filter(name => name !== categoryName)].slice(0, 8);
      localStorage.setItem('recentlyViewedCategories', JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate real stats from tools data
  const totalReviews = activeTools.reduce((sum, tool) => sum + (tool.reviewCount || 0), 0);
  


  // Toggle favorite
  const toggleFavorite = (categoryName: string) => {
    setFavoriteCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(subscribeEmail)) {
      setSubscribeStatus('success');
      setSubscribeEmail('');
    } else {
      setSubscribeStatus('error');
    }
  };

  const filteredTools = useMemo(() => {
    const hasAnyFilter =
      !!searchQuery || selectedCategory !== 'All' ||
      bestUseCase !== 'All' || selectedPricing.length > 0 || selectedTags.length > 0;

    const normalizedSelectedTags = selectedTags.map(t => t.toLowerCase());

    return hasAnyFilter
    ? activeTools.filter(tool => {
        const matchesSearch = !searchQuery || 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
          const matchesUseCase = bestUseCase === 'All' || (tool.tags?.some(t => t.toLowerCase().includes(bestUseCase.toLowerCase())) ?? false);
          const matchesPricing = selectedPricing.length === 0 || selectedPricing.includes(tool.pricing);
          const matchesTags = normalizedSelectedTags.length === 0 || (tool.tags?.some(t => normalizedSelectedTags.includes(t.toLowerCase())) ?? false);
          return matchesSearch && matchesCategory && matchesUseCase && matchesPricing && matchesTags;
      })
    : activeTools;
  }, [activeTools, searchQuery, selectedCategory, bestUseCase, selectedPricing, selectedTags]);

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'quality':
        // Quality sort based on name for now
        return a.name.localeCompare(b.name);
      default:
        return a.name.localeCompare(b.name); // alphabetical
    }
  });

  const visibleTools = useMemo(() => sortedTools.slice(0, visibleCount), [sortedTools, visibleCount]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('quality');
    setBestUseCase('All');
    setSelectedPricing([]);
    setSelectedTags([]);
  };

  const activeFilterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (selectedCategory !== 'All') chips.push({ label: `Category: ${selectedCategory}` , onRemove: () => setSelectedCategory('All') });
    if (bestUseCase !== 'All') chips.push({ label: `Use: ${bestUseCase}` , onRemove: () => setBestUseCase('All') });
    // ratings removed
    selectedPricing.forEach(p => chips.push({ label: p, onRemove: () => setSelectedPricing(prev => prev.filter(x => x!==p)) }));
    selectedTags.forEach(t => chips.push({ label: t, onRemove: () => setSelectedTags(prev => prev.filter(x => x!==t)) }));
    if (searchQuery) chips.push({ label: `Search: “${searchQuery}”`, onRemove: () => setSearchQuery('') });
    return chips;
  }, [selectedCategory, bestUseCase, selectedPricing, selectedTags, searchQuery]);

  const addToCompare = (id: string) => {
    const raw = localStorage.getItem('compare-tools');
    const list: string[] = raw ? JSON.parse(raw) : [];
    const next = Array.from(new Set([...list, id])).slice(0, 4);
    localStorage.setItem('compare-tools', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('vaultx-compare-add', { detail: id }));
  };

  // URL sync: load from query on mount
  useEffect(() => {
    const q = searchParams?.get('q') || '';
    const category = searchParams?.get('category') || 'All';
    const sort = searchParams?.get('sort') || 'quality';
    // ratings removed
    const use = searchParams?.get('use') || 'All';
    const pricing = searchParams?.get('pricing') || '';
    const tags = searchParams?.get('tags') || '';

    setSearchQuery(q);
    setSelectedCategory(category);
    setSortBy(sort);
    // ratings removed
    setBestUseCase(use);
    setSelectedPricing(pricing ? pricing.split(',').filter(Boolean) : []);
    setSelectedTags(tags ? tags.split(',').filter(Boolean) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL sync: write on changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (sortBy && sortBy !== 'quality') params.set('sort', sortBy);
    // ratings removed
    if (bestUseCase && bestUseCase !== 'All') params.set('use', bestUseCase);
    if (selectedPricing.length) params.set('pricing', selectedPricing.join(','));
    if (selectedTags.length) params.set('tags', selectedTags.join(','));

    const queryString = params.toString();
    const next = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(next, { scroll: false });
  }, [searchQuery, selectedCategory, sortBy, bestUseCase, selectedPricing, selectedTags, pathname, router]);

  // Get search suggestions
  const searchSuggestions: SearchSuggestion[] = searchQuery ? [
    ...categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(cat => ({ 
      type: 'category' as const, 
      name: cat.name, 
      description: cat.description, 
      color: cat.color, 
      icon: cat.icon 
    })),
    ...activeTools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(tool => ({ 
      type: 'tool' as const, 
      id: tool.id, 
      name: tool.name, 
      category: tool.category, 
      description: tool.description 
    }))
  ] : [];

  // ratings removed

  if (activeTools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <SparklesIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Discovering amazing AI tools...</p>
        </div>
      </div>
    );
  }

  // Helper: get unique categories in order: featured, favorites, recently viewed, then all others
  const orderedCategoryNames = [
    ...categories.map(cat => cat.name).filter(
      name => !recentlyViewed.includes(name) // Exclude recently viewed from featured
    ),
    ...recentlyViewed,
  ];
  const orderedCategories = orderedCategoryNames
    .map(name => categories.find(cat => cat.name === name))
    .filter(Boolean);

  // Helper: get badge for a category
  const getCategoryBadge = (categoryName: string) => {
    if (recentlyViewed.includes(categoryName)) return 'Recently Viewed';
    return null;
  };

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <div className="space-y-8">
      {/* Subscribe for Updates CTA */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800 p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Stay Updated!</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-4">Subscribe to get the latest AI tools and category updates delivered to your inbox.</p>
        <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
          <label htmlFor="sidebar-subscribe-email" className="sr-only">Email address</label>
          <input
            id="sidebar-subscribe-email"
            type="email"
            value={subscribeEmail}
            onChange={e => { setSubscribeEmail(e.target.value); setSubscribeStatus('idle'); }}
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
        {subscribeStatus === 'success' && (
          <p className="mt-2 text-green-600 font-semibold">Thank you for subscribing!</p>
        )}
        {subscribeStatus === 'error' && (
          <p className="mt-2 text-red-600 font-semibold">Please enter a valid email address.</p>
        )}
      </div>
      {/* Quick Links */}
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Suggest a Category</a>
          </li>
          <li>
            <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact / Help</a>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Search Suggestions Portal - positioned at page level */}
      {showSearchSuggestions && searchSuggestions.length > 0 && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ top: '0', left: '0', right: '0', bottom: '0' }}
        >
          <div className="relative max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-0" style={{ top: '220px' }}>
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto pointer-events-auto mx-4 sm:mx-0">
              <div className="p-2">
                {searchSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors group hover:bg-blue-100 shadow-sm"
                    onClick={() => {
                      if (item.type === 'category') {
                        // It's a category
                        setSelectedCategory(item.name);
                        setSearchQuery('');
                      } else {
                        // It's a tool - use router.push instead of window.location.href
                        router.push(`/tool/${item.id}`);
                      }
                    }}
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
                      <span className="text-lg sm:text-2xl text-blue-700">
                        {item.type === 'category' ? '📁' : '🔧'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-black text-sm sm:text-base group-hover:text-blue-700 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-600 truncate">
                        {item.type === 'category' ? 'Category' : item.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section - Matching Home Page Style */}
      <section className="relative overflow-hidden">
        {/* Animated background elements - Same as home page */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced badge - Same style as home page */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in">
              <SparklesIcon className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Find Media Tools</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            
            {/* Main headline - Similar to home page */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-slide-up">
              Media Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Discover the right media production tools for your church or ministry. Filter by quality, reviews, and tags to find what actually works.
            </p>

            {/* Search moved below into the main content area */}

            {/* Enhanced stats with animations - Same style as home page */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{filteredTools.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Matching Tools</div>
              </div>
              {/* ratings stats removed */}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Media Tool Finder
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
              Filter by best use case and quality to find media production tools that work for your church or ministry
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
            {/* Main grid: responsive layout */}
            <div className="xl:col-span-3 2xl:col-span-4">
              {/* Results toolbar */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div aria-live="polite" className="text-sm text-gray-600 dark:text-gray-300">
                  {filteredTools.length} tools found
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button aria-pressed={viewMode==='grid'} onClick={() => setViewMode('grid')} className={`px-2.5 py-1.5 rounded-md text-sm border ${viewMode==='grid' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800'} dark:border-gray-700`}>Grid</button>
                  <button aria-pressed={viewMode==='list'} onClick={() => setViewMode('list')} className={`px-2.5 py-1.5 rounded-md text-sm border ${viewMode==='list' ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-800'} dark:border-gray-700`}>List</button>
                  <button onClick={clearAllFilters} className="px-3 py-1.5 rounded-md text-sm border border-gray-300 hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">Clear</button>
                </div>
              </div>
              {/* Active filter chips */}
              {activeFilterChips.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {activeFilterChips.map((chip, i) => (
                    <button key={i} onClick={chip.onRemove} className="group inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                      <span>{chip.label}</span>
                      <span aria-hidden className="ml-1 rounded-full bg-blue-200 px-1.5 group-hover:bg-blue-300 dark:bg-blue-800">×</span>
                    </button>
                  ))}
                </div>
              )}
              {/* Search bar */}
              <div className="mb-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search media tools or categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
              {/* Filters: use case + quality + facets */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select value={bestUseCase} onChange={e => setBestUseCase(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm sm:text-base">
                  {['All','writing','coding','design','automation','research','analytics','video','audio'].map(v => (
                    <option key={v} value={v}>{v === 'All' ? 'Best Use Case: All' : `Use Case: ${v}`}</option>
                  ))}
                </select>
                {/* rating/review filters removed */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm sm:text-base">
                  {[
                    {k:'quality', v:'Best Quality'},
                    {k:'popular', v:'Most Popular'},
                    // ratings removed
                  ].map(o => (
                    <option key={o.k} value={o.k}>{o.v}</option>
                  ))}
                </select>
              </div>
              {/* Facets row */}
              <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                {['Free','Freemium','Paid'].map(p => {
                  const active = selectedPricing.includes(p);
                  return (
                    <button key={p} aria-pressed={active} onClick={() => setSelectedPricing(prev => active ? prev.filter(x => x!==p) : [...prev, p])} className={`px-3.5 py-2 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' : 'border-gray-300 hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'}`}>{p}</button>
                  );
                })}
                {['Open Source','No Login','API','Privacy-first'].map(tag => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button key={tag} aria-pressed={active} onClick={() => setSelectedTags(prev => active ? prev.filter(x => x!==tag) : [...prev, tag])} className={`px-3.5 py-2 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' : 'border-gray-300 hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'}`}>{tag}</button>
                  );
                })}
                {sortBy === 'quality' && (
                  <button onClick={() => setShowWhyQuality(v => !v)} className="ml-auto text-gray-600 underline decoration-dotted hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Why this order?</button>
                )}
              </div>
              {showWhyQuality && (
                <div role="note" className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">Ranking blends popularity and recent growth with curator picks.
              </div>
              )}
              <div className={viewMode==='grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [@media(min-width:1600px)]:grid-cols-5 [@media(min-width:1920px)]:grid-cols-6 gap-4 sm:gap-6 lg:gap-8' : 'space-y-4'}>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 shadow-lg">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-3xl bg-gray-200 dark:bg-gray-700" />
                      <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 sm:mb-3 w-2/3 mx-auto" />
                      <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 sm:mb-6 w-5/6 mx-auto" />
                      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="h-3 sm:h-4 w-8 sm:w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 sm:h-4 w-8 sm:w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
                        <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-6 sm:h-8 w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                    </div>
                  ))
                ) : (
                  visibleTools.map((tool) => (
                    <div key={tool.id} className={viewMode==='grid' ? 'group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden' : 'group bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden'}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">{tool.logo || tool.name.charAt(0)}</span>
                            </div>
                            <div>
                              <Link href={`/tool/${tool.id}`} className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.name}</Link>
                              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{tool.category}</span>
                                <span>•</span>
                                <span>{tool.pricing}</span>
                              </div>
                            </div>
                          </div>
                          {/* ratings removed */}
                              </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{tool.description}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {(tool.tags || []).slice(0,3).map(tag => (
                            <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-200">{tag}</span>
                          ))}
                                  </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-end">
                          <button onClick={() => addToCompare(tool.id)} className="flex-1 sm:flex-none px-3.5 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50 text-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors" title="Add to compare">Compare</button>
                          <Link href={`/tool/${tool.id}`} className="flex-1 sm:flex-none px-3.5 py-2 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-center transition-colors">View</Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Load more */}
              {visibleCount < sortedTools.length && (
                <div className="mt-8 flex justify-center">
                  <button onClick={() => setVisibleCount(c => c + 12)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">Load more</button>
                </div>
              )}
            </div>
            {/* Sidebar: responsive layout */}
            <div className="xl:col-span-1 space-y-6 sm:space-y-8">
              <div className="hidden xl:block sticky top-24">{SidebarContent}</div>
              <div className="block xl:hidden mt-8 sm:mt-12">{SidebarContent}</div>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced FAQ/Guide Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8 sm:mt-12">
        <div className="max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white text-center">Media Tool Categories: Guide & FAQ</h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-center px-4 sm:px-0">
            Not sure where to start? Here's a quick guide to help you find the perfect media production tool category for your church or ministry needs, plus answers to common questions.
          </p>
          <div className="mb-8 sm:mb-10">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">How to choose the right category?</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Think about your main goal: Are you looking to boost productivity, create content, analyze data, or something else? Browse categories that match your use case, and use the search and filters to narrow down your options. Each category page highlights top tools and features to help you decide.
            </p>
          </div>
          <dl className="space-y-4 sm:space-y-6">
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">How are categories selected?</dt>
              <dd className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1 sm:mt-2">
                Categories are curated based on industry trends, user demand, and the unique features of each tool. We regularly review and update categories to reflect the evolving media production landscape for churches and ministries.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Can I suggest a new category?</dt>
              <dd className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1 sm:mt-2">
                Absolutely! If you have an idea for a new category, <a href="/contact" className="text-blue-600 hover:underline">contact us</a> and let us know. We value community input.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">What makes a tool popular or featured?</dt>
              <dd className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mt-1 sm:mt-2">
                Popular and featured tools are selected based on user engagement, ratings, and recent trends. We aim to highlight tools that offer great value and innovation.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
} 