'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useFavorites } from '@/lib/useFavorites';
import { useRealTimeTools } from '@/lib/useRealTimeTools';
import { useToolsUpdates } from '@/lib/useDataUpdates';
import { useOptimizedSubscriptions } from '@/lib/useOptimizedSubscriptions';
import SponsoredContent from '@/components/SponsoredContent';
import EmailSignupForm from '@/components/EmailSignupForm';
import DailyTool from '@/components/DailyTool';
import CommunityHighlights from '@/components/CommunityHighlights';
import QuickActions from '@/components/QuickActions';
import EnhancedNewsletter from '@/components/EnhancedNewsletter';
import TrustBadges from '@/components/TrustBadges';
import SearchAndFilter from '@/components/SearchAndFilter';
import EnhancedSearch from '@/components/EnhancedSearch';
import FeaturedToolsSection from '@/components/FeaturedToolsSection';
import HomeHeroSection from '@/components/HomeHeroSection';
import type { Tool, Category } from '@/data/tools';
import StructuredData from '@/components/StructuredData';
import HeroSection from '@/components/HeroSection';
import NotificationBanners from '@/components/NotificationBanners';
import ValueProposition from '@/components/ValueProposition';
import StatsSection from '@/components/StatsSection';
import ContentSections from '@/components/ContentSections';
import { FullPageLoadingSkeleton, ErrorState } from '@/components/LoadingStates';
import {
  CheckIcon,
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldIcon,
  SearchIcon,
  CompareIcon,
  RocketIcon
} from '@/components/icons';

interface HomeClientProps {
  allTools: Tool[];
  popularTools: Tool[];
  trendingTools: Tool[];
  sponsoredTools: Tool[];
  error?: string | null;
  categories: Category[];
}

// Dynamic headlines that emphasize ministry media focus
const dynamicHeadlines = [
  "Empowering churches and ministries with professional media tools.",
  "Expert guidance for your church's media production needs.",
  "Quality resources and tools for effective ministry communication.",
  "Your trusted partner for church and ministry media excellence.",
  "From video editing to live streaming - we've got you covered."
];

// Testimonials emphasizing ministry media quality
const testimonials = [
  {
    name: "Pastor Michael Johnson",
    role: "Senior Pastor",
    company: "Grace Community Church",
    content: "VaultX Tech transformed our church's media production. The tools and guidance have been invaluable for our ministry!",
    avatar: "👨‍💼"
  },
  {
    name: "Sarah Martinez",
    role: "Media Director",
    company: "Hope Church",
    content: "I love the curated media tools and resources. VaultX Tech has saved us so much time finding the right solutions.",
    avatar: "👩‍💻"
  },
  {
    name: "David Thompson",
    role: "Worship Leader",
    company: "Faith Fellowship",
    content: "The quality of resources is outstanding. We trust VaultX Tech to help us produce excellent media for our ministry.",
    avatar: "👨‍🎤"
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
  // Use real-time tools data instead of static props
  const { tools: realTimeTools, loading: toolsLoading, error: toolsError } = useRealTimeTools();
  
  // Listen for admin updates and refresh data
  useToolsUpdates(() => {
    // The useRealTimeTools hook will automatically refresh when Supabase data changes
  }, []);
  
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { favorites: favoriteTools, toggleFavorite, loading: favoritesLoading, refresh: refreshFavorites } = useFavorites();
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const { showUpdateBanner, lastDataUpdate, automationStatus, hideUpdateBanner } = useOptimizedSubscriptions();
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [componentError, setComponentError] = useState<string | null>(null);
  
  // Use real-time data when available, fallback to props
  const safeAllTools = useMemo(() => realTimeTools.length > 0 ? realTimeTools : (allTools || []), [realTimeTools, allTools]);
  const safePopularTools = useMemo(() => {
    if (realTimeTools.length > 0) {
      return realTimeTools
        .filter(tool => tool.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    }
    return popularTools || [];
  }, [realTimeTools, popularTools]);
  const safeTrendingTools = useMemo(() => {
    if (realTimeTools.length > 0) {
      return realTimeTools
        .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 6);
    }
    return trendingTools || [];
  }, [realTimeTools, trendingTools]);
  const safeSponsoredTools = useMemo(() => sponsoredTools || [], [sponsoredTools]);
  const safeCategories = useMemo(() => categories || [], [categories]);
  
  const supabase = createClient();

  // Error boundary for the component
  useEffect(() => {
    try {
      // Validate that required data is available
      if (!Array.isArray(safeAllTools)) {
        setComponentError('Invalid tools data received');
        return;
      }
      
      if (!Array.isArray(safeCategories)) {
        setComponentError('Invalid categories data received');
        return;
      }
      
      // Initialize filtered tools safely
      if (safePopularTools.length > 0) {
        setFilteredTools(safePopularTools);
      }
      
    } catch (err) {
      setComponentError('Failed to initialize component');
    }
  }, [safeAllTools, safePopularTools, safeCategories]);

  // Update when real-time data changes (optimized)
  useEffect(() => {
    // Real-time tools data updated
  }, [realTimeTools]);

  // Show toast message with useCallback for performance
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    try {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      // Silently handle toast errors
    }
  }, []);

  // Check authentication status with useCallback for performance
  const checkAuthStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (session?.access_token && user) {
        setAuthStatus(`✅ ${user.email}`);
      } else {
        setAuthStatus('❌ Not authenticated');
      }
    } catch (error) {
      setAuthStatus('❌ Auth error');
    }
  }, [supabase.auth]);

    // Load favorites from API
    const loadFavoritesFromAPI = async () => {
  
    
    
      try {
        const { data: { session } } = await supabase.auth.getSession();
      
      
        if (!session?.access_token) {
        // Clear favorites from localStorage since we can't load from API
        localStorage.removeItem('vaultx-favorites');
          return;
        }
        
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
      
        if (response.ok) {
          const data = await response.json();
          
        const newFavorites = data.favorites || [];
        
          // Update localStorage to match API
        localStorage.setItem('vaultx-favorites', JSON.stringify(newFavorites));
        
        // Refresh favorites from the hook
        refreshFavorites();
        } else {
        
        if (response.status === 401) {
          // User not authenticated, clear favorites
          localStorage.removeItem('vaultx-favorites');
        }
        }
      } catch (error) {
      // Keep existing favorites from localStorage on error
    }
  };

  // Calculate real stats from tools data
  const totalReviews = safeAllTools.reduce((sum, tool) => sum + (tool.reviewCount || 0), 0);

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
    
    if (savedRecent) {
      setRecentlyViewed(JSON.parse(savedRecent));
    }

    // Load favorites from API on mount
    loadFavoritesFromAPI();

    // Check authentication status
    checkAuthStatus();

    return () => {
      clearInterval(headlineInterval);
    };
  }, []);

  // Expose curated tool count for downstream components (newsletter stats)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__vaultxToolCount = safeAllTools.length;
    }
  }, [safeAllTools.length]);

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

  // Toggle favorite using the unified hook
  const handleToggleFavorite = async (toolId: string) => {

    
    // Prevent multiple clicks
    if (favoriteLoading === toolId) {
      return;
    }
    
    setFavoriteLoading(toolId);
    
    // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
    
    
      if (!session?.access_token) {
      setFavoriteLoading(null);
      // Redirect to sign in page
      window.location.href = '/sign-in';
        return;
      }
      
    const isCurrentlyFavorite = favoriteTools.includes(toolId);
    const action = isCurrentlyFavorite ? 'remove' : 'add';
    
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ toolId, action })
      });
      
      
      if (response.ok) {
        const responseData = await response.json();
        
        // Update localStorage
        const newFavorites = isCurrentlyFavorite
          ? favoriteTools.filter(id => id !== toolId)
          : [...favoriteTools, toolId];
        localStorage.setItem('vaultx-favorites', JSON.stringify(newFavorites));
        
        // Refresh favorites from the hook to update the UI
        refreshFavorites();
        
        showToast(`Tool ${isCurrentlyFavorite ? 'removed from' : 'added to'} favorites!`);
      } else {
        const errorData = await response.json();
        
        // Show user-friendly error message
        if (response.status === 401) {
          showToast('Please sign in to save favorites', 'error');
          setTimeout(() => {
            window.location.href = '/sign-in';
          }, 2000);
        } else {
          showToast(`Failed to ${action} favorite: ${errorData.error || 'Unknown error'}`, 'error');
        }
      }
    } catch (error) {
      showToast(`Failed to ${action} favorite. Please try again.`, 'error');
    } finally {
      setFavoriteLoading(null);
    }
  };

  const addToRecentlyViewed = (toolId: string) => {
    const newRecent = [toolId, ...recentlyViewed.filter(id => id !== toolId)].slice(0, 5);
    setRecentlyViewed(newRecent);
    localStorage.setItem('vaultx-recent', JSON.stringify(newRecent));
  };



  const getRecentlyViewedTools = () => {
    return safeAllTools.filter(tool => recentlyViewed.includes(tool.id)).slice(0, 3);
  };

  const getFavoriteTools = () => {
    return safeAllTools.filter(tool => favoriteTools.includes(tool.id)).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* SEO Structured Data */}
      <StructuredData 
        type="website" 
        data={{
          name: 'VaultX Tech',
          description: 'VaultX Tech - Ministry Media tech and consulting. Providing tools, resources, and expert guidance for effective ministry media production.',
          url: 'https://vaultxaitools.com'
        }} 
      />
      
      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      
      {/* Component Error Display */}
      {componentError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Component Error
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {componentError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Update Banner */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">🚀 New AI tools discovered! Data updated with latest tools.</span>
            <button
              onClick={hideUpdateBanner}
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
      <HomeHeroSection
        currentHeadlineIndex={currentHeadlineIndex}
        dynamicHeadlines={dynamicHeadlines}
        isVisible={isVisible}
        totalTools={safeAllTools.length}
        testimonials={testimonials}
      />

      {/* Quick Actions Section */}
      <QuickActions />

      <ContentSections 
        safeAllTools={safeAllTools}
        safeCategories={safeCategories}
      />

      {/* Personalization Section - Hidden for now */}
      {/* 
      This section has been temporarily hidden. To re-enable:
      1. Remove the comment block below
      2. Uncomment the section above
      */}

      {/* Sign In Prompt for Unauthenticated Users */}
      {favoriteTools.length === 0 && recentlyViewed.length === 0 && (
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <HeartIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Start Building Your AI Toolkit
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Sign in to save your favorite AI tools, track what you've explored, and get personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <HeartIcon className="w-5 h-5" />
                  Sign In to Save Favorites
                </Link>
                <Link
                  href="/AITools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
                >
                  Browse AI Tools
                </Link>
              </div>
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

      {/* Enhanced Search & Filter Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Find Your Perfect AI Tool
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Use our advanced search and filters to discover AI tools that match your needs
            </p>
          </div>
          
          <EnhancedSearch
            tools={safeAllTools}
            categories={safeCategories}
            onResultsChange={setFilteredTools}
            className="mb-8"
          />
        </div>
      </section>

      {/* Enhanced Featured Tools Section */}
      <FeaturedToolsSection
        tools={filteredTools}
        favoriteTools={favoriteTools}
        favoriteLoading={favoriteLoading}
        toggleFavorite={toggleFavorite}
        addToRecentlyViewed={addToRecentlyViewed}
      />

      {/* Category Showcase Section removed per request */}

      {/* Trust & Evaluation Framework Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <EnhancedNewsletter 
        toolsCount={safeAllTools.length}
        categoriesCount={safeCategories.length}
        subscriberCount={10000} // This could be fetched from analytics or user database
      />
    </div>
  );
} 