'use client';

import { useState, useEffect, useCallback } from 'react';
import { Image, FileText, Code, Download, Upload, Settings, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ResourceInfo {
  type: 'image' | 'script' | 'stylesheet' | 'font' | 'other';
  url: string;
  size: number;
  loadTime: number;
  status: 'optimized' | 'needs-optimization' | 'critical' | 'unknown';
  recommendations: string[];
}

interface ResourceOptimizerProps {
  className?: string;
  autoScan?: boolean;
  showAdvanced?: boolean;
}

export default function ResourceOptimizer({ 
  className = '', 
  autoScan = true, 
  showAdvanced = false 
}: ResourceOptimizerProps) {
  const [resources, setResources] = useState<ResourceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [optimizationMode, setOptimizationMode] = useState<'basic' | 'aggressive' | 'custom'>('basic');

  // Scan page resources
  const scanResources = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const newResources: ResourceInfo[] = [];
      
      // Get all resource entries from Performance API
      const resourceEntries = performance.getEntriesByType('resource');
      
      for (let i = 0; i < resourceEntries.length; i++) {
        const entry = resourceEntries[i] as PerformanceResourceTiming;
        const progress = ((i + 1) / resourceEntries.length) * 100;
        setScanProgress(progress);
        
        // Analyze resource
        const resource = await analyzeResource(entry);
        if (resource) {
          newResources.push(resource);
        }
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      setResources(newResources);
      calculateTotalSavings(newResources);
      
    } catch (error) {
      console.error('Error scanning resources:', error);
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  }, []);

  // Analyze individual resource
  const analyzeResource = async (entry: PerformanceResourceTiming): Promise<ResourceInfo | null> => {
    try {
      const url = entry.name;
      const loadTime = entry.duration;
      const size = entry.transferSize || 0;
      
      // Determine resource type
      const type = getResourceType(url);
      
      // Analyze optimization status
      const status = await analyzeOptimizationStatus(url, type, size, loadTime);
      
      // Generate recommendations
      const recommendations = generateRecommendations(url, type, size, loadTime, status);
      
      return {
        type,
        url,
        size,
        loadTime,
        status,
        recommendations
      };
    } catch (error) {
      console.error('Error analyzing resource:', error);
      return null;
    }
  };

  // Get resource type from URL
  const getResourceType = (url: string): ResourceInfo['type'] => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(extension || '')) {
      return 'image';
    } else if (['js'].includes(extension || '')) {
      return 'script';
    } else if (['css'].includes(extension || '')) {
      return 'stylesheet';
    } else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension || '')) {
      return 'font';
    } else {
      return 'other';
    }
  };

  // Analyze optimization status
  const analyzeOptimizationStatus = async (
    url: string, 
    type: ResourceInfo['type'], 
    size: number, 
    loadTime: number
  ): Promise<ResourceInfo['status']> => {
    // Basic heuristics for optimization status
    if (type === 'image') {
      if (size > 500 * 1024) return 'needs-optimization'; // >500KB
      if (loadTime > 1000) return 'needs-optimization'; // >1s load time
      return 'optimized';
    }
    
    if (type === 'script') {
      if (size > 100 * 1024) return 'needs-optimization'; // >100KB
      if (loadTime > 500) return 'needs-optimization'; // >500ms load time
      return 'optimized';
    }
    
    if (type === 'stylesheet') {
      if (size > 50 * 1024) return 'needs-optimization'; // >50KB
      if (loadTime > 300) return 'needs-optimization'; // >300ms load time
      return 'optimized';
    }
    
    if (type === 'font') {
      if (size > 200 * 1024) return 'needs-optimization'; // >200KB
      return 'optimized';
    }
    
    return 'unknown';
  };

  // Generate optimization recommendations
  const generateRecommendations = (
    url: string, 
    type: ResourceInfo['type'], 
    size: number, 
    loadTime: number, 
    status: ResourceInfo['status']
  ): string[] => {
    const recs: string[] = [];
    
    if (status === 'optimized') {
      recs.push('Resource is well optimized');
      return recs;
    }
    
    switch (type) {
      case 'image':
        if (size > 500 * 1024) {
          recs.push('Convert to WebP format for better compression');
          recs.push('Implement lazy loading for images below the fold');
          recs.push('Use responsive images with srcset');
        }
        if (loadTime > 1000) {
          recs.push('Optimize image dimensions to actual display size');
          recs.push('Consider using a CDN for faster delivery');
        }
        break;
        
      case 'script':
        if (size > 100 * 1024) {
          recs.push('Implement code splitting and lazy loading');
          recs.push('Minify and compress JavaScript files');
          recs.push('Consider using tree shaking to remove unused code');
        }
        if (loadTime > 500) {
          recs.push('Load non-critical scripts asynchronously');
          recs.push('Use module/nomodule pattern for modern browsers');
        }
        break;
        
      case 'stylesheet':
        if (size > 50 * 1024) {
          recs.push('Remove unused CSS rules');
          recs.push('Minify and compress CSS files');
          recs.push('Consider critical CSS inlining');
        }
        if (loadTime > 300) {
          recs.push('Load CSS asynchronously for non-critical styles');
          recs.push('Use media queries to load styles conditionally');
        }
        break;
        
      case 'font':
        if (size > 200 * 1024) {
          recs.push('Use font-display: swap for better performance');
          recs.push('Consider using system fonts for better performance');
          recs.push('Implement font subsetting for required characters only');
        }
        break;
    }
    
    // General recommendations
    if (loadTime > 1000) {
      recs.push('Enable HTTP/2 for multiplexed connections');
      recs.push('Implement proper caching headers');
    }
    
    return recs;
  };

  // Calculate total potential savings
  const calculateTotalSavings = useCallback((resourceList: ResourceInfo[]) => {
    let savings = 0;
    
    resourceList.forEach(resource => {
      if (resource.status === 'needs-optimization') {
        // Estimate 20-40% savings for optimization
        const estimatedSavings = resource.size * 0.3;
        savings += estimatedSavings;
      }
    });
    
    setTotalSavings(savings);
  }, []);

  // Auto-scan on mount
  useEffect(() => {
    if (autoScan) {
      scanResources();
    }
  }, [autoScan, scanResources]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format load time
  const formatLoadTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Get status icon and color
  const getStatusDisplay = (status: ResourceInfo['status']) => {
    switch (status) {
      case 'optimized':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' };
      case 'needs-optimization':
        return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'critical':
        return { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' };
      default:
        return { icon: <Info className="w-4 h-4" />, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  // Get type icon
  const getTypeIcon = (type: ResourceInfo['type']) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'script': return <Code className="w-4 h-4" />;
      case 'stylesheet': return <FileText className="w-4 h-4" />;
      case 'font': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Resource Optimizer
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyze and optimize page resources
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={optimizationMode}
              onChange={(e) => setOptimizationMode(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="basic">Basic</option>
              <option value="aggressive">Aggressive</option>
              <option value="custom">Custom</option>
            </select>
            
            <button
              onClick={scanResources}
              disabled={isScanning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Scan Resources
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isScanning && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm text-blue-700 dark:text-blue-300 mb-2">
            <span>Scanning resources...</span>
            <span>{Math.round(scanProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {resources.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {resources.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Resources</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {resources.filter(r => r.status === 'optimized').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Optimized</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {resources.filter(r => r.status === 'needs-optimization').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Needs Optimization</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatFileSize(totalSavings)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Potential Savings</div>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      {resources.length > 0 && (
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Resource Analysis
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {resources.map((resource, index) => {
              const statusDisplay = getStatusDisplay(resource.status);
              return (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${statusDisplay.bg}`}>
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {resource.url.split('/').pop() || resource.url}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.url}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusDisplay.bg} ${statusDisplay.color}`}>
                        {resource.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {resource.type}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatFileSize(resource.size)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Load Time</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatLoadTime(resource.loadTime)}
                      </div>
                    </div>
                  </div>
                  
                  {resource.recommendations.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recommendations</div>
                      <div className="space-y-1">
                        {resource.recommendations.map((rec, recIndex) => (
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
      {resources.length === 0 && !isScanning && (
        <div className="px-6 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Resources Scanned
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Click "Scan Resources" to analyze your page performance
          </p>
          <button
            onClick={scanResources}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Scanning
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {resources.length > 0 ? `${resources.length} resources analyzed` : 'Ready to scan'}
          </span>
          <span>
            Last scan: {resources.length > 0 ? new Date().toLocaleTimeString() : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}
