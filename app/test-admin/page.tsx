'use client';

import { useState } from 'react';

export default function TestAdminPage() {
  const [message, setMessage] = useState('Loading...');

  const testUserAPI = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setMessage(`API Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🛠️ Test Admin Portal
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Admin Access Test
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This page bypasses all authentication to test admin functionality.
          </p>
          
          <button
            onClick={testUserAPI}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Users API
          </button>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {message}
            </pre>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/api/admin/users"
              target="_blank"
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">View Users API</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Direct API access</p>
            </a>
            
            <a
              href="/api/admin/automation"
              target="_blank" 
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">Automation API</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check automation status</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 