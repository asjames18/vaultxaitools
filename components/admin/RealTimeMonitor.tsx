'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { AdminMetricCard } from './AnalyticsCharts';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdate: Date;
}

interface RealTimeMonitorProps {
  metrics: RealTimeMetric[];
  onMetricUpdate?: (metric: RealTimeMetric) => void;
  refreshInterval?: number; // milliseconds
  className?: string;
}

export function RealTimeMonitor({ 
  metrics, 
  onMetricUpdate, 
  refreshInterval = 5000,
  className = '' 
}: RealTimeMonitorProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: Date;
  }>>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
  }, []);

  // Manual refresh
  const refreshData = useCallback(() => {
    setLastRefresh(new Date());
    // Trigger data refresh
    if (onMetricUpdate) {
      metrics.forEach(metric => {
        onMetricUpdate(metric);
      });
    }
  }, [metrics, onMetricUpdate]);

  // Add notification
  const addNotification = useCallback((type: 'info' | 'warning' | 'critical', message: string) => {
    const notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: new Date()
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 10000);
  }, []);

  // Monitor metrics for status changes
  useEffect(() => {
    if (!isMonitoring) return;

    const checkMetrics = () => {
      metrics.forEach(metric => {
        if (metric.status === 'critical') {
          addNotification('critical', `${metric.name} is at critical level: ${metric.value}${metric.unit}`);
        } else if (metric.status === 'warning') {
          addNotification('warning', `${metric.name} is at warning level: ${metric.value}${metric.unit}`);
        }
      });
    };

    const interval = setInterval(checkMetrics, refreshInterval);
    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, metrics, refreshInterval, addNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusColor = (status: RealTimeMetric['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend: RealTimeMetric['trend']) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      case 'stable':
        return '→';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend: RealTimeMetric['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      case 'stable':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Real-Time Monitor
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isMonitoring 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
                {isMonitoring ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMonitoring}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium ${
                isMonitoring
                  ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                  : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              } hover:bg-opacity-80`}
            >
              {isMonitoring ? (
                <>
                  <PauseIcon className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </button>
            
            <button
              onClick={refreshData}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString()} | 
          Refresh interval: {refreshInterval / 1000}s | 
          Monitoring: {isMonitoring ? 'Active' : 'Paused'}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {metric.name}
              </h4>
              <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {metric.value}
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                {metric.unit}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)} {metric.trend}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {metric.lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Notifications
          </h4>
          
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-3 rounded-lg border ${
                  notification.type === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                    : notification.type === 'warning'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {notification.type === 'critical' ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  ) : notification.type === 'warning' ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                <div className="ml-3 flex-1">
                  <p className={`text-sm font-medium ${
                    notification.type === 'critical'
                      ? 'text-red-800 dark:text-red-200'
                      : notification.type === 'warning'
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for managing real-time metrics
export function useRealTimeMetrics(initialMetrics: Omit<RealTimeMetric, 'id'>[]) {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>(() =>
    initialMetrics.map((metric, index) => ({
      ...metric,
      id: `metric_${index}`,
      lastUpdate: new Date()
    }))
  );

  const updateMetric = useCallback((metricId: string, updates: Partial<RealTimeMetric>) => {
    setMetrics(prev => prev.map(metric => 
      metric.id === metricId 
        ? { ...metric, ...updates, lastUpdate: new Date() }
        : metric
    ));
  }, []);

  const addMetric = useCallback((metric: Omit<RealTimeMetric, 'id'>) => {
    const newMetric = {
      ...metric,
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdate: new Date()
    };
    setMetrics(prev => [...prev, newMetric]);
  }, []);

  const removeMetric = useCallback((metricId: string) => {
    setMetrics(prev => prev.filter(metric => metric.id !== metricId));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      lastUpdate: new Date()
    })));
  }, []);

  return {
    metrics,
    updateMetric,
    addMetric,
    removeMetric,
    resetMetrics
  };
}
