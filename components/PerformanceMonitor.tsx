'use client';

import { useEffect } from 'react';
import { trackEvent } from './GoogleAnalytics';
import { devLog } from '@/lib/utils';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = true }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Track Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          if (lastEntry) {
            const lcp = lastEntry.startTime;
            trackEvent('core_web_vital', 'web_vitals', 'LCP', Math.round(lcp));
          }
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer failed:', e);
        }
      }

      // Track First Input Delay (FID)
      if ('PerformanceObserver' in window) {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            const eventEntry = entry as PerformanceEventTiming;
            const fid = eventEntry.processingStart - eventEntry.startTime;
            trackEvent('core_web_vital', 'web_vitals', 'FID', Math.round(fid));
          });
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer failed:', e);
        }
      }

      // Track Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        let clsEntries: PerformanceEntry[] = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShift = entry as PerformanceEntry & { hadRecentInput?: boolean; value: number };
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
              clsEntries.push(entry);
            }
          }
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer failed:', e);
        }

        // Report CLS on page unload
        const reportCLS = () => {
          if (clsValue > 0) {
            trackEvent('core_web_vital', 'web_vitals', 'CLS', Math.round(clsValue * 1000));
          }
        };

        window.addEventListener('beforeunload', reportCLS);
        return () => window.removeEventListener('beforeunload', reportCLS);
      }
    };

    // Track page load performance
    const trackPageLoadPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ttfb: navigation.responseStart - navigation.requestStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            total: navigation.loadEventEnd - navigation.fetchStart,
          };

          // Track each metric
          Object.entries(metrics).forEach(([key, value]) => {
            if (value > 0) {
              trackEvent('performance', 'timing', key, Math.round(value));
            }
          });
        }
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry) => {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Track slow resources (> 1 second)
            if (resourceEntry.duration > 1000) {
              trackEvent('performance', 'resource', 'slow_resource', Math.round(resourceEntry.duration));
              console.warn('Slow resource:', resourceEntry.name, resourceEntry.duration);
            }
          });
        });
        
        try {
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (e) {
          console.warn('Resource observer failed:', e);
        }
      }
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        trackEvent('performance', 'memory', 'heap_usage', usedMB);
      }
    };

    // Initialize all tracking
    trackCoreWebVitals();
    trackPageLoadPerformance();
    trackResourcePerformance();
    
    // Track memory usage periodically
    const memoryInterval = setInterval(trackMemoryUsage, 30000); // Every 30 seconds

    // Track performance on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageLoadPerformance();
        trackMemoryUsage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(memoryInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  // Don't render anything
  return null;
}

// Utility functions for manual performance tracking
export const trackCustomMetric = (name: string, value: number, category: string = 'custom') => {
  trackEvent('performance', category, name, Math.round(value));
};

export const trackUserInteraction = (action: string, target: string, duration?: number) => {
  trackEvent('interaction', 'user_engagement', `${action}_${target}`, duration);
};

export const trackError = (error: Error, context: string) => {
  trackEvent('error', 'application', `${context}: ${error.message}`);
};
