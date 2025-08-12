'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface TrendingNowProps {
  tools: Tool[];
}

export default function TrendingNow({ tools }: TrendingNowProps) {
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Get trending tools (most reviews and highest growth)
    const trending = tools
      .sort((a, b) => {
        const aScore = (a.reviewCount || 0) * 0.7 + (parseFloat(a.growth?.replace('+', '').replace('%', '') || '0') * 0.3);
        const bScore = (b.reviewCount || 0) * 0.7 + (parseFloat(b.growth?.replace('+', '').replace('%', '') || '0') * 0.3);
        return bScore - aScore;
      })
      .slice(0, 6);
    
    setTrendingTools(trending);
    setLastUpdated(new Date());

    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real app, you'd fetch new data here
    }, 30000);

    return () => clearInterval(interval);
  }, [tools]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-full px-4 py-2 mb-6">
            <FireIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 animate-pulse" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
              Live Trending
            </span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Trending Now
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The hottest AI tools that everyone's talking about right now
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>Updated {formatTimeAgo(lastUpdated)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool, index) => (
            <div
              key={tool.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Trending badge */}
              <div className="relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    #{index + 1} Trending
                  </span>
                </div>
                
                {/* Tool visual */}
                <div className="h-32 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 dark:from-orange-900 dark:via-red-900 dark:to-pink-900 flex items-center justify-center">
                  <div className="text-4xl">{tool.logo || tool.name.charAt(0)}</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500">
                    <TrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tool.growth}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-3 h-3" />
                    <span>{tool.weeklyUsers?.toLocaleString()} weekly users</span>
                  </div>
                  <span>⭐ {tool.rating}/5</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tool.pricing}
                  </span>
                  <Link
                    href={`/tool/${tool.id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm group-hover:translate-x-1 transition-transform"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FireIcon className="w-5 h-5" />
            View All Trending Tools
          </Link>
        </div>
      </div>
    </section>
  );
} 