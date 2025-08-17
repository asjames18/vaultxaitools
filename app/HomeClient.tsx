'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import SponsoredContent from '@/components/SponsoredContent';
import EmailSignupForm from '@/components/EmailSignupForm';
import DailyTool from '@/components/DailyTool';
import CommunityHighlights from '@/components/CommunityHighlights';
import QuickActions from '@/components/QuickActions';
import EnhancedNewsletter from '@/components/EnhancedNewsletter';
import TrustBadges from '@/components/TrustBadges';
import type { Tool, Category } from '@/data/tools';
import StructuredData from '@/components/StructuredData';
// Enhanced SVG icons with better styling
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);



const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CompareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface HomeClientProps {
  allTools: Tool[];
  popularTools: Tool[];
  trendingTools: Tool[];
  sponsoredTools: Tool[];
  error?: string | null;
  categories: Category[];
}

// Dynamic headlines that emphasize curation and quality
const dynamicHeadlines = [
  "Only the best AI tools make our curated list.",
  "We test hundreds of tools so you don't have to.",
  "Quality over quantity - every tool is expert-verified.",
  "Your trusted source for hand-picked AI solutions.",
  "From 100+ tested tools, we select only the elite."
];

// Testimonials emphasizing curation quality
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    content: "VaultX's curated approach saved us weeks of tool testing. Every AI solution we've tried has been exceptional!",
    avatar: "👩‍💼"
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    company: "Independent",
    content: "I love that VaultX only shows the best tools. No more wasting time on mediocre AI solutions.",
    avatar: "👨‍💻"
  },
  {
    name: "Dr. Emily Watson",
    role: "Research Director",
    company: "Innovation Labs",
    content: "The curation quality is outstanding. We trust VaultX to find us the most effective AI tools for research.",
    avatar: "👩‍🔬"
  }
];

export default function HomeClient({ 
  allTools, 
  popularTools, 
  trendingTools, 
  sponsoredTools, 
  error,
  categories 
}: HomeClientProps) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(popularTools);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [automationStatus, setAutomationStatus] = useState<any>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [lastDataUpdate, setLastDataUpdate] = useState<Date>(new Date());
  
  const supabase = createClient();

  // Calculate real stats from tools data
  const totalReviews = allTools.reduce((sum, tool) => sum + (tool.reviewCount || 0), 0);

  // Animation and interaction effects
  useEffect(() => {
    setIsVisible(true);
    
    // Rotate headlines every 4 seconds
    const headlineInterval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % dynamicHeadlines.length);
    }, 4000);

    // Load user preferences from localStorage
    const savedFavorites = localStorage.getItem('vaultx-favorites');
    const savedRecent = localStorage.getItem('vaultx-recent');
    
    if (savedFavorites) {
      setFavoriteTools(JSON.parse(savedFavorites));
    }
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent));
    }

    // Load favorites from API
    const loadFavoritesFromAPI = async () => {
      try {
        // Get the current session token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.log('No session token available for loading favorites');
          return;
        }
        
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFavoriteTools(data.favorites || []);
          // Update localStorage to match API
          localStorage.setItem('vaultx-favorites', JSON.stringify(data.favorites || []));
        } else {
          console.error('Failed to load favorites from API:', response.status);
        }
      } catch (error) {
        console.error('Error loading favorites from API:', error);
      }
    };

    // Load favorites from API on mount
    loadFavoritesFromAPI();

    // Subscribe to automation updates for real-time sync
    const automationChannel = supabase
      .channel('automation-updates')
      .on('broadcast', { event: 'automation-completed' }, (payload: any) => {
        console.log('🔄 Automation completed - refreshing homepage data', payload);
        setLastDataUpdate(new Date());
        setShowUpdateBanner(true);
        
        // Auto-hide banner after 10 seconds
        setTimeout(() => setShowUpdateBanner(false), 10000);
        
        // Optionally refresh the page to get new data
        setTimeout(() => window.location.reload(), 2000);
      })
      .subscribe();

    // Fetch automation status
    const fetchAutomationStatus = async () => {
      try {
        const response = await fetch('/api/admin/automation');
        if (response.ok) {
          const data = await response.json();
          setAutomationStatus(data);
        }
      } catch (error) {
        console.error('Error fetching automation status:', error);
      }
    };
    
    fetchAutomationStatus();

    return () => {
      clearInterval(headlineInterval);
      automationChannel.unsubscribe();
    };
  }, []);

  // Expose curated tool count for downstream components (newsletter stats)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__vaultxToolCount = allTools.length;
    }
  }, [allTools.length]);

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

  // Toggle favorite
  const toggleFavorite = async (toolId: string) => {
    const isCurrentlyFavorite = favoriteTools.includes(toolId);
    const action = isCurrentlyFavorite ? 'remove' : 'add';
    
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session token available');
        return;
      }
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ toolId, action })
      });
      
      if (response.ok) {
        // Update local state only after successful API call
        setFavoriteTools(prev =>
          isCurrentlyFavorite
            ? prev.filter(id => id !== toolId)
            : [...prev, toolId]
        );
        // Update localStorage
        const newFavorites = isCurrentlyFavorite
          ? favoriteTools.filter(id => id !== toolId)
          : [...favoriteTools, toolId];
        localStorage.setItem('vaultx-favorites', JSON.stringify(newFavorites));
      } else {
        console.error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const addToRecentlyViewed = (toolId: string) => {
    const newRecent = [toolId, ...recentlyViewed.filter(id => id !== toolId)].slice(0, 5);
    setRecentlyViewed(newRecent);
    localStorage.setItem('vaultx-recent', JSON.stringify(newRecent));
  };



  const getRecentlyViewedTools = () => {
    return allTools.filter(tool => recentlyViewed.includes(tool.id)).slice(0, 3);
  };

  const getFavoriteTools = () => {
    return allTools.filter(tool => favoriteTools.includes(tool.id)).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* SEO Structured Data */}
      <StructuredData 
        type="website" 
        data={{
          name: 'VaultX AI Tools',
          description: 'Expert-curated AI tools directory',
          url: 'https://vaultxaitools.com'
        }} 
      />
      
      {/* Automation Update Banner */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">🚀 New AI tools discovered! Data updated with latest tools.</span>
            <button
              onClick={() => setShowUpdateBanner(false)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} - Showing sample data
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced badge */}
            <div className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-700 rounded-full px-6 py-3 mb-8 shadow-lg transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <SparklesIcon className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Curated AI Tools Directory</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            
            {/* Dynamic headline */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {dynamicHeadlines[currentHeadlineIndex]}
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              We curate only the most effective AI tools through rigorous testing and expert evaluation. No hype, just proven results.
            </p>

            {/* Enhanced value proposition with animations */}
            <div className={`mb-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50">
                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Expert-tested & verified</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50">
                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Quality over quantity</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 bg-gray-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 shadow-lg border border-gray-700/50 sm:col-span-2 lg:col-span-1">
                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Rigorous curation process</span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA with hover effects */}
            <div className={`max-w-2xl mx-auto mb-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/AITools"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 text-sm sm:text-base"
                >
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-spin" />
                  Show Me the Tools
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/AITools"
                  className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border border-gray-200 text-sm sm:text-base"
                >
                  <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 group-hover:animate-pulse" />
                  Browse AI Tools
                </Link>
              </div>
            </div>

            {/* Curated stats (remove potentially unreliable external metrics) */}
            {allTools && allTools.length > 0 && (
              <div className={`grid grid-cols-2 gap-6 sm:gap-8 max-w-2xl sm:max-w-3xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">{allTools.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Curated Tools</div>
                  <div className="text-xs text-green-600 mt-1">Expert Selected</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">{categories.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Categories</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <QuickActions />

      {/* Daily Tool Section - New! */}
      {allTools && allTools.length > 0 ? (
        <DailyTool tools={allTools} />
      ) : (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Daily Tool Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tools data available to display the daily featured tool.
            </p>
          </div>
        </section>
      )}

      {/* Community Highlights Section - New! */}
      {allTools && allTools.length > 0 ? (
        <CommunityHighlights />
      ) : (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Community Highlights Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No tools data available to display community highlights.
            </p>
          </div>
        </section>
      )}

      {/* Personalization Section - New! */}
      {(favoriteTools.length > 0 || recentlyViewed.length > 0) && allTools && allTools.length > 0 && (
        <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Your Personal AI Toolkit
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tools you've loved and recently explored
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Favorite Tools */}
              {favoriteTools.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <HeartIcon className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Favorites</h3>
                  </div>
                  <div className="space-y-4">
                    {getFavoriteTools().map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{tool.logo || tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-200">{tool.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(tool.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <HeartIcon className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed */}
              {recentlyViewed.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <ClockIcon className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Viewed</h3>
                  </div>
                  <div className="space-y-4">
                    {getRecentlyViewedTools().map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <span className="text-lg">{tool.logo || tool.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{tool.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-200">{tool.category}</p>
                          </div>
                        </div>
                        <Link
                          href={`/tool/${tool.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Curation Process Section - New! */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Rigorous Curation Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              We don't just list tools - we thoroughly test and evaluate each one to ensure only the best make it to our curated directory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tool Discovery</h3>
              <p className="text-gray-600 dark:text-gray-200">
                We monitor the AI landscape to identify promising new tools and updates to existing ones
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Expert Testing</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Our team of AI specialists thoroughly tests each tool for functionality, reliability, and value
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Quality Assessment</h3>
              <p className="text-gray-600 dark:text-gray-200">
                We evaluate performance, user experience, pricing, and real-world effectiveness
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-2xl text-white font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Final Selection</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Only tools that meet our strict quality standards are added to the curated directory
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full px-6 py-3">
              <ShieldIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                Quality Guarantee: Every tool is tested and verified by our experts
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New! */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Trusted by AI Professionals Worldwide
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              See what our community says about our curated AI tool selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >

                <p className="text-gray-600 dark:text-gray-200 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-200">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How to Use Our Curated Directory
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-200 max-w-2xl mx-auto">
              Access the best AI tools in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <SearchIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Search & Discover</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Browse our curated collection of AI tools or use our powerful search to find exactly what you need.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CompareIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Compare & Evaluate</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Read detailed reviews, compare features, and see real user ratings to make informed decisions.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <RocketIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Start Building</h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get started with your chosen AI tool and join thousands of users building the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Tools Section */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured AI Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most popular and trending AI tools in our collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredTools.slice(0, 6).map((tool) => (
              <div
                key={tool.id}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300">
                          {tool.logo || tool.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">{tool.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(tool.id)}
                      className={`transition-colors ${favoriteTools.includes(tool.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <HeartIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${favoriteTools.includes(tool.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/tool/${tool.id}`}
                      onClick={() => addToRecentlyViewed(tool.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
                              href="/AITools"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Tools
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* Category Showcase Section removed per request */}

      {/* Trust & Evaluation Framework Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <EnhancedNewsletter />
    </div>
  );
} 