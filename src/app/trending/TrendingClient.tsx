"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getToolsFromDB } from "@/data";
import type { Tool } from "@/data/tools";
import { 
  getTrendingTools, 
  getTrendingCategories, 
  getTrendingInsights, 
  getTrendingBadge,
  getTimeBasedTrending,
  type TrendingCategory 
} from "@/lib/trending";

// Simple SVG icons as fallback
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const TrendingDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

export default function TrendingClient() {
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("week");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<TrendingCategory[]>([]);
  const [trendingInsights, setTrendingInsights] = useState<any>(null);

  // Load tools from database
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const toolsData = await getToolsFromDB();
        setTools(toolsData);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  // Calculate trending data based on time filter
  useEffect(() => {
    if (tools.length === 0) return;

    // Get trending tools based on time filter
    const trendingToolsData = getTimeBasedTrending(tools, timeFilter);
    setTrendingTools(trendingToolsData);

    // Get trending categories
    const trendingCategoriesData = getTrendingCategories(tools);
    setTrendingCategories(trendingCategoriesData);

    // Get trending insights
    const insights = getTrendingInsights(tools);
    setTrendingInsights(insights);
  }, [tools, timeFilter]);

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

  const renderGrowthIcon = (growth: string) => {
    const growthRate = parseFloat(growth.replace('%', ''));
    if (growthRate > 0) {
      return <TrendingUpIcon className="w-4 h-4 text-green-600" />;
    } else if (growthRate < 0) {
      return <TrendingDownIcon className="w-4 h-4 text-red-600" />;
    }
    return <TrendingUpIcon className="w-4 h-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading trending tools...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              VaultX AI Tools
            </h1>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
              <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Categories
              </Link>
              <Link href="/trending" className="text-blue-600 dark:text-blue-400 font-medium">
                Trending
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🔥 Trending AI Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Discover the fastest-growing AI tools based on user interactions, ratings, and popularity
              </p>
            </div>
            
            {/* Time Filter */}
            <div className="mt-4 sm:mt-0">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { key: "day", label: "Today" },
                  { key: "week", label: "This Week" },
                  { key: "month", label: "This Month" }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setTimeFilter(filter.key as "day" | "week" | "month")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeFilter === filter.key
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Trending Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.growth}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.toolCount} tools
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((category.totalScore / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tools */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Trending Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool, index) => {
              const badge = getTrendingBadge(index);
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow relative group"
                >
                  {/* Trending Badge */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.text}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{tool.logo}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tool.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(tool.rating)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                          {tool.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {renderGrowthIcon(tool.growth)}
                        <span className="text-sm font-medium">{tool.growth}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <EyeIcon className="w-4 h-4" />
                        <span className="text-sm">{tool.weeklyUsers.toLocaleString()}</span>
                      </div>
                      <Link
                        href={`/tool/${tool.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        {trendingInsights && (
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Trending Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <FireIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Most Popular
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {trendingInsights.mostPopular?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {trendingInsights.mostPopular?.weeklyUsers.toLocaleString()} users
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <RocketIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Fastest Growing
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {trendingInsights.fastestGrowing?.name || 'N/A'}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {trendingInsights.fastestGrowing?.growth}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                  <StarIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Highest Rated
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {trendingInsights.highestRated?.name || 'N/A'}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  ⭐ {trendingInsights.highestRated?.rating}/5
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Most Reviewed
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {trendingInsights.mostReviewed?.name || 'N/A'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {trendingInsights.mostReviewed?.reviewCount} reviews
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 