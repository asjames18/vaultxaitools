'use client';

import React, { useState, useCallback } from 'react';
import { 
  DocumentArrowDownIcon, 
  TableCellsIcon, 
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../AdminLoadingStates';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  icon: React.ReactNode;
}

interface ExportSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  format: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

interface DataExportProps {
  data: any[];
  filename?: string;
  onExport?: (format: string, data: any[]) => void;
  className?: string;
}

const exportFormats: ExportFormat[] = [
  {
    id: 'csv',
    name: 'CSV',
    extension: '.csv',
    mimeType: 'text/csv',
    icon: <TableCellsIcon className="h-5 w-5" />
  },
  {
    id: 'json',
    name: 'JSON',
    extension: '.json',
    mimeType: 'application/json',
    icon: <DocumentTextIcon className="h-5 w-5" />
  },
  {
    id: 'excel',
    name: 'Excel',
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    icon: <TableCellsIcon className="h-5 w-5" />
  },
  {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    mimeType: 'application/pdf',
    icon: <DocumentTextIcon className="h-5 w-5" />
  }
];

export function DataExport({ data, filename = 'export', onExport, className = '' }: DataExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    format: string;
    filename: string;
    timestamp: Date;
    status: 'success' | 'error';
    size?: string;
  }>>([]);

  const handleExport = useCallback(async () => {
    if (!data || data.length === 0) return;

    setIsExporting(true);
    const startTime = Date.now();

    try {
      const format = exportFormats.find(f => f.id === selectedFormat);
      if (!format) throw new Error('Invalid format');

      let exportData: string | Blob;
      let finalFilename = `${filename}_${new Date().toISOString().split('T')[0]}${format.extension}`;

      switch (selectedFormat) {
        case 'csv':
          exportData = convertToCSV(data);
          break;
        case 'json':
          exportData = JSON.stringify(data, null, 2);
          break;
        case 'excel':
          // For Excel, we'd typically use a library like xlsx
          exportData = convertToCSV(data); // Fallback to CSV for now
          finalFilename = finalFilename.replace('.xlsx', '.csv');
          break;
        case 'pdf':
          // For PDF, we'd typically use a library like jsPDF
          exportData = JSON.stringify(data, null, 2); // Fallback to JSON for now
          finalFilename = finalFilename.replace('.pdf', '.json');
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Create download link
      const blob = new Blob([exportData], { type: format.mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Record successful export
      const exportRecord = {
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        format: selectedFormat,
        filename: finalFilename,
        timestamp: new Date(),
        status: 'success' as const,
        size: formatFileSize(blob.size)
      };

      setExportHistory(prev => [exportRecord, ...prev.slice(0, 9)]); // Keep last 10

      // Call custom export handler if provided
      if (onExport) {
        onExport(selectedFormat, data);
      }

    } catch (error) {
      console.error('Export failed:', error);
      
      // Record failed export
      const exportRecord = {
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        format: selectedFormat,
        filename: `${filename}_${new Date().toISOString().split('T')[0]}`,
        timestamp: new Date(),
        status: 'error' as const
      };

      setExportHistory(prev => [exportRecord, ...prev.slice(0, 9)]);
    } finally {
      setIsExporting(false);
    }
  }, [data, selectedFormat, filename, onExport]);

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatIcon = (formatId: string) => {
    const format = exportFormats.find(f => f.id === formatId);
    return format?.icon || <DocumentArrowDownIcon className="h-5 w-5" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Export Data
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {data.length} records available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {format.icon}
                  <span className="ml-2 text-sm font-medium">{format.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={isExporting || data.length === 0}
              className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Info */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Selected Format:</strong> {exportFormats.find(f => f.id === selectedFormat)?.name}</p>
            <p><strong>File Extension:</strong> {exportFormats.find(f => f.id === selectedFormat)?.extension}</p>
            <p><strong>Records:</strong> {data.length.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Exports
          </h4>
          
          <div className="space-y-3">
            {exportHistory.map((exportRecord) => (
              <div
                key={exportRecord.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getFormatIcon(exportRecord.format)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {exportRecord.format.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exportRecord.filename}
                  </div>
                  
                  {exportRecord.size && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {exportRecord.size}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {exportRecord.timestamp.toLocaleTimeString()}
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    exportRecord.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {exportRecord.status === 'success' ? (
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                    )}
                    {exportRecord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Scheduled Export Component
interface ScheduledExportProps {
  schedules: ExportSchedule[];
  onScheduleChange?: (schedule: ExportSchedule) => void;
  onScheduleToggle?: (scheduleId: string, enabled: boolean) => void;
  className?: string;
}

export function ScheduledExport({ schedules, onScheduleChange, onScheduleToggle, className = '' }: ScheduledExportProps) {
  const [newSchedule, setNewSchedule] = useState<Partial<ExportSchedule>>({
    name: '',
    frequency: 'daily',
    time: '09:00',
    format: 'csv',
    enabled: true
  });

  const handleCreateSchedule = () => {
    if (!newSchedule.name) return;

    const schedule: ExportSchedule = {
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newSchedule.name,
      frequency: newSchedule.frequency || 'daily',
      time: newSchedule.time || '09:00',
      format: newSchedule.format || 'csv',
      enabled: newSchedule.enabled || true
    };

    // Reset form
    setNewSchedule({
      name: '',
      frequency: 'daily',
      time: '09:00',
      format: 'csv',
      enabled: true
    });

    // Call handler
    if (onScheduleChange) {
      onScheduleChange(schedule);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const getNextRunDate = (schedule: ExportSchedule) => {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    return nextRun;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Create New Schedule */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Create Scheduled Export
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Schedule Name"
            value={newSchedule.name}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={newSchedule.frequency}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          
          <input
            type="time"
            value={newSchedule.time}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={newSchedule.format}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, format: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {exportFormats.map(format => (
              <option key={format.id} value={format.id}>{format.name}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleCreateSchedule}
          disabled={!newSchedule.name}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Create Schedule
        </button>
      </div>

      {/* Existing Schedules */}
      {schedules.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Scheduled Exports
          </h4>
          
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">{schedule.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getFrequencyLabel(schedule.frequency)} at {schedule.time} • {schedule.format.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Next run: {getNextRunDate(schedule).toLocaleDateString()}
                    </p>
                    {schedule.lastRun && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last: {schedule.lastRun.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={(e) => onScheduleToggle?.(schedule.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
