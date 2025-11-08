'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  EyeIcon, 
  UsersIcon, 
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { AdminLineChart, AdminBarChart, AdminDoughnutChart, AdminStatsGrid, chartColors, generateTimeSeriesData } from '@/components/admin/AnalyticsCharts';
import { RealTimeMonitor, useRealTimeMetrics } from '@/components/admin/RealTimeMonitor';
import { DataExport, ScheduledExport } from '@/components/admin/DataExport';
import { LoadingSpinner } from '@/components/AdminLoadingStates';

// Mock data for demonstration
const mockAnalyticsData = {
  tools: {
    total: 156,
    active: 142,
    pending: 8,
    inactive: 6,
    categories: ['AI Writing', 'Image Generation', 'Code Assistant', 'Data Analysis', 'Video Editing'],
    categoryCounts: [45, 32, 28, 23, 28],
    monthlyGrowth: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
    ratings: [4.2, 4.5, 4.1, 4.3, 4.4, 4.6, 4.0, 4.7, 4.3, 4.5]
  },
  users: {
    total: 2847,
    active: 2156,
    new: 89,
    returning: 2067,
    monthlyGrowth: [156, 189, 234, 267, 298, 345, 378, 412, 445, 478, 512, 545],
    engagement: [78, 82, 79, 85, 88, 91, 87, 89, 92, 90, 93, 95]
  },
  performance: {
    pageLoadTime: 1.2,
    serverResponse: 0.8,
    databaseQueries: 12.5,
    cacheHitRate: 94.2,
    uptime: 99.8,
    errorRate: 0.15
  }
};

// Generate sample time series data
const generateSampleData = () => {
  const days = 30;
  const toolViews = Array.from({ length: days }, () => Math.floor(Math.random() * 1000) + 500);
  const userRegistrations = Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 10);
  const toolSubmissions = Array.from({ length: days }, () => Math.floor(Math.random() * 20) + 5);

  return {
    toolViews: generateTimeSeriesData(days, [{
      label: 'Tool Views',
      data: toolViews,
      color: chartColors.primary
    }]),
    userRegistrations: generateTimeSeriesData(days, [{
      label: 'User Registrations',
      data: userRegistrations,
      color: chartColors.success
    }]),
    toolSubmissions: generateTimeSeriesData(days, [{
      label: 'Tool Submissions',
      data: toolSubmissions,
      color: chartColors.warning
    }])
  };
};

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
  const [sampleData] = useState(generateSampleData());
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [exportSchedules, setExportSchedules] = useState<Array<{
    id: string;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    format: string;
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
  }>>([]);

  // Real-time metrics
  const { metrics, updateMetric } = useRealTimeMetrics([
    {
      name: 'Active Users',
      value: 2156,
      unit: '',
      status: 'normal',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      name: 'Server Load',
      value: 45,
      unit: '%',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date()
    },
    {
      name: 'Response Time',
      value: 180,
      unit: 'ms',
      status: 'normal',
      trend: 'down',
      lastUpdate: new Date()
    },
    {
      name: 'Error Rate',
      value: 0.15,
      unit: '%',
      status: 'normal',
      trend: 'stable',
      lastUpdate: new Date()
    },
    {
      name: 'Database Connections',
      value: 23,
      unit: '',
      status: 'normal',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      name: 'Cache Hit Rate',
      value: 94.2,
      unit: '%',
      status: 'normal',
      trend: 'up',
      lastUpdate: new Date()
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      metrics.forEach((metric) => {
        if (Math.random() > 0.7) { // 30% chance to update
          const variation = (Math.random() - 0.5) * 10; // ±5 variation
          let newValue = metric.value + variation;
          
          // Keep values in reasonable ranges
          if (metric.name === 'Active Users') {
            newValue = Math.max(1800, Math.min(2500, newValue));
          } else if (metric.name === 'Server Load') {
            newValue = Math.max(20, Math.min(80, newValue));
          } else if (metric.name === 'Response Time') {
            newValue = Math.max(100, Math.min(300, newValue));
          } else if (metric.name === 'Error Rate') {
            newValue = Math.max(0.05, Math.min(0.5, newValue));
          } else if (metric.name === 'Database Connections') {
            newValue = Math.max(15, Math.min(35, newValue));
          } else if (metric.name === 'Cache Hit Rate') {
            newValue = Math.max(90, Math.min(98, newValue));
          }

          // Update status based on values
          let newStatus: 'normal' | 'warning' | 'critical' = 'normal';
          if (metric.name === 'Server Load' && newValue > 70) {
            newStatus = 'warning';
          } else if (metric.name === 'Response Time' && newValue > 250) {
            newStatus = 'warning';
          } else if (metric.name === 'Error Rate' && newValue > 0.3) {
            newStatus = 'warning';
          }

          // Update trend
          let newTrend: 'up' | 'down' | 'stable' = 'stable';
          if (Math.abs(newValue - metric.value) > 2) {
            newTrend = newValue > metric.value ? 'up' : 'down';
          }

          updateMetric(metric.id, {
            value: Math.round(newValue * 100) / 100,
            status: newStatus,
            trend: newTrend
          });
        }
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [metrics, updateMetric]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Comprehensive insights into your AI tools platform performance
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedTimeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8">
            <AdminStatsGrid
              stats={[
                {
                  title: 'Total Tools',
                  value: analyticsData.tools.total,
                  change: { value: 12, type: 'increase', period: 'month' },
                  icon: <ChartBarIcon className="h-8 w-8" />
                },
                {
                  title: 'Active Users',
                  value: analyticsData.users.total.toLocaleString(),
                  change: { value: 8, type: 'increase', period: 'month' },
                  icon: <UsersIcon className="h-8 w-8" />
                },
                {
                  title: 'Average Rating',
                  value: (analyticsData.tools.ratings.reduce((a, b) => a + b, 0) / analyticsData.tools.ratings.length).toFixed(1),
                  change: { value: 2, type: 'increase', period: 'month' },
                  icon: <StarIcon className="h-8 w-8" />
                },
                {
                  title: 'Uptime',
                  value: `${analyticsData.performance.uptime}%`,
                  change: { value: 0.2, type: 'increase', period: 'month' },
                  icon: <ArrowTrendingUpIcon className="h-8 w-8" />
                }
              ]}
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AdminLineChart
              data={sampleData.toolViews}
              title="Tool Views Over Time"
              height={300}
            />
            <AdminLineChart
              data={sampleData.userRegistrations}
              title="User Registrations"
              height={300}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AdminBarChart
              data={{
                labels: analyticsData.tools.categories,
                datasets: [{
                  label: 'Tools by Category',
                  data: analyticsData.tools.categoryCounts,
                  backgroundColor: chartColors.primary + '80'
                }]
              }}
              title="Tools by Category"
              height={300}
            />
            <AdminDoughnutChart
              data={{
                labels: ['Active', 'Pending', 'Inactive'],
                datasets: [{
                  data: [analyticsData.tools.active, analyticsData.tools.pending, analyticsData.tools.inactive],
                  backgroundColor: [chartColors.success, chartColors.warning, chartColors.danger]
                }]
              }}
              title="Tool Status Distribution"
              height={300}
            />
          </div>

          {/* Real-Time Monitor */}
          <div className="mb-8">
            <RealTimeMonitor
              metrics={metrics}
              refreshInterval={5000}
            />
          </div>

          {/* Data Export */}
          <div className="mb-8">
            <DataExport
              data={[
                {
                  metric: 'Total Tools',
                  value: analyticsData.tools.total
                },
                {
                  metric: 'Active Tools',
                  value: analyticsData.tools.active
                },
                {
                  metric: 'Pending Tools',
                  value: analyticsData.tools.pending
                },
                {
                  metric: 'Inactive Tools',
                  value: analyticsData.tools.inactive
                }
              ]}
              filename="analytics_tools"
              onExport={(format, data) => {
                console.log(`Exporting ${format} data:`, data);
              }}
            />
          </div>

          {/* Scheduled Exports */}
          <div className="mb-8">
            <ScheduledExport
              schedules={exportSchedules}
              onScheduleChange={(schedule) => {
                setExportSchedules(prev => [...prev, schedule]);
              }}
              onScheduleToggle={(scheduleId, enabled) => {
                setExportSchedules(prev => 
                  prev.map(s => s.id === scheduleId ? { ...s, enabled } : s)
                );
              }}
            />
          </div>
        </div>
      </div>
    </AdminErrorBoundary>
  );
}
