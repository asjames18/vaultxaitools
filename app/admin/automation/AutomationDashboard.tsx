'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { getUserRole } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Clock, 
  BarChart3, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Database,
  Settings,
  Activity,
  Zap,
  Timer,
  Eye,
  RotateCcw
} from 'lucide-react';

interface AutomationStatus {
  isRunning: boolean;
  lastRun?: string;
  status?: string;
  toolsFound?: number;
  errors?: string[];
}

interface DataRefreshStatus {
  isRefreshing: boolean;
  lastRefresh?: string;
  stats?: {
    totalTools: number;
    totalReviews: number;
    totalUsers: number;
    totalCategories: number;
    avgRating: number;
  };
  autoRefreshEnabled: boolean;
}

export default function AutomationDashboard() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [dataRefreshStatus, setDataRefreshStatus] = useState<DataRefreshStatus>({
    isRefreshing: false,
    autoRefreshEnabled: false
  });
  const [loading, setLoading] = useState(true);
  // Bypass authorization for debugging
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [runningOperation, setRunningOperation] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // const checkAuth = async () => {
  //   // temporarily disabled
  // };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/admin/automation');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching automation status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataRefreshStatus = async () => {
    try {
      // Get current stats from database
      const { data: tools, error } = await supabase
        .from('tools')
        .select('rating, review_count, weekly_users, category');
      
      if (!error && tools) {
        const stats = {
          totalTools: tools.length,
          totalReviews: tools.reduce((sum, tool) => sum + (tool.review_count || 0), 0),
          totalUsers: tools.reduce((sum, tool) => sum + (tool.weekly_users || 0), 0),
          totalCategories: new Set(tools.map(tool => tool.category)).size,
          avgRating: tools.length > 0 
            ? tools.reduce((sum, tool) => sum + (tool.rating || 0), 0) / tools.length 
            : 0
        };
        
        setDataRefreshStatus(prev => ({
          ...prev,
          stats,
          lastRefresh: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error fetching data refresh status:', error);
    }
  };

  useEffect(() => {
    // Skip auth check; directly fetch status
    fetchStatus();

    // Set up real-time subscription for stats updates
    const subscription = supabase
      .channel('admin-stats-updates')
      .on('broadcast', { event: 'stats-refresh' }, (payload) => {
        if (payload.payload?.stats) {
          setDataRefreshStatus(prev => ({
            ...prev,
            stats: payload.payload.stats,
            lastRefresh: payload.payload.timestamp
          }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const runAutomation = async (type: string) => {
    setRunningOperation(type);
    try {
      const response = await fetch('/api/admin/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: type })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${type} automation started:`, result);
        
        // Refresh status after starting
        setTimeout(fetchStatus, 1000);
      } else {
        console.error(`Failed to start ${type} automation`);
      }
    } catch (error) {
      console.error(`Error starting ${type} automation:`, error);
    } finally {
      setRunningOperation(null);
    }
  };

  const refreshData = async () => {
    setDataRefreshStatus(prev => ({ ...prev, isRefreshing: true }));
    
    try {
      const response = await fetch('/api/admin/refresh-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tools' })
      });

      if (response.ok) {
        console.log('Data refresh triggered');
        await fetchDataRefreshStatus();
      } else {
        console.error('Failed to refresh data');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setDataRefreshStatus(prev => ({ ...prev, isRefreshing: false }));
    }
  };

  const toggleAutoRefresh = async () => {
    const newStatus = !dataRefreshStatus.autoRefreshEnabled;
    
    try {
      const response = await fetch('/api/admin/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'toggle-auto-refresh',
          enabled: newStatus 
        })
      });

      if (response.ok) {
        setDataRefreshStatus(prev => ({
          ...prev,
          autoRefreshEnabled: newStatus
        }));
      }
    } catch (error) {
      console.error('Error toggling auto refresh:', error);
    }
  };

  // Skip authorized check

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading automation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Automation Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage AI tools discovery and data refresh automation
          </p>
        </div>

        {/* Stats Overview */}
        {dataRefreshStatus.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tools</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dataRefreshStatus.stats.totalTools}
                  </p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(dataRefreshStatus.stats.totalReviews / 1000000).toFixed(1)}M
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(dataRefreshStatus.stats.totalUsers / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dataRefreshStatus.stats.totalCategories}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dataRefreshStatus.stats.avgRating.toFixed(1)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        {/* Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* AI Tools Discovery */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI Tools Discovery
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find and add new AI tools from various sources
                </p>
              </div>
              <button
                onClick={() => runAutomation('run')}
                disabled={runningOperation === 'run'}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  runningOperation === 'run'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {runningOperation === 'run' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Discovery
                  </>
                )}
              </button>
            </div>
            
            {status && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last run: {status.lastRun ? new Date(status.lastRun).toLocaleString() : 'Never'}
              </div>
            )}
          </div>

          {/* Data Refresh Control */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Data Refresh
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Update statistics and invalidate caches
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAutoRefresh}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    dataRefreshStatus.autoRefreshEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Timer className="w-4 h-4" />
                  Auto: {dataRefreshStatus.autoRefreshEnabled ? 'ON' : 'OFF'}
                </button>
                
                <button
                  onClick={refreshData}
                  disabled={dataRefreshStatus.isRefreshing}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    dataRefreshStatus.isRefreshing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {dataRefreshStatus.isRefreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Refresh Now
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {dataRefreshStatus.lastRefresh && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last refresh: {new Date(dataRefreshStatus.lastRefresh).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Automation Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Automation Schedule
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Frequency</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Daily</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">6:00 AM UTC</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Next Run</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 