"use client";

import Link from "next/link";
import { useState } from "react";
import type { Tool } from "@/data/tools";
import { 
  getTrendingBadge,
  type TrendingCategory 
} from "@/lib/trending";
import QuickVoteCard from "@/components/QuickVoteCard";

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

interface TrendingClientProps {
  tools: Tool[];
  trendingTools: Tool[];
  trendingCategories: TrendingCategory[];
  trendingInsights: {
    mostPopular: Tool;
    fastestGrowing: Tool;
    highestRated: Tool;
    mostReviewed: Tool;
  };
  dailyTrending: Tool[];
  weeklyTrending: Tool[];
  monthlyTrending: Tool[];
}

export default function TrendingClient({ 
  tools,
  trendingTools,
  trendingCategories,
  trendingInsights,
  dailyTrending,
  weeklyTrending,
  monthlyTrending
}: TrendingClientProps) {
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("week");

  // Get trending tools based on time filter
  const getCurrentTrendingTools = () => {
    switch (timeFilter) {
      case 'day':
        return dailyTrending;
      case 'month':
        return monthlyTrending;
      default:
        return weeklyTrending;
    }
  };

  const currentTrendingTools = getCurrentTrendingTools();

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

  if (tools.length === 0) {
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Enhanced Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 animate-fade-in shadow-sm">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-slide-up">
            🔥 Trending AI Tools
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Discover the fastest-growing AI tools based on user interactions, ratings, and popularity.
          </p>
          {/* Enhanced Time Filter */}
          <div className="flex justify-center gap-4 animate-fade-in">
            {[{ key: "day", label: "Today" }, { key: "week", label: "This Week" }, { key: "month", label: "This Month" }].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key as "day" | "week" | "month")}
                className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300 ${
                  timeFilter === filter.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Trending Categories */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Trending Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl shadow-md`}>
                    {category.icon}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <TrendingUpIcon className="w-5 h-5" />
                    <span className="text-base">{category.growth}</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2 text-center">{category.name}</h4>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4 text-center">{category.toolCount} tools</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((category.totalScore / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Trending Tools */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Trending Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTrendingTools.map((tool, index) => {
              const badge = getTrendingBadge(index);
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group relative"
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
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
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
                        <TrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium text-green-600">{tool.growth}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.weeklyUsers.toLocaleString()} weekly users
                      </span>
                      <QuickVoteCard
                        toolId={tool.id}
                        currentRating={tool.rating}
                        currentReviewCount={tool.reviewCount}
                        compact={true}
                      />
                    </div>

                    <div className="flex items-center justify-between">
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
      </div>
    </main>
  );
} 