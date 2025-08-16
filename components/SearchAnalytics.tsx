'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Search, Clock, Users, Target, Activity, Zap, Eye, MousePointer } from 'lucide-react';

interface SearchQuery {
  query: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  resultCount: number;
  filters: string[];
  timeSpent: number;
  clickedResults: string[];
  searchType: 'basic' | 'advanced' | 'filtered';
}

interface SearchAnalyticsProps {
  className?: string;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  showCharts?: boolean;
}

export default function SearchAnalytics({
  className = '',
  timeRange = 'week',
  showCharts = true
}: SearchAnalyticsProps) {
  const [searchData, setSearchData] = useState<SearchQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock search data for demonstration
  useEffect(() => {
    const generateMockData = () => {
      const mockQueries = [
        'AI image generation',
        'ChatGPT alternatives',
        'Code completion tools',
        'Video editing AI',
        'Writing assistants',
        'Design automation',
        'Data analysis tools',
        'Language learning AI',
        'AI chatbots',
        'Machine learning platforms',
        'Natural language processing',
        'Computer vision tools',
        'AI for business',
        'Creative AI tools',
        'AI productivity apps'
      ];

      const mockData: SearchQuery[] = [];
      const now = new Date();
      
      for (let i = 0; i < 100; i++) {
        const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        const query = mockQueries[Math.floor(Math.random() * mockQueries.length)];
        const resultCount = Math.floor(Math.random() * 50) + 10;
        const timeSpent = Math.floor(Math.random() * 300) + 30;
        const clickedResults = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => `result-${i}`);
        
        mockData.push({
          query,
          timestamp: timestamp.toISOString(),
          sessionId: `session-${Math.floor(Math.random() * 1000)}`,
          resultCount,
          filters: Math.random() > 0.7 ? ['category', 'rating', 'price'] : [],
          timeSpent,
          clickedResults,
          searchType: Math.random() > 0.8 ? 'advanced' : Math.random() > 0.6 ? 'filtered' : 'basic'
        });
      }

      setSearchData(mockData);
      setIsLoading(false);
    };

    // Simulate loading
    setTimeout(generateMockData, 1000);
  }, []);

  // Filter data by time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };

    return searchData.filter(query => {
      const queryTime = new Date(query.timestamp).getTime();
      return now.getTime() - queryTime <= timeRanges[selectedTimeRange];
    });
  }, [searchData, selectedTimeRange]);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    if (filteredData.length === 0) return null;

    // Total searches
    const totalSearches = filteredData.length;

    // Unique users (sessions)
    const uniqueSessions = new Set(filteredData.map(q => q.sessionId)).size;

    // Average results per search
    const avgResults = filteredData.reduce((sum, q) => sum + q.resultCount, 0) / totalSearches;

    // Average time spent
    const avgTimeSpent = filteredData.reduce((sum, q) => sum + q.timeSpent, 0) / totalSearches;

    // Search type distribution
    const searchTypes = filteredData.reduce((acc, q) => {
      acc[q.searchType] = (acc[q.searchType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most popular queries
    const queryFrequency = filteredData.reduce((acc, q) => {
      acc[q.query] = (acc[q.query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topQueries = Object.entries(queryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    // Filter usage
    const filterUsage = filteredData.reduce((acc, q) => {
      q.filters.forEach(filter => {
        acc[filter] = (acc[filter] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Click-through rate
    const totalClicks = filteredData.reduce((sum, q) => sum + q.clickedResults.length, 0);
    const clickThroughRate = (totalClicks / totalSearches) * 100;

    return {
      totalSearches,
      uniqueSessions,
      avgResults: Math.round(avgResults * 10) / 10,
      avgTimeSpent: Math.round(avgTimeSpent),
      searchTypes,
      topQueries,
      filterUsage,
      clickThroughRate: Math.round(clickThroughRate * 10) / 10
    };
  }, [filteredData]);

  // Get time range label
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'day': return 'Last 24 hours';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'year': return 'Last year';
      default: return 'Last 7 days';
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
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

  if (!analytics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Search Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No search activity found for the selected time range
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTimeRangeLabel(selectedTimeRange)}
              </p>
            </div>
          </div>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="day">Last 24 hours</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.totalSearches.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Searches</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.uniqueSessions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Unique Sessions</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {analytics.avgResults}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Results</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(analytics.avgTimeSpent)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time Spent</div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="p-6 space-y-6">
        {/* Search Type Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Search Type Distribution
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analytics.searchTypes).map(([type, count]) => (
              <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {type} Searches
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {Math.round((count / analytics.totalSearches) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Queries */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Most Popular Queries
          </h4>
          <div className="space-y-2">
            {analytics.topQueries.map((item, index) => (
              <div key={item.query} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.query}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.count} searches
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Usage */}
        {Object.keys(analytics.filterUsage).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Filter Usage
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analytics.filterUsage).map(([filter, count]) => (
                <div key={filter} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {filter}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {count} uses
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / analytics.totalSearches) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Engagement Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {analytics.clickThroughRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Click-through Rate</div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {formatTime(analytics.avgTimeSpent)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Session Time</div>
            </div>
          </div>
        </div>

        {/* Search Trends */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Search Insights
          </h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Most users prefer basic searches ({(analytics.searchTypes.basic / analytics.totalSearches * 100).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Average search returns {analytics.avgResults} results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Users spend {formatTime(analytics.avgTimeSpent)} on average per search</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Click-through rate is {analytics.clickThroughRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
