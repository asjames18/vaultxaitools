'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Clock, Target, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fmp: number | null; // First Meaningful Paint
}

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function PerformanceMonitor({ 
  className = '', 
  showDetails = true, 
  autoRefresh = true, 
  refreshInterval = 5000 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Calculate performance score based on Core Web Vitals
  const calculatePerformanceScore = useCallback((metrics: PerformanceMetrics): number => {
    let score = 100;
    let deductions = 0;

    // FCP scoring (0-2.5s is good, 2.5-4s needs improvement, >4s is poor)
    if (metrics.fcp) {
      if (metrics.fcp > 4000) deductions += 30;
      else if (metrics.fcp > 2500) deductions += 15;
    }

    // LCP scoring (0-2.5s is good, 2.5-4s needs improvement, >4s is poor)
    if (metrics.lcp) {
      if (metrics.lcp > 4000) deductions += 30;
      else if (metrics.lcp > 2500) deductions += 15;
    }

    // FID scoring (0-100ms is good, 100-300ms needs improvement, >300ms is poor)
    if (metrics.fid) {
      if (metrics.fid > 300) deductions += 20;
      else if (metrics.fid > 100) deductions += 10;
    }

    // CLS scoring (0-0.1 is good, 0.1-0.25 needs improvement, >0.25 is poor)
    if (metrics.cls) {
      if (metrics.cls > 0.25) deductions += 20;
      else if (metrics.cls > 0.1) deductions += 10;
    }

    return Math.max(0, score - deductions);
  }, []);

  // Generate performance recommendations
  const generateRecommendations = useCallback((metrics: PerformanceMetrics): string[] => {
    const recs: string[] = [];

    if (metrics.fcp && metrics.fcp > 2500) {
      recs.push('Optimize First Contentful Paint: Reduce server response time, optimize critical resources');
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      recs.push('Improve Largest Contentful Paint: Optimize images, implement lazy loading, use CDN');
    }

    if (metrics.fid && metrics.fid > 100) {
      recs.push('Reduce First Input Delay: Minimize JavaScript execution time, implement code splitting');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      recs.push('Fix Cumulative Layout Shift: Set explicit dimensions for images and media elements');
    }

    if (metrics.ttfb && metrics.ttfb > 600) {
      recs.push('Optimize Time to First Byte: Improve server response time, use caching strategies');
    }

    if (recs.length === 0) {
      recs.push('Great performance! All metrics are within optimal ranges.');
    }

    return recs;
  }, []);

  // Measure Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // FCP (First Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcp = entries[entries.length - 1];
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
        }
      }).observe({ entryTypes: ['paint'] });

      // LCP (Largest Contentful Paint)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcp = entries[entries.length - 1];
        if (lcp) {
          setMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fid = entries[entries.length - 1];
        if (fid) {
          setMetrics(prev => ({ ...prev, fid: fid.processingStart - fid.startTime }));
        }
      }).observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      new PerformanceObserver((entryList) => {
        let cls = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        setMetrics(prev => ({ ...prev, cls }));
      }).observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.error('Error measuring Core Web Vitals:', error);
    }
  }, []);

  // Measure additional metrics
  const measureAdditionalMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    try {
      const perf = window.performance;
      const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
          fmp: navigation.domContentLoadedEventEnd - navigation.navigationStart
        }));
      }
    } catch (error) {
      console.error('Error measuring additional metrics:', error);
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    measureCoreWebVitals();
    measureAdditionalMetrics();
  }, [measureCoreWebVitals, measureAdditionalMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Refresh metrics
  const refreshMetrics = useCallback(() => {
    measureAdditionalMetrics();
  }, [measureAdditionalMetrics]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && isMonitoring) {
      const interval = setInterval(refreshMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isMonitoring, refreshInterval, refreshMetrics]);

  // Calculate score and recommendations when metrics change
  useEffect(() => {
    const score = calculatePerformanceScore(metrics);
    setPerformanceScore(score);
    setRecommendations(generateRecommendations(metrics));
  }, [metrics, calculatePerformanceScore, generateRecommendations]);

  // Get performance grade
  const getPerformanceGrade = (score: number): { grade: string; color: string; icon: React.ReactNode } => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', icon: <TrendingUp className="w-4 h-4" /> };
    if (score >= 70) return { grade: 'B', color: 'text-yellow-600', icon: <Activity className="w-4 h-4" /> };
    if (score >= 50) return { grade: 'C', color: 'text-orange-600', icon: <Clock className="w-4 h-4" /> };
    return { grade: 'F', color: 'text-red-600', icon: <AlertTriangle className="w-4 h-4" /> };
  };

  // Format metric value
  const formatMetric = (value: number | null, unit: string): string => {
    if (value === null) return 'N/A';
    return `${value.toFixed(2)} ${unit}`;
  };

  // Get metric status
  const getMetricStatus = (metric: keyof PerformanceMetrics): { status: string; color: string } => {
    const value = metrics[metric];
    if (value === null) return { status: 'Unknown', color: 'text-gray-500' };

    switch (metric) {
      case 'fcp':
        if (value <= 2500) return { status: 'Good', color: 'text-green-600' };
        if (value <= 4000) return { status: 'Needs Improvement', color: 'text-yellow-600' };
        return { status: 'Poor', color: 'text-red-600' };
      
      case 'lcp':
        if (value <= 2500) return { status: 'Good', color: 'text-green-600' };
        if (value <= 4000) return { status: 'Needs Improvement', color: 'text-yellow-600' };
        return { status: 'Poor', color: 'text-red-600' };
      
      case 'fid':
        if (value <= 100) return { status: 'Good', color: 'text-green-600' };
        if (value <= 300) return { status: 'Needs Improvement', color: 'text-yellow-600' };
        return { status: 'Poor', color: 'text-red-600' };
      
      case 'cls':
        if (value <= 0.1) return { status: 'Good', color: 'text-green-600' };
        if (value <= 0.25) return { status: 'Needs Improvement', color: 'text-yellow-600' };
        return { status: 'Poor', color: 'text-red-600' };
      
      default:
        return { status: 'Measured', color: 'text-blue-600' };
    }
  };

  const { grade, color, icon } = getPerformanceGrade(performanceScore);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Monitor
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time Core Web Vitals tracking
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMonitoring ? (
              <button
                onClick={startMonitoring}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Start Monitoring
              </button>
            ) : (
              <button
                onClick={stopMonitoring}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Stop Monitoring
              </button>
            )}
            
            {isMonitoring && (
              <button
                onClick={refreshMetrics}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Refresh metrics"
              >
                <Target className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Performance Score */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Performance Score
            </h4>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold ${color}`}>{grade}</span>
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {performanceScore}/100
              </span>
              {icon}
            </div>
          </div>
          
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(performanceScore / 100) * 251.2} 251.2`}
                className={`${color} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${color}`}>{performanceScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {showDetails && (
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Core Web Vitals
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* FCP */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">FCP</span>
                <span className={`text-xs font-medium ${getMetricStatus('fcp').color}`}>
                  {getMetricStatus('fcp').status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.fcp, 'ms')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                First Contentful Paint
              </p>
            </div>

            {/* LCP */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LCP</span>
                <span className={`text-xs font-medium ${getMetricStatus('lcp').color}`}>
                  {getMetricStatus('lcp').status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.lcp, 'ms')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Largest Contentful Paint
              </p>
            </div>

            {/* FID */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">FID</span>
                <span className={`text-xs font-medium ${getMetricStatus('fid').color}`}>
                  {getMetricStatus('fid').status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.fid, 'ms')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                First Input Delay
              </p>
            </div>

            {/* CLS */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CLS</span>
                <span className={`text-xs font-medium ${getMetricStatus('cls').color}`}>
                  {getMetricStatus('cls').status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.cls, '')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cumulative Layout Shift
              </p>
            </div>

            {/* TTFB */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TTFB</span>
                <span className="text-xs font-medium text-blue-600">Measured</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.ttfb, 'ms')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Time to First Byte
              </p>
            </div>

            {/* FMP */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">FMP</span>
                <span className="text-xs font-medium text-blue-600">Measured</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMetric(metrics.fmp, 'ms')}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                First Meaningful Paint
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showDetails && recommendations.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Recommendations
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {isMonitoring ? 'Monitoring active' : 'Monitoring stopped'}
          </span>
          <span>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
