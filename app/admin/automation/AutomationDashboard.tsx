'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import AdminAuthWrapper from '../AdminAuthWrapper';
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
  summary?: {
    errors: number;
    newTools: number;
    updatedTools: number;
  };
  sources?: { [key: string]: number };
  categories?: { [key: string]: number };
  newsCount?: number;
  recentNews?: string[];
}

interface DataRefreshStatus {
  isRefreshing: boolean;
  lastRefresh?: string;
  stats?: {
    totalTools: number;
    totalReviews: number;
    totalCategories: number;
  };
  autoRefreshEnabled: boolean;
}

function AutomationDashboardContent() {
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
        console.log('Automation status data:', data);
        console.log('Sources:', data.sources);
        console.log('Categories:', data.categories);
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
        .select('review_count, category');
      
      if (!error && tools) {
        const stats = {
          totalTools: tools.length,
          totalReviews: tools.reduce((sum: number, tool: any) => sum + (tool.review_count || 0), 0),
          totalCategories: new Set(tools.map((tool: any) => tool.category)).size,
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
      .on('broadcast', { event: 'stats-refresh' }, (payload: any) => {
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
        const errorData = await response.json();
        alert(`Failed to start automation: ${errorData.error || response.statusText}`);
        console.error(`Failed to start ${type} automation`, errorData);
      }
    } catch (error) {
      alert(`Error starting automation: ${error}`);
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dataRefreshStatus.stats.totalCategories}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
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
                onClick={() => runAutomation('run-automation')}
                disabled={runningOperation === 'run-automation'}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  runningOperation === 'run-automation'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {runningOperation === 'run-automation' ? (
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

        {/* Automation Analytics */}
        {status && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Automation Analytics
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.lastRun ? new Date(status.lastRun).toLocaleString() : 'Never'}</div>
                <div className="text-blue-100 text-sm">Last Run</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.status || 'Unknown'}</div>
                <div className="text-green-100 text-sm">Status</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.toolsFound || 0}</div>
                <div className="text-purple-100 text-sm">Tools Found</div>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.newsCount || 0}</div>
                <div className="text-cyan-100 text-sm">News Articles</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${(status.summary?.errors || 0) > 0 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'}`}>
                <div className="text-2xl font-bold">{status.summary?.errors || 0}</div>
                <div className="text-gray-100 text-sm">Errors</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.summary?.newTools || 0}</div>
                <div className="text-orange-100 text-sm">New Tools</div>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{status.summary?.updatedTools || 0}</div>
                <div className="text-teal-100 text-sm">Updated Tools</div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">{(status.recentNews || []).length}</div>
                <div className="text-indigo-100 text-sm">Recent News</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Sources</p>
                <div className="text-gray-900 dark:text-white text-sm">
                  {status.sources && Object.keys(status.sources).length > 0 ? (
                    <ul className="space-y-1">
                      {Object.entries(status.sources).map(([source, count]) => (
                        <li key={source} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{source}:</span>
                          <span className="font-medium">{count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">No data</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Categories</p>
                <div className="text-gray-900 dark:text-white text-sm">
                  {status.categories && Object.keys(status.categories).length > 0 ? (
                    <ul className="space-y-1">
                      {Object.entries(status.categories).map(([cat, count]) => (
                        <li key={cat} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{cat}:</span>
                          <span className="font-medium">{count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">No data</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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

export default function AutomationDashboard() {
  return (
    <AdminAuthWrapper>
      {(user) => <AutomationDashboardContent />}
    </AdminAuthWrapper>
  );
}