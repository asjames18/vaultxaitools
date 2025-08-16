'use client';

import { useState } from 'react';
import PerformanceMonitor from '../../components/PerformanceMonitor';
import ResourceOptimizer from '../../components/ResourceOptimizer';
import CachingStrategy from '../../components/CachingStrategy';
import { BarChart3, Zap, Settings, TrendingUp, Activity, Shield, Database, Gauge } from 'lucide-react';

export default function PerformanceDashboardClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'optimization' | 'caching'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'monitoring', label: 'Performance Monitoring', icon: Activity },
    { id: 'optimization', label: 'Resource Optimization', icon: Zap },
    { id: 'caching', label: 'Caching Strategy', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Performance Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
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
                Performance Dashboard
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Monitor, analyze, and optimize your application's performance with real-time metrics and actionable insights.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">95%</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Performance Score</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1.2s</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Load Time</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">87%</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">2.1MB</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bundle Size</p>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Core Web Vitals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">First Contentful Paint</span>
                    <span className="text-sm font-medium text-green-600">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Largest Contentful Paint</span>
                    <span className="text-sm font-medium text-green-600">2.1s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">First Input Delay</span>
                    <span className="text-sm font-medium text-green-600">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cumulative Layout Shift</span>
                    <span className="text-sm font-medium text-green-600">0.05</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Optimization Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Images Optimized</span>
                    <span className="text-sm font-medium text-green-600">24/24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Scripts Minified</span>
                    <span className="text-sm font-medium text-green-600">12/12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CSS Compressed</span>
                    <span className="text-sm font-medium text-green-600">8/8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fonts Optimized</span>
                    <span className="text-sm font-medium text-green-600">6/6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
                >
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Monitor Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track Core Web Vitals in real-time</p>
                </button>

                <button
                  onClick={() => setActiveTab('optimization')}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Optimize Resources</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analyze and optimize page resources</p>
                </button>

                <button
                  onClick={() => setActiveTab('caching')}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <Database className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <h4 className="font-medium text-gray-900 dark:text-white">Review Caching</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Analyze caching strategies</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Performance Monitoring
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Real-time monitoring of Core Web Vitals and performance metrics
              </p>
            </div>

            <PerformanceMonitor />
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Resource Optimization
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Analyze and optimize images, scripts, stylesheets, and other resources
              </p>
            </div>

            <ResourceOptimizer />
          </div>
        )}

        {activeTab === 'caching' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Caching Strategy
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Review and optimize caching strategies for better performance
              </p>
            </div>

            <CachingStrategy />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 VaultX AI Tools. Performance monitoring and optimization tools for modern web applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
