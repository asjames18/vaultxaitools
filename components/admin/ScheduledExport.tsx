'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  DocumentArrowDownIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ExportSchedule {
  id: string;
  name: string;
  description: string;
  dataType: 'tools' | 'users' | 'reviews' | 'analytics' | 'all';
  format: 'csv' | 'json' | 'excel' | 'pdf';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  time: string;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  customCron?: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  recipients: string[];
  filters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ExportHistory {
  id: string;
  schedule_id: string;
  status: 'success' | 'failed' | 'running';
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  file_size?: string;
  file_url?: string;
  error_message?: string;
  records_exported?: number;
}

export default function ScheduledExport() {
  const [schedules, setSchedules] = useState<ExportSchedule[]>([]);
  const [history, setHistory] = useState<ExportHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExportSchedule | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockSchedules: ExportSchedule[] = [
      {
        id: '1',
        name: 'Daily Tools Export',
        description: 'Export all AI tools data daily for backup',
        dataType: 'tools',
        format: 'csv',
        frequency: 'daily',
        time: '02:00',
        enabled: true,
        lastRun: '2024-01-15T02:00:00Z',
        nextRun: '2024-01-16T02:00:00Z',
        recipients: ['admin@vaultxai.com'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'Weekly Analytics Report',
        description: 'Weekly analytics summary in Excel format',
        dataType: 'analytics',
        format: 'excel',
        frequency: 'weekly',
        time: '09:00',
        dayOfWeek: 1, // Monday
        enabled: true,
        lastRun: '2024-01-15T09:00:00Z',
        nextRun: '2024-01-22T09:00:00Z',
        recipients: ['team@vaultxai.com', 'analytics@vaultxai.com'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Monthly User Data',
        description: 'Monthly user statistics and growth data',
        dataType: 'users',
        format: 'json',
        frequency: 'monthly',
        time: '06:00',
        dayOfMonth: 1,
        enabled: false,
        lastRun: '2024-01-01T06:00:00Z',
        nextRun: '2024-02-01T06:00:00Z',
        recipients: ['admin@vaultxai.com'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-15T00:00:00Z'
      }
    ];

    const mockHistory: ExportHistory[] = [
      {
        id: '1',
        schedule_id: '1',
        status: 'success',
        started_at: '2024-01-15T02:00:00Z',
        completed_at: '2024-01-15T02:01:30Z',
        duration_ms: 90000,
        file_size: '2.4 MB',
        file_url: '/exports/tools-2024-01-15.csv',
        records_exported: 1250
      },
      {
        id: '2',
        schedule_id: '2',
        status: 'success',
        started_at: '2024-01-15T09:00:00Z',
        completed_at: '2024-01-15T09:00:45Z',
        duration_ms: 45000,
        file_size: '856 KB',
        file_url: '/exports/analytics-2024-01-15.xlsx',
        records_exported: 45
      },
      {
        id: '3',
        schedule_id: '1',
        status: 'failed',
        started_at: '2024-01-14T02:00:00Z',
        completed_at: '2024-01-14T02:00:15Z',
        duration_ms: 15000,
        error_message: 'Database connection timeout'
      }
    ];

    setSchedules(mockSchedules);
    setHistory(mockHistory);
  }, []);

  const toggleSchedule = async (scheduleId: string) => {
    setSchedules(prev => 
      prev.map(s => 
        s.id === scheduleId 
          ? { ...s, enabled: !s.enabled }
          : s
      )
    );
  };

  const deleteSchedule = async (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this export schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      setHistory(prev => prev.filter(h => h.schedule_id !== scheduleId));
    }
  };

  const runScheduleNow = async (schedule: ExportSchedule) => {
    setLoading(true);
    try {
      // Simulate export execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to history
      const newHistory: ExportHistory = {
        id: Date.now().toString(),
        schedule_id: schedule.id,
        status: 'success',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        duration_ms: 2000,
        file_size: '1.2 MB',
        file_url: `/exports/${schedule.dataType}-${new Date().toISOString().split('T')[0]}.${schedule.format}`,
        records_exported: Math.floor(Math.random() * 1000) + 100
      };
      
      setHistory(prev => [newHistory, ...prev]);
      
      // Update last run
      setSchedules(prev => 
        prev.map(s => 
          s.id === schedule.id 
            ? { ...s, lastRun: new Date().toISOString() }
            : s
        )
      );
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFrequencyText = (schedule: ExportSchedule) => {
    switch (schedule.frequency) {
      case 'daily':
        return `Daily at ${schedule.time}`;
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Weekly on ${days[schedule.dayOfWeek || 0]} at ${schedule.time}`;
      case 'monthly':
        return `Monthly on day ${schedule.dayOfMonth || 1} at ${schedule.time}`;
      case 'custom':
        return `Custom: ${schedule.customCron}`;
      default:
        return schedule.frequency;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'failed': return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'running': return <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'running': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            📅 Scheduled Exports
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automate data exports with custom schedules and delivery
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          New Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Schedules</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-green-600">
            {schedules.filter(s => s.enabled).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-purple-600">{history.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Exports</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-orange-600">
            {history.filter(h => h.status === 'success').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Export Schedules
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {schedule.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {schedule.description}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {schedule.dataType} • {schedule.format.toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {getFrequencyText(schedule)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {schedule.lastRun ? new Date(schedule.lastRun).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {schedule.nextRun ? new Date(schedule.nextRun).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      schedule.enabled 
                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                        : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {schedule.enabled ? 'Active' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => runScheduleNow(schedule)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                        title="Run now"
                      >
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleSchedule(schedule.id)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        title={schedule.enabled ? 'Pause schedule' : 'Enable schedule'}
                      >
                        {schedule.enabled ? (
                          <PauseIcon className="w-4 h-4" />
                        ) : (
                          <PlayIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingSchedule(schedule)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="Edit schedule"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete schedule"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium text-gray-900 dark:text-white">
            Export History
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Export
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {history.slice(0, 10).map((export_) => (
                <tr key={export_.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {schedules.find(s => s.id === export_.schedule_id)?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {export_.records_exported ? `${export_.records_exported} records` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(export_.status)}`}>
                      {getStatusIcon(export_.status)}
                      <span className="ml-1">{export_.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(export_.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {export_.duration_ms ? `${Math.round(export_.duration_ms / 1000)}s` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {export_.file_url ? (
                      <a 
                        href={export_.file_url} 
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <DocumentArrowDownIcon className="w-4 h-4" />
                        {export_.file_size || 'Download'}
                      </a>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Forms would go here */}
      {/* For now, we'll show a simple message */}
      {(showCreateForm || editingSchedule) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingSchedule ? 'Edit Export Schedule' : 'Create Export Schedule'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule creation form will be implemented here. For now, you can manage existing schedules.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingSchedule(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
