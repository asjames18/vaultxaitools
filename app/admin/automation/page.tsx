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
  Activity
} from 'lucide-react';

interface AutomationStatus {
  status: 'completed' | 'running' | 'no-data' | 'error';
  lastRun?: string;
  toolsFound?: number;
  sources?: Record<string, number>;
  categories?: Record<string, number>;
  summary?: {
    newTools: number;
    updatedTools: number;
    errors: number;
  };
}

export default function AutomationDashboard() {
  const [status, setStatus] = useState<AutomationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    fetchStatus();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/admin/login');
        return;
      }

      setUser(user);
      const role = await getUserRole(user);
      setUserRole(role);

      if (role !== 'admin') {
        router.push('/admin/unauthorized');
        return;
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin/login');
    }
  };

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/automation');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching status:', error);
      setStatus({ status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const runAutomation = async () => {
    try {
      setRunning(true);
      const response = await fetch('/api/admin/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'run-automation' }),
      });

      if (response.ok) {
        // Wait a bit and then refresh status
        setTimeout(() => {
          fetchStatus();
          setRunning(false);
        }, 2000);
      } else {
        throw new Error('Failed to start automation');
      }
    } catch (error) {
      console.error('Error running automation:', error);
      setRunning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'running': return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Tools Automation Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and control the automated AI tools discovery system
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(status?.status || 'no-data')}
                  <span className={`text-lg font-semibold ${getStatusColor(status?.status || 'no-data')}`}>
                    {status?.status === 'completed' ? 'Completed' : 
                     status?.status === 'running' ? 'Running' : 
                     status?.status === 'error' ? 'Error' : 'No Data'}
                  </span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Run</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {status?.lastRun ? formatDate(status.lastRun) : 'Never'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tools Found</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {status?.toolsFound || 0}
                </p>
              </div>
              <Database className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sources</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {status?.sources ? Object.keys(status.sources).length : 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Automation Controls
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manually trigger the AI tools discovery process
              </p>
            </div>
            <button
              onClick={runAutomation}
              disabled={running}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Automation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Stats */}
        {status && (status.sources || status.categories) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sources Breakdown */}
            {status.sources && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tools by Source
                </h3>
                <div className="space-y-3">
                  {Object.entries(status.sources).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{source}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Breakdown */}
            {status.categories && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tools by Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(status.categories).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Schedule Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Automation Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Frequency</p>
              <p className="font-medium text-gray-900 dark:text-white">Daily</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Time</p>
              <p className="font-medium text-gray-900 dark:text-white">6:00 AM UTC</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Next Run</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 