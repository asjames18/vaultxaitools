'use client';

import { useState, useMemo } from 'react';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import DataVisualization from '../../components/DataVisualization';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, Target, PieChart, LineChart, AreaChart } from 'lucide-react';

// Mock chart data
const mockChartData = {
  userGrowth: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Users',
      data: [1200, 1900, 3000, 5000, 2000, 3000]
    }]
  },
  revenueTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [45000, 52000, 49000, 61000, 55000, 68000]
    }]
  },
  categoryDistribution: {
    labels: ['AI Tools', 'Development', 'Design', 'Marketing', 'Productivity'],
    datasets: [{
      label: 'Tools',
      data: [150, 100, 80, 60, 40]
    }]
  },
  engagementMetrics: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Page Views',
        data: [12000, 19000, 15000, 18000, 22000, 25000, 20000]
      },
      {
        label: 'Sessions',
        data: [3000, 4500, 3800, 4200, 5000, 5800, 4800]
      }
    ]
  },
  conversionFunnel: {
    labels: ['Visitors', 'Registered', 'Active', 'Paying'],
    datasets: [{
      label: 'Users',
      data: [15000, 8000, 5000, 1000]
    }]
  },
  performanceMetrics: {
    labels: ['FCP', 'LCP', 'FID', 'CLS'],
    datasets: [{
      label: 'Performance',
      data: [1200, 2100, 45, 0.05]
    }]
  }
};

export default function BusinessIntelligenceDashboardClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'visualizations' | 'insights'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'visualizations', label: 'Visualizations', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Business Intelligence Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
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
              
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Business Intelligence & Analytics
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Comprehensive insights into platform performance, user behavior, and business metrics with advanced data visualization.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">15K+</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$68K</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">45K+</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">6.7%</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              </div>
            </div>

            {/* Key Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataVisualization
                chartType="line"
                data={mockChartData.userGrowth}
                title="User Growth Trends"
                height={300}
              />
              
              <DataVisualization
                chartType="bar"
                data={mockChartData.revenueTrends}
                title="Revenue Trends"
                height={300}
              />
            </div>

            {/* Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataVisualization
                chartType="pie"
                data={mockChartData.categoryDistribution}
                title="Tool Category Distribution"
                height={300}
              />
              
              <DataVisualization
                chartType="doughnut"
                data={mockChartData.conversionFunnel}
                title="Conversion Funnel"
                height={300}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Comprehensive Analytics
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Deep insights into user behavior, platform performance, and business metrics
              </p>
            </div>

            <AnalyticsDashboard 
              timeRange={selectedTimeRange}
              showCharts={true}
              refreshInterval={300000}
            />
          </div>
        )}

        {activeTab === 'visualizations' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Data Visualizations
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Interactive charts and graphs for better data understanding
              </p>
            </div>

            {/* Chart Types Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataVisualization
                chartType="line"
                data={mockChartData.engagementMetrics}
                title="Weekly Engagement Metrics"
                height={350}
              />
              
              <DataVisualization
                chartType="area"
                data={mockChartData.revenueTrends}
                title="Revenue Growth (Area Chart)"
                height={350}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataVisualization
                chartType="bar"
                data={mockChartData.performanceMetrics}
                title="Core Web Vitals Performance"
                height={350}
              />
              
              <DataVisualization
                chartType="pie"
                data={mockChartData.categoryDistribution}
                title="Tool Categories (Pie Chart)"
                height={350}
              />
            </div>

            {/* Chart Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Chart Customization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chart Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="doughnut">Doughnut Chart</option>
                    <option value="area">Area Chart</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Show Grid
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Show Legend
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Business Insights
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Actionable insights and recommendations based on data analysis
              </p>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth Opportunities</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• User growth increased 25% this month</li>
                  <li>• Revenue from premium subscriptions up 40%</li>
                  <li>• Mobile engagement improved by 35%</li>
                  <li>• Search conversion rate increased 15%</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas for Improvement</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Bounce rate increased to 28%</li>
                  <li>• Average session duration decreased 10%</li>
                  <li>• Mobile conversion rate below target</li>
                  <li>• Search result relevance needs optimization</li>
                </ul>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Core Web Vitals</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">First Contentful Paint</span>
                      <span className="text-sm font-medium text-green-600">Good (1.2s)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Largest Contentful Paint</span>
                      <span className="text-sm font-medium text-yellow-600">Needs Improvement (2.1s)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">First Input Delay</span>
                      <span className="text-sm font-medium text-green-600">Good (45ms)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Cumulative Layout Shift</span>
                      <span className="text-sm font-medium text-green-600">Good (0.05)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Optimize images to improve LCP score</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Implement lazy loading for below-fold content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Reduce JavaScript bundle size</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Optimize critical rendering path</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Immediate Action Items</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Optimize mobile user experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Improve search result relevance</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Enhance content engagement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Optimize conversion funnel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 VaultX AI Tools. Advanced business intelligence and analytics platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
