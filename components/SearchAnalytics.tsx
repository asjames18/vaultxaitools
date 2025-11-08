'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Search, Clock, Users, Target, Activity, Zap, Eye, MousePointer } from 'lucide-react';
import { LoadingSkeleton, SearchResultsSkeleton, ProgressBar } from './LoadingStates';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [error, setError] = useState<string | null>(null);

  // Mock search data for demonstration
  useEffect(() => {
    const generateMockData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        setLoadingProgress(0);

        // Simulate progressive loading
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

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
          const searchQuery = mockQueries[Math.floor(Math.random() * mockQueries.length)];
          const resultCount = Math.floor(Math.random() * 50) + 10;
          const timeSpent = Math.floor(Math.random() * 300) + 30;
          const clickedResults = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => `result-${i}`);
          
          mockData.push({
            query: searchQuery,
            timestamp: timestamp.toISOString(),
            sessionId: `session-${Math.floor(Math.random() * 1000)}`,
            resultCount,
            filters: Math.random() > 0.7 ? ['category', 'rating', 'price'] : [],
            timeSpent,
            clickedResults,
            searchType: Math.random() > 0.8 ? 'advanced' : Math.random() > 0.6 ? 'filtered' : 'basic'
          });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSearchData(mockData);
        setLoadingProgress(100);
        
        // Complete loading after progress bar animation
        setTimeout(() => {
          setIsLoading(false);
        }, 300);

      } catch (err) {
        setError('Failed to load search analytics data. Please try again.');
        setIsLoading(false);
        setLoadingProgress(0);
      }
    };

    generateMockData();
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

    return searchData.filter(searchItem => {
      const queryTime = new Date(searchItem.timestamp).getTime();
      return now.getTime() - queryTime <= timeRanges[selectedTimeRange];
    });
  }, [searchData, selectedTimeRange]);

  // Calculate analytics metrics
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const totalSearches = filteredData.length;
    const uniqueUsers = new Set(filteredData.map(item => item.sessionId)).size;
    const avgResults = filteredData.reduce((sum, item) => sum + item.resultCount, 0) / totalSearches;
    const avgTimeSpent = filteredData.reduce((sum, item) => sum + item.timeSpent, 0) / totalSearches;
    const clickThroughRate = filteredData.reduce((sum, item) => sum + item.clickedResults.length, 0) / totalSearches;

    return {
      totalSearches,
      uniqueUsers,
      avgResults: Math.round(avgResults),
      avgTimeSpent: Math.round(avgTimeSpent),
      clickThroughRate: Math.round(clickThroughRate * 100) / 100
    };
  }, [filteredData]);

  // Handle time range change
  const handleTimeRangeChange = (newRange: 'day' | 'week' | 'month' | 'year') => {
    setSelectedTimeRange(newRange);
  };

  // Retry loading data
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setLoadingProgress(0);
    // Trigger the useEffect again
    window.location.reload();
  };

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Unable to Load Analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search Analytics
          </h2>
          <ProgressBar progress={loadingProgress} className="mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Loading search analytics data...
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} variant="card" />
            ))}
          </div>
          
          {/* Chart skeleton */}
          {showCharts && (
            <div className="space-y-4">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="table" lines={5} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Search Analytics
        </h2>
        
        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTimeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Searches</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{metrics.totalSearches}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Unique Users</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{metrics.uniqueUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Results</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{metrics.avgResults}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center">
              <MousePointer className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Click Rate</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{metrics.clickThroughRate}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCharts && filteredData.length > 0 && (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Search Activity</h3>
            <div className="space-y-2">
              {filteredData.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{item.query}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.resultCount} results</span>
                    <span>{Math.round(item.timeSpent / 60)}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Search Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No search analytics data found for the selected time period.
          </p>
        </div>
      )}
    </div>
  );
}
