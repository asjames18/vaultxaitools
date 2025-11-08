'use client';

import { useState, useEffect, useCallback } from 'react';
import { Database, Clock, RefreshCw, Shield, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CacheEntry {
  url: string;
  type: 'static' | 'dynamic' | 'api' | 'image' | 'font';
  cacheControl: string;
  expires: string | null;
  maxAge: number | null;
  etag: string | null;
  lastModified: string | null;
  size: number;
  status: 'cached' | 'stale' | 'expired' | 'no-cache' | 'unknown';
  recommendations: string[];
}

interface CachingStrategyProps {
  className?: string;
  autoAnalyze?: boolean;
  showAdvanced?: boolean;
}

export default function CachingStrategy({ 
  className = '', 
  autoAnalyze = true, 
  showAdvanced = false 
}: CachingStrategyProps) {
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [cacheHitRate, setCacheHitRate] = useState(0);
  const [totalCacheSize, setTotalCacheSize] = useState(0);
  const [strategy, setStrategy] = useState<'aggressive' | 'balanced' | 'conservative'>('balanced');

  // Analyze page caching
  const analyzeCaching = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const newEntries: CacheEntry[] = [];
      
      // Get all resource entries from Performance API
      const resourceEntries = performance.getEntriesByType('resource');
      
      for (let i = 0; i < resourceEntries.length; i++) {
        const entry = resourceEntries[i] as PerformanceResourceTiming;
        const progress = ((i + 1) / resourceEntries.length) * 100;
        setAnalysisProgress(progress);
        
        // Analyze caching for this resource
        const cacheEntry = await analyzeCacheEntry(entry);
        if (cacheEntry) {
          newEntries.push(cacheEntry);
        }
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      setCacheEntries(newEntries);
      calculateCacheMetrics(newEntries);
      
    } catch (error) {
      console.error('Error analyzing caching:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(100);
    }
  }, []);

  // Analyze individual cache entry
  const analyzeCacheEntry = async (entry: PerformanceResourceTiming): Promise<CacheEntry | null> => {
    try {
      const url = entry.name;
      const size = entry.transferSize || 0;
      
      // Determine resource type
      const type = getResourceType(url);
      
      // Try to get cache headers (this would normally come from server response)
      const cacheInfo = await getCacheInfo(url);
      
      // Analyze cache status
      const status = analyzeCacheStatus(cacheInfo);
      
      // Generate recommendations
      const recommendations = generateCacheRecommendations(url, type, cacheInfo, status);
      
      return {
        url,
        type,
        cacheControl: cacheInfo.cacheControl || 'no-cache',
        expires: cacheInfo.expires,
        maxAge: cacheInfo.maxAge,
        etag: cacheInfo.etag,
        lastModified: cacheInfo.lastModified,
        size,
        status,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing cache entry:', error);
      return null;
    }
  };

  // Get resource type from URL
  const getResourceType = (url: string): CacheEntry['type'] => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(extension || '')) {
      return 'image';
    } else if (['js'].includes(extension || '')) {
      return 'static';
    } else if (['css'].includes(extension || '')) {
      return 'static';
    } else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension || '')) {
      return 'font';
    } else if (url.includes('/api/') || url.includes('?') || url.includes('#')) {
      return 'api';
    } else if (url.includes('/admin/') || url.includes('/dashboard/')) {
      return 'dynamic';
    } else {
      return 'static';
    }
  };

  // Get cache information (simulated - in real app this would come from server)
  const getCacheInfo = async (url: string) => {
    // Simulate different cache strategies based on resource type
    const type = getResourceType(url);
    
    switch (type) {
      case 'static':
        return {
          cacheControl: 'public, max-age=31536000', // 1 year
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString(),
          maxAge: 31536000,
          etag: `"${btoa(url).slice(0, 8)}"`,
          lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toUTCString()
        };
      
      case 'image':
        return {
          cacheControl: 'public, max-age=2592000', // 30 days
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(),
          maxAge: 2592000,
          etag: `"${btoa(url).slice(0, 8)}"`,
          lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toUTCString()
        };
      
      case 'font':
        return {
          cacheControl: 'public, max-age=31536000', // 1 year
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString(),
          maxAge: 31536000,
          etag: `"${btoa(url).slice(0, 8)}"`,
          lastModified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toUTCString()
        };
      
      case 'api':
        return {
          cacheControl: 'private, max-age=300', // 5 minutes
          expires: new Date(Date.now() + 5 * 60 * 1000).toUTCString(),
          maxAge: 300,
          etag: `"${btoa(url + Date.now()).slice(0, 8)}"`,
          lastModified: new Date().toUTCString()
        };
      
      case 'dynamic':
        return {
          cacheControl: 'no-cache',
          expires: null,
          maxAge: null,
          etag: null,
          lastModified: null
        };
      
      default:
        return {
          cacheControl: 'public, max-age=86400', // 1 day
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
          maxAge: 86400,
          etag: `"${btoa(url).slice(0, 8)}"`,
          lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000).toUTCString()
        };
    }
  };

  // Analyze cache status
  const analyzeCacheStatus = (cacheInfo: any): CacheEntry['status'] => {
    if (!cacheInfo.cacheControl || cacheInfo.cacheControl === 'no-cache') {
      return 'no-cache';
    }
    
    if (cacheInfo.maxAge) {
      const now = Date.now();
      const expires = cacheInfo.expires ? new Date(cacheInfo.expires).getTime() : now + (cacheInfo.maxAge * 1000);
      
      if (expires < now) {
        return 'expired';
      } else if (expires < now + (24 * 60 * 60 * 1000)) { // Less than 1 day
        return 'stale';
      } else {
        return 'cached';
      }
    }
    
    return 'unknown';
  };

  // Generate cache recommendations
  const generateCacheRecommendations = (
    url: string, 
    type: CacheEntry['type'], 
    cacheInfo: any, 
    status: CacheEntry['status']
  ): string[] => {
    const recs: string[] = [];
    
    if (status === 'cached') {
      recs.push('Resource is properly cached');
      return recs;
    }
    
    switch (type) {
      case 'static':
        if (status === 'no-cache') {
          recs.push('Implement long-term caching for static assets');
          recs.push('Use Cache-Control: public, max-age=31536000');
        } else if (status === 'stale') {
          recs.push('Consider extending cache duration for static assets');
        }
        break;
        
      case 'image':
        if (status === 'no-cache') {
          recs.push('Implement image caching with Cache-Control: public, max-age=2592000');
          recs.push('Use ETags for cache validation');
        }
        break;
        
      case 'font':
        if (status === 'no-cache') {
          recs.push('Implement long-term font caching with Cache-Control: public, max-age=31536000');
          recs.push('Use font-display: swap for better performance');
        }
        break;
        
      case 'api':
        if (status === 'no-cache') {
          recs.push('Implement short-term API caching with Cache-Control: private, max-age=300');
          recs.push('Use ETags for cache validation');
        } else if (status === 'stale' || status === 'expired') {
          recs.push('Consider reducing cache duration for frequently changing API responses');
        }
        break;
        
      case 'dynamic':
        if (status !== 'no-cache') {
          recs.push('Dynamic content should use no-cache or private caching');
          recs.push('Implement cache-busting for user-specific content');
        }
        break;
    }
    
    // General recommendations
    if (!cacheInfo.etag) {
      recs.push('Implement ETags for cache validation');
    }
    
    if (!cacheInfo.lastModified) {
      recs.push('Set Last-Modified headers for better cache control');
    }
    
    return recs;
  };

  // Calculate cache metrics
  const calculateCacheMetrics = useCallback((entries: CacheEntry[]) => {
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    setTotalCacheSize(totalSize);
    
    const cachedCount = entries.filter(entry => entry.status === 'cached').length;
    const hitRate = entries.length > 0 ? (cachedCount / entries.length) * 100 : 0;
    setCacheHitRate(hitRate);
  }, []);

  // Auto-analyze on mount
  useEffect(() => {
    if (autoAnalyze) {
      analyzeCaching();
    }
  }, [autoAnalyze, analyzeCaching]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get status icon and color
  const getStatusDisplay = (status: CacheEntry['status']) => {
    switch (status) {
      case 'cached':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
      case 'stale':
        return { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'expired':
        return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
      case 'no-cache':
        return { icon: <Info className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' };
      default:
        return { icon: <Info className="w-4 h-4" />, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  // Get type icon
  const getTypeIcon = (type: CacheEntry['type']) => {
    switch (type) {
      case 'static': return <Database className="w-4 h-4" />;
      case 'dynamic': return <RefreshCw className="w-4 h-4" />;
      case 'api': return <Zap className="w-4 h-4" />;
      case 'image': return <Database className="w-4 h-4" />;
      case 'font': return <Database className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Caching Strategy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimize caching for better performance
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="aggressive">Aggressive</option>
              <option value="balanced">Balanced</option>
              <option value="conservative">Conservative</option>
            </select>
            
            <button
              onClick={analyzeCaching}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Analyze Caching
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isAnalyzing && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm text-blue-700 dark:text-blue-300 mb-2">
            <span>Analyzing caching strategies...</span>
            <span>{Math.round(analysisProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {cacheEntries.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {cacheEntries.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Resources</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {cacheEntries.filter(e => e.status === 'cached').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Properly Cached</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {cacheHitRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Cache Hit Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatFileSize(totalCacheSize)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
            </div>
          </div>
        </div>
      )}

      {/* Cache Entries List */}
      {cacheEntries.length > 0 && (
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Cache Analysis
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cacheEntries.map((entry, index) => {
              const statusDisplay = getStatusDisplay(entry.status);
              return (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statusDisplay.bg}`}>
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {entry.url.split('/').pop() || entry.url}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.url}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusDisplay.bg} ${statusDisplay.color}`}>
                        {entry.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {entry.type}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatFileSize(entry.size)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cache Control</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.cacheControl}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max Age</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.maxAge ? `${Math.round(entry.maxAge / 3600)}h` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {entry.recommendations.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recommendations</div>
                      <div className="space-y-1">
                        {entry.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {cacheEntries.length === 0 && !isAnalyzing && (
        <div className="px-6 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Cache Analysis
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click "Analyze Caching" to review your caching strategy
          </p>
          <button
            onClick={analyzeCaching}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Analysis
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {cacheEntries.length > 0 ? `${cacheEntries.length} resources analyzed` : 'Ready to analyze'}
          </span>
          <span>
            Strategy: {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
