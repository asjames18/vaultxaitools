'use client';

import { useState, useEffect, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Eye, MousePointer, DollarSign, Activity, Target, Calendar, Filter, Download, RefreshCw } from 'lucide-react';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    new: number;
    returning: number;
    growth: number;
  };
  engagement: {
    pageViews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  content: {
    totalTools: number;
    totalArticles: number;
    totalReviews: number;
    avgRating: number;
    topCategories: Array<{ name: string; count: number; growth: number }>;
  };
  performance: {
    avgLoadTime: number;
    coreWebVitals: {
      fcp: number;
      lcp: number;
      fid: number;
      cls: number;
    };
    seoScore: number;
    accessibilityScore: number;
  };
  business: {
    revenue: number;
    growth: number;
    topRevenueSources: Array<{ source: string; amount: number; percentage: number }>;
    conversionFunnels: Array<{ stage: string; users: number; conversion: number }>;
  };
}

interface AnalyticsDashboardProps {
  className?: string;
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  showCharts?: boolean;
  refreshInterval?: number;
}

export default function AnalyticsDashboard({
  className = '',
  timeRange = 'month',
  showCharts = true,
  refreshInterval = 300000 // 5 minutes
}: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock analytics data generation
  useEffect(() => {
    const generateMockData = (): AnalyticsData => {
      const baseMultiplier = {
        day: 1,
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      }[selectedTimeRange];

      return {
        users: {
          total: Math.floor(15000 * baseMultiplier),
          active: Math.floor(8000 * baseMultiplier),
          new: Math.floor(2000 * baseMultiplier),
          returning: Math.floor(6000 * baseMultiplier),
          growth: Math.random() * 25 + 5
        },
        engagement: {
          pageViews: Math.floor(45000 * baseMultiplier),
          sessions: Math.floor(12000 * baseMultiplier),
          avgSessionDuration: Math.floor(Math.random() * 300 + 180),
          bounceRate: Math.random() * 20 + 25,
          conversionRate: Math.random() * 8 + 2
        },
        content: {
          totalTools: Math.floor(500 + Math.random() * 100),
          totalArticles: Math.floor(200 + Math.random() * 50),
          totalReviews: Math.floor(1500 + Math.random() * 300),
          avgRating: Math.round((Math.random() * 2 + 3.5) * 10) / 10,
          topCategories: [
            { name: 'AI Tools', count: Math.floor(150 + Math.random() * 50), growth: Math.random() * 30 + 10 },
            { name: 'Development', count: Math.floor(100 + Math.random() * 30), growth: Math.random() * 25 + 8 },
            { name: 'Design', count: Math.floor(80 + Math.random() * 25), growth: Math.random() * 20 + 5 },
            { name: 'Marketing', count: Math.floor(60 + Math.random() * 20), growth: Math.random() * 15 + 3 },
            { name: 'Productivity', count: Math.floor(40 + Math.random() * 15), growth: Math.random() * 12 + 2 }
          ]
        },
        performance: {
          avgLoadTime: Math.round((Math.random() * 1000 + 800) / 100) * 100,
          coreWebVitals: {
            fcp: Math.round((Math.random() * 1000 + 800) / 100) * 100,
            lcp: Math.round((Math.random() * 1500 + 1200) / 100) * 100,
            fid: Math.round((Math.random() * 100 + 50) / 10) * 10,
            cls: Math.round((Math.random() * 0.2 + 0.05) * 100) / 100
          },
          seoScore: Math.floor(Math.random() * 20 + 80),
          accessibilityScore: Math.floor(Math.random() * 15 + 85)
        },
        business: {
          revenue: Math.floor((Math.random() * 50000 + 100000) * baseMultiplier),
          growth: Math.random() * 40 + 10,
          topRevenueSources: [
            { source: 'Premium Subscriptions', amount: Math.floor(Math.random() * 30000 + 50000), percentage: Math.random() * 20 + 40 },
            { source: 'Affiliate Commissions', amount: Math.floor(Math.random() * 20000 + 30000), percentage: Math.random() * 15 + 25 },
            { source: 'Consulting Services', amount: Math.floor(Math.random() * 15000 + 20000), percentage: Math.random() * 10 + 20 },
            { source: 'Tool Partnerships', amount: Math.floor(Math.random() * 10000 + 15000), percentage: Math.random() * 8 + 12 }
          ],
          conversionFunnels: [
            { stage: 'Visitors', users: Math.floor(15000 * baseMultiplier), conversion: 100 },
            { stage: 'Registered Users', users: Math.floor(8000 * baseMultiplier), conversion: Math.round((8000 / 15000) * 100) },
            { stage: 'Active Users', users: Math.floor(5000 * baseMultiplier), conversion: Math.round((5000 / 15000) * 100) },
            { stage: 'Paying Customers', users: Math.floor(1000 * baseMultiplier), conversion: Math.round((1000 / 15000) * 100) }
          ]
        }
      };
    };

    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setAnalyticsData(generateMockData());
        setLastUpdated(new Date());
        setIsLoading(false);
      }, 1000);
    };

    loadData();

    // Auto-refresh
    const interval = setInterval(loadData, refreshInterval);
    return () => clearInterval(interval);
  }, [selectedTimeRange, refreshInterval]);

  // Get time range label
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case 'day': return 'Last 24 hours';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'quarter': return 'Last 90 days';
      case 'year': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  // Format numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get performance status
  const getPerformanceStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'fcp':
      case 'lcp':
        if (value <= 1000) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
        if (value <= 2000) return { status: 'Needs Improvement', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
        return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
      case 'fid':
        if (value <= 100) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
        if (value <= 300) return { status: 'Needs Improvement', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
        return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
      case 'cls':
        if (value <= 0.1) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
        if (value <= 0.25) return { status: 'Needs Improvement', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
        return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
      default:
        return { status: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No analytics data found for the selected time range
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
                Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getTimeRangeLabel(selectedTimeRange)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
            
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
            
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(analyticsData.users.total)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              +{analyticsData.users.growth.toFixed(1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(analyticsData.engagement.pageViews)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Page Views</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {formatNumber(analyticsData.engagement.sessions)} sessions
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analyticsData.business.revenue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              +{analyticsData.business.growth.toFixed(1)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.engagement.conversionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {formatTime(analyticsData.engagement.avgSessionDuration)} avg session
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="p-6 space-y-6">
        {/* User Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            User Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.users.active)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(analyticsData.users.active / analyticsData.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Users</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.users.new)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(analyticsData.users.new / analyticsData.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Returning Users</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.users.returning)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(analyticsData.users.returning / analyticsData.users.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Content Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Content Overview</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tools</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analyticsData.content.totalTools}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Articles</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analyticsData.content.totalArticles}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analyticsData.content.totalReviews}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analyticsData.content.avgRating}/5
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Top Categories</h5>
              <div className="space-y-2">
                {analyticsData.content.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.count}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        +{category.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Performance Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Core Web Vitals</h5>
              <div className="space-y-3">
                {Object.entries(analyticsData.performance.coreWebVitals).map(([metric, value]) => {
                  const status = getPerformanceStatus(metric, value);
                  return (
                    <div key={metric} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                        {metric}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metric === 'cls' ? value : `${value}ms`}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                          {status.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quality Scores</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">SEO Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analyticsData.performance.seoScore}/100
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analyticsData.performance.seoScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Accessibility Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {analyticsData.performance.accessibilityScore}/100
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analyticsData.performance.accessibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Load Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analyticsData.performance.avgLoadTime}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Business Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Revenue Sources</h5>
              <div className="space-y-3">
                {analyticsData.business.topRevenueSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{source.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(source.amount)}
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {source.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Conversion Funnel</h5>
              <div className="space-y-3">
                {analyticsData.business.conversionFunnels.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatNumber(stage.users)}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {stage.conversion.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Insights */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Engagement Insights
          </h4>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Bounce rate is {analyticsData.engagement.bounceRate.toFixed(1)}% - consider improving page engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Average session duration is {formatTime(analyticsData.engagement.avgSessionDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Conversion rate is {analyticsData.engagement.conversionRate.toFixed(1)}% - focus on optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>User growth is {analyticsData.users.growth.toFixed(1)}% - strong user acquisition</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <span>
            Auto-refresh every {refreshInterval / 60000} minutes
          </span>
        </div>
      </div>
    </div>
  );
}
