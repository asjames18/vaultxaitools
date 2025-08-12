'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categories } from '@/data';
import type { Tool } from '@/data';


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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  // Simulate loading state for demo (replace with real loading logic if needed)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900); // Simulate 900ms load
    return () => clearTimeout(timer);
  }, []);

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
  const totalReviews = tools.reduce((sum, tool) => sum + (tool.reviewCount || 0), 0);
  const totalUsers = tools.reduce((sum, tool) => sum + (tool.weeklyUsers || 0), 0);
  
  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

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

  const filteredTools = searchQuery || selectedCategory !== 'All' 
    ? tools.filter(tool => {
        const matchesSearch = !searchQuery || 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : tools;

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'users':
        return b.weeklyUsers - a.weeklyUsers;
      case 'growth':
        return parseFloat(b.growth.replace('%', '')) - parseFloat(a.growth.replace('%', ''));
      default:
        return b.weeklyUsers - a.weeklyUsers; // popular
    }
  });

  // Get search suggestions
  const searchSuggestions: SearchSuggestion[] = searchQuery ? [
    ...categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(cat => ({ 
      type: 'category' as const, 
      name: cat.name, 
      description: cat.description, 
      color: cat.color, 
      icon: cat.icon 
    })),
    ...tools.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(tool => ({ 
      type: 'tool' as const, 
      id: tool.id, 
      name: tool.name, 
      category: tool.category, 
      description: tool.description 
    }))
  ] : [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : i < rating
            ? 'text-yellow-500 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (tools.length === 0) {
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced badge - Same style as home page */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-full px-6 py-3 mb-8 shadow-lg animate-fade-in">
              <SparklesIcon className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Explore AI Categories</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            
            {/* Main headline - Similar to home page */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-slide-up">
              AI Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Discover the perfect AI tools organized by category. From productivity to creativity, find exactly what you need.
            </p>

            {/* Enhanced search bar - Same style as home page */}
            <div className="max-w-2xl mx-auto mb-12 animate-scale-in">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI tools or categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                  className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Enhanced stats with animations - Same style as home page */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{tools.length}+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Tools</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{formatNumber(totalReviews)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">{formatNumber(totalUsers)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white">
              Browse AI Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0">
              Find the perfect AI tool for your specific needs across different domains
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Main grid: responsive layout */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  orderedCategories.map((category) => {
                    if (!category) return null;
                    const isFavorited = favoriteCategories.includes(category.name);
                    // Dynamically count tools for this category
                    const toolsInCategory = tools.filter(tool => tool.category === category.name);
                    const toolCount = toolsInCategory.length;
                    // Dynamically get top 3 popular tools by weeklyUsers
                    const popularTools = toolsInCategory
                      .sort((a, b) => b.weeklyUsers - a.weeklyUsers)
                      .slice(0, 3)
                      .map(tool => tool.name);
                    // Calculate average rating for this category
                    const avgRating = toolsInCategory.length > 0 
                      ? toolsInCategory.reduce((sum, tool) => sum + tool.rating, 0) / toolsInCategory.length 
                      : 0;
                    const badge = getCategoryBadge(category.name);
                    return (
                      <Link
                        key={category.name}
                        href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="group relative block"
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        {/* Favorite button - responsive sizing */}
                        <button
                          type="button"
                          aria-label={isFavorited ? 'Unfavorite category' : 'Favorite category'}
                          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                          className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors ${isFavorited ? 'text-pink-600' : 'text-gray-400'}`}
                          onClick={e => { e.preventDefault(); toggleFavorite(category.name); }}
                        >
                          <HeartIcon filled={isFavorited} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                        </button>
                        {/* Badge - responsive sizing */}
                        {badge && (
                          <span className={`absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${
                            badge === 'Recently Viewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {badge}
                          </span>
                        )}
                        <div className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-3 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50 dark:group-hover:from-gray-800 dark:group-hover:to-blue-900/20 h-full flex flex-col min-h-[420px] sm:min-h-[450px] lg:min-h-[480px]`}>
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-pink-400 to-blue-400 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12 blur-2xl"></div>
                          </div>

                          {/* Enhanced Icon Container */}
                          <div className="relative mb-4 sm:mb-6 lg:mb-8 flex-shrink-0">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-2xl relative z-10`}>
                              {category.icon}
                              {/* Glow effect */}
                              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500`}></div>
                            </div>
                            {/* Floating particles effect - hidden on small screens */}
                            <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            </div>
                            <div className="hidden sm:block absolute top-4 left-1/3 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <div className="hidden sm:block absolute top-2 right-1/3 transform translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                              <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>

                          {/* Enhanced Title */}
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 text-gray-900 dark:text-white text-center group-hover:scale-105 leading-tight flex-shrink-0">
                            {category.name}
                          </h3>
                          
                          {/* Enhanced Description - Fixed height container */}
                          <div className="flex-shrink-0 mb-4 sm:mb-6 lg:mb-8">
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 text-center leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 px-2 sm:px-0 h-16 sm:h-20 lg:h-24 flex items-center justify-center">
                              {category.description}
                            </p>
                          </div>

                          {/* Enhanced Stats with Icons - Fixed height */}
                          <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 flex-shrink-0">
                            <div className="text-center group/stat">
                              <div className="flex items-center justify-center mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-1 group-hover/stat:scale-110 transition-transform duration-300">
                                  <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold">🔧</span>
                                </div>
                              </div>
                              <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" title="Number of tools in this category">
                                {toolCount}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Tools</div>
                            </div>
                            
                            <div className="w-px h-8 sm:h-10 lg:h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                            
                            <div className="text-center group/stat">
                              <div className="flex items-center justify-center mb-1 sm:mb-2">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-1 group-hover/stat:scale-110 transition-transform duration-300">
                                  <span className="text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm font-bold">⭐</span>
                                </div>
                              </div>
                              <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300" title="Average user rating for this category">
                                {avgRating.toFixed(1)}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">Rating</div>
                            </div>
                          </div>

                          {/* Enhanced Popular Tools Preview - Fixed height container */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="mb-4 sm:mb-6 lg:mb-8">
                              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3 lg:mb-4">
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Popular Tools
                                </p>
                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center min-h-[60px] sm:min-h-[70px] items-start">
                                {popularTools.length === 0 ? (
                                  <div className="relative">
                                    <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600">
                                      <span className="animate-pulse">Coming soon</span>
                                    </span>
                                  </div>
                                ) : (
                                  popularTools.map((tool, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-200 font-medium border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform duration-200 shadow-sm"
                                      style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                      <span className="truncate max-w-[80px] sm:max-w-none">{tool}</span>
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            {/* Enhanced CTA Button - Positioned at bottom */}
                            <div className="relative mt-auto">
                              <div className="flex items-center justify-center gap-2 sm:gap-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-300 group-hover:translate-y-1">
                                <span>Explore</span>
                                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                              {/* Button shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white text-center">AI Tool Categories: Guide & FAQ</h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 text-center px-4 sm:px-0">
            Not sure where to start? Here's a quick guide to help you find the perfect AI tool category for your needs, plus answers to common questions.
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
                Categories are curated based on industry trends, user demand, and the unique features of each tool. We regularly review and update categories to reflect the evolving AI landscape.
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