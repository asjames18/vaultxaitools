'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function DebugSupabasePage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [supabaseStatus, setSupabaseStatus] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    });

    // Test Supabase client
    const supabase = createClient();
    
    // Check if it's a mock client
    if (supabase.from && typeof supabase.from === 'function') {
      setSupabaseStatus('Real Supabase client loaded');
      
      // Test a simple query
      (async () => {
        try {
          const result = await supabase.from('tools').select('count').limit(1);
          if (result.error) {
            setTestResult(`Error: ${result.error.message}`);
          } else {
            setTestResult(`Success: ${JSON.stringify(result.data)}`);
          }
        } catch (error) {
          setTestResult(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      })();
    } else {
      setSupabaseStatus('Mock client loaded - environment variables not working');
      setTestResult('Cannot test with mock client');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Supabase Debug Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Environment Variables
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Supabase Client Status
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{supabaseStatus}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Query Result
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{testResult || 'Testing...'}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Troubleshooting Steps
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Check if .env.local file exists and has correct values</li>
            <li>Restart the development server after changing environment variables</li>
            <li>Verify that environment variable names start with NEXT_PUBLIC_</li>
            <li>Check for any syntax errors in .env.local file</li>
            <li>Make sure there are no spaces around the = sign in .env.local</li>
            <li>Try creating a new .env.local file from scratch</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
