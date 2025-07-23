'use client';

import { useState } from 'react';

export default function TestAutomationPage() {
  const [message, setMessage] = useState('Ready to test automation...');
  const [loading, setLoading] = useState(false);

  const testAutomationAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/automation');
      const data = await response.json();
      setMessage(`Automation Status: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/refresh-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'tools' }),
      });
      const data = await response.json();
      setMessage(`Refresh Result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🤖 Test Automation Portal
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Automation Testing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Direct access to automation features for testing.
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={testAutomationAPI}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Check Automation Status'}
            </button>
            
            <button
              onClick={refreshData}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {message}
            </pre>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Automation Commands
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Terminal Commands</h3>
              <div className="space-y-2 text-sm">
                <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded">npm run refresh:data</code>
                <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded">npm run automation:combined</code>
                <code className="block bg-gray-100 dark:bg-gray-700 p-2 rounded">npm run grant-admin email@example.com</code>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">API Endpoints</h3>
              <div className="space-y-2 text-sm">
                <a href="/api/admin/automation" target="_blank" className="block text-blue-600 hover:underline">
                  /api/admin/automation
                </a>
                <a href="/api/admin/refresh-content" target="_blank" className="block text-blue-600 hover:underline">
                  /api/admin/refresh-content
                </a>
                <a href="/api/admin/users" target="_blank" className="block text-blue-600 hover:underline">
                  /api/admin/users
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 