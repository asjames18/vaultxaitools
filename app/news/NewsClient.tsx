'use client';

import { createClient } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';

export default function NewsClient() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Test Supabase client creation and simple query
  const testDatabase = async () => {
    try {
      setIsLoading(true);
      setDebugInfo('Starting database test...');
      console.log('🔍 Starting database test...');
      
      // Step 1: Create client
      const supabase = createClient();
      setDebugInfo(prev => prev + '\n✅ Supabase client created successfully');
      console.log('✅ Supabase client created successfully');
      
      // Step 2: Test simple query without timeout
      setDebugInfo(prev => prev + '\n🔄 Testing database query...');
      setDebugInfo(prev => prev + '\n⏳ Waiting for query response...');
      
      // Make the query and see what happens
      const result = await supabase
        .from('ai_news')
        .select('count')
        .limit(1);
      
      console.log('🔍 Query result:', result);
      
      if (result.error) {
        console.error('❌ Database query error:', result.error);
        setTestResult(`Query Error: ${result.error.message}`);
        setDebugInfo(prev => prev + `\n❌ Error: ${result.error.message}`);
      } else {
        console.log('✅ Database query successful');
        setTestResult('Database connection successful!');
        setDebugInfo(prev => prev + '\n✅ Query successful - data received');
      }
      
    } catch (error: any) {
      console.error('❌ Database test error:', error);
      setTestResult(`Test Error: ${error.message}`);
      setDebugInfo(prev => prev + `\n❌ Exception: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testDatabase();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI News & Updates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Stay updated with the latest developments in AI technology, tool updates, and industry insights.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔍 Database Connection Test
            </h2>
            <button
              onClick={testDatabase}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Testing...' : 'Retry Test'}
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're now testing a simple database query to ensure the connection works properly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🔍 Query Test</h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                Testing SELECT count FROM ai_news LIMIT 1
              </p>
            </div>
            
            <div className="p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Progress</h3>
              <p className="text-green-600 dark:text-green-300 text-sm">
                Step 1: Basic client import ✓<br/>
                Step 2: Client creation test ✓<br/>
                Step 3: Database query test 🔄<br/>
                Step 4: Full news loading (coming next)
              </p>
            </div>
          </div>
          
          {/* Test Results Display */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📊 Test Results</h3>
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-600 dark:text-gray-400">Running database test...</span>
              </div>
            ) : (
              <div className={`p-3 rounded-lg ${
                testResult.includes('successful') 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}>
                <strong>Result:</strong> {testResult}
              </div>
            )}
          </div>

          {/* Debug Information */}
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🐛 Debug Information</h3>
            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded text-sm font-mono text-gray-800 dark:text-gray-200 max-h-40 overflow-y-auto">
              {debugInfo || 'No debug information yet...'}
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📋 Current Status</h3>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-2">
              <li>• ✅ Page loads without runtime errors</li>
              <li>• ✅ Supabase client import working</li>
              <li>• ✅ Client creation successful</li>
              <li>• 🔄 Database query test in progress</li>
              <li>• ⏳ Ready for full news loading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 