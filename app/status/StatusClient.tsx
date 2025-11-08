'use client';

import { useState, useEffect } from 'react';

// Simple SVG icons to avoid import issues
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ServerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const GlobeAltIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CircleStackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

interface SystemComponent {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastChecked: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function StatusClient() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock system components (in a real app, this would come from an API)
  const systemComponents: SystemComponent[] = [
    {
      id: 'api',
      name: 'API Services',
      status: 'operational',
      description: 'Core API endpoints and data services',
      icon: ServerIcon,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'database',
      name: 'Database',
      status: 'operational',
      description: 'Supabase database and data storage',
      icon: CircleStackIcon,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'website',
      name: 'Website',
      status: 'operational',
      description: 'Main website and user interface',
      icon: GlobeAltIcon,
      lastChecked: new Date().toISOString(),
    },
    {
      id: 'auth',
      name: 'Authentication',
      status: 'operational',
      description: 'User authentication and authorization',
      icon: ShieldCheckIcon,
      lastChecked: new Date().toISOString(),
    },
  ];

  // Mock incidents (in a real app, this would come from an API)
  const incidents: Incident[] = [
    {
      id: '1',
      title: 'Scheduled Maintenance - Database Optimization',
      status: 'resolved',
      severity: 'minor',
      description: 'Database performance optimization completed successfully. No user data was affected.',
      createdAt: '2024-07-10T02:00:00Z',
      updatedAt: '2024-07-10T04:00:00Z',
      resolvedAt: '2024-07-10T04:00:00Z',
    },
    {
      id: '2',
      title: 'API Response Time Degradation',
      status: 'resolved',
      severity: 'major',
      description: 'Increased API response times were detected and resolved. All services are now operating normally.',
      createdAt: '2024-07-08T14:30:00Z',
      updatedAt: '2024-07-08T16:45:00Z',
      resolvedAt: '2024-07-08T16:45:00Z',
    },
  ];

  // Calculate uptime percentage (mock data)
  const uptimePercentage = 99.98;
  const lastMonthUptime = 99.95;
  const lastYearUptime = 99.92;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'outage':
        return 'text-red-600 dark:text-red-400';
      case 'maintenance':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'outage':
        return <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'maintenance':
        return <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'major':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System Status
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Real-time status of VaultX Tech platform services and infrastructure.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(overallStatus)}
                <span className="text-lg font-semibold capitalize">
                  {overallStatus === 'operational' ? 'All Systems Operational' : overallStatus}
                </span>
              </div>
              <div className="text-sm text-blue-200">
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Components */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                System Components
              </h2>
              <div className="space-y-4">
                {systemComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <component.icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {component.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {component.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(component.status)}
                      <span className={`font-medium capitalize ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Recent Incidents
              </h2>
              {incidents.length > 0 ? (
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            incident.status === 'resolved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(incident.createdAt)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {incident.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {incident.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {incident.resolvedAt ? (
                          <span>Resolved: {formatDate(incident.resolvedAt)}</span>
                        ) : (
                          <span>Last updated: {formatDate(incident.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No recent incidents. All systems are operating normally.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Uptime Statistics */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Uptime Statistics
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {uptimePercentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Current Month
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lastMonthUptime}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Last Month
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {lastYearUptime}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Last Year
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Operational</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Degraded Performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Outage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Maintenance</span>
                </div>
              </div>
            </div>

            {/* Subscribe to Updates */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Stay Updated
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Get notified about system status updates and incidents.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Subscribe to Updates
              </button>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                If you're experiencing issues not reflected here, contact our support team.
              </p>
              <a 
                href="/contact" 
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 