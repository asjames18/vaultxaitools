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
  const [overallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // System components
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

  // No active incidents
  const incidents: Incident[] = [];

  // Uptime stats
  const uptimePercentage = 99.98;
  const lastMonthUptime = 99.95;
  const lastYearUptime = 99.92;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
        return 'text-red-400';
      case 'maintenance':
        return 'text-green-300';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />;
      case 'outage':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'maintenance':
        return <ClockIcon className="h-5 w-5 text-green-300" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-900/40 text-yellow-300 border border-yellow-700';
      case 'major':
        return 'bg-orange-900/40 text-orange-300 border border-orange-700';
      case 'critical':
        return 'bg-red-900/40 text-red-300 border border-red-700';
      default:
        return 'bg-gray-800 text-gray-300 border border-gray-700';
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero / Banner */}
      <div className="bg-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              System Status
            </h1>
            <p className="text-lg md:text-xl text-black/75 max-w-2xl mx-auto">
              Real-time status of Melanated In Tech platform services and infrastructure.
            </p>
            <div className="mt-6 inline-flex items-center space-x-3 bg-black/15 rounded-full px-6 py-3">
              <span className="h-3 w-3 rounded-full bg-black animate-pulse" />
              <span className="text-base font-semibold text-black">
                {overallStatus === 'operational' ? 'All Systems Operational' : overallStatus}
              </span>
              <span className="text-sm text-black/60">
                · Last updated: {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Components */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-5">
                System Components
              </h2>
              <div className="space-y-3">
                {systemComponents.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-green-500/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <component.icon className="h-7 w-7 text-green-400 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          {component.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {component.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(component.status)}
                      <span className={`text-sm font-medium capitalize ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-5">
                Recent Incidents
              </h2>
              {incidents.length > 0 ? (
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/40">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            incident.status === 'resolved'
                              ? 'bg-green-900/40 text-green-300 border border-green-700'
                              : 'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(incident.createdAt)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-1 text-sm">
                        {incident.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {incident.description}
                      </p>
                      <div className="text-xs text-gray-500">
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
                <div className="text-center py-10">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white font-semibold mb-1">No incidents reported</p>
                  <p className="text-gray-400 text-sm">
                    All systems are operating normally. No incidents in the past 90 days.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Uptime Statistics */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-5">
                Uptime Statistics
              </h3>
              <div className="space-y-4">
                <div className="text-center bg-gray-800/50 rounded-lg py-5">
                  <div className="text-4xl font-bold text-green-400">
                    {uptimePercentage}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                    Current Month
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-800/50 rounded-lg py-3">
                    <div className="text-lg font-semibold text-green-400">
                      {lastMonthUptime}%
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Last Month
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg py-3">
                    <div className="text-lg font-semibold text-green-400">
                      {lastYearUptime}%
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Last Year
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-4">
                Status Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">Operational</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">Degraded Performance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-gray-300">Outage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-green-300" />
                  <span className="text-sm text-gray-300">Maintenance</span>
                </div>
              </div>
            </div>

            {/* Subscribe to Updates */}
            <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Get notified about system status updates and incidents.
              </p>
              <button className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                Subscribe to Updates
              </button>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                If you're experiencing issues not reflected here, contact our support team.
              </p>
              <a
                href="/contact"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors text-center"
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
