'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Lightbulb, Search, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface SearchInsight {
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  category?: string;
  relatedTools?: string[];
}

interface TrendingSearch {
  query: string;
  searchCount: number;
  growth: number;
  category: string;
}

export default function SearchInsights() {
  const [insights, setInsights] = useState<SearchInsight[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'trending' | 'suggestions'>('insights');

  useEffect(() => {
    const loadInsights = () => {
      const analyticsData = analytics.getAnalyticsData();
      
      if (analyticsData) {
        // Generate insights from analytics data
        const generatedInsights = generateInsights(analyticsData);
        setInsights(generatedInsights);

        // Generate trending searches
        const trending = generateTrendingSearches(analyticsData);
        setTrendingSearches(trending);
      }
      
      setIsLoading(false);
    };

    loadInsights();
    const interval = setInterval(loadInsights, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const generateInsights = (data: any): SearchInsight[] => {
    const insights: SearchInsight[] = [];

    // Most popular search
    if (data.popularQueries.length > 0) {
      insights.push({
        query: data.popularQueries[0].query,
        count: data.popularQueries[0].count,
        trend: 'up',
        category: 'Most Popular',
        relatedTools: ['AI Writing', 'ChatGPT', 'Copy.ai']
      });
    }

    // Filter usage insights
    if (data.popularFilters.length > 0) {
      const topFilter = data.popularFilters[0];
      insights.push({
        query: `${topFilter.filter} filter`,
        count: topFilter.count,
        trend: 'up',
        category: 'Most Used Filter',
        relatedTools: ['All Tools']
      });
    }

    // Results insights
    if (data.averageResults > 0) {
      const avgResults = Math.round(data.averageResults);
      insights.push({
        query: `${avgResults} average results`,
        count: data.totalSearches,
        trend: avgResults > 10 ? 'up' : avgResults < 5 ? 'down' : 'stable',
        category: 'Search Performance',
        relatedTools: ['Search Quality']
      });
    }

    return insights;
  };

  const generateTrendingSearches = (data: any): TrendingSearch[] => {
    const trending: TrendingSearch[] = [];

    // Generate mock trending data based on popular queries
    data.popularQueries.slice(0, 5).forEach((query: any, index: number) => {
      trending.push({
        query: query.query,
        searchCount: query.count,
        growth: Math.floor(Math.random() * 50) + 10, // Mock growth percentage
        category: getCategoryFromQuery(query.query)
      });
    });

    return trending.sort((a, b) => b.growth - a.growth);
  };

  const getCategoryFromQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('writing') || lowerQuery.includes('text') || lowerQuery.includes('copy')) {
      return 'Content Creation';
    } else if (lowerQuery.includes('image') || lowerQuery.includes('art') || lowerQuery.includes('design')) {
      return 'Design & Art';
    } else if (lowerQuery.includes('code') || lowerQuery.includes('programming') || lowerQuery.includes('development')) {
      return 'Development';
    } else if (lowerQuery.includes('video') || lowerQuery.includes('audio') || lowerQuery.includes('media')) {
      return 'Multimedia';
    } else if (lowerQuery.includes('free') || lowerQuery.includes('pricing')) {
      return 'Pricing';
    } else {
      return 'General';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Search Insights
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discover trends and get smart suggestions
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'insights', label: 'Insights', icon: Lightbulb },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'suggestions', label: 'Suggestions', icon: Search }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {insight.category}
                        </span>
                        {getTrendIcon(insight.trend)}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {insight.query}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{insight.count} searches</span>
                        {insight.relatedTools && (
                          <span>Related: {insight.relatedTools.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No insights available yet. Start searching to generate insights.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-4">
            {trendingSearches.length > 0 ? (
              trendingSearches.map((trend, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {trend.query}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {trend.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {trend.searchCount} searches
                        </span>
                        <span className={`font-medium ${trend.growth > 20 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          +{trend.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No trending searches yet. Start searching to see trends.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Smart Search Tips
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use specific terms like "AI writing tools for marketing"</li>
                <li>• Try different categories to discover new tools</li>
                <li>• Use filters to narrow down results</li>
                <li>• Check alternatives for comparison</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                🔍 Popular Search Patterns
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800 dark:text-green-200">
                <div>• Free AI tools</div>
                <div>• Writing assistants</div>
                <div>• Image generators</div>
                <div>• Code helpers</div>
                <div>• Video editors</div>
                <div>• Design tools</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                ⚡ Quick Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Free tools', 'AI writing', 'Image generation', 'Code assistance', 'Video editing', 'Design AI'].map((action, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm rounded-full hover:bg-purple-200 dark:hover:bg-purple-700 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
