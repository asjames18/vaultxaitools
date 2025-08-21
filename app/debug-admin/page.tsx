import { createEnhancedClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export default async function DebugAdminPage() {
  const supabase = await createEnhancedClient();
  
  // Check session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // Check user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // Get cookie information
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Check for specific Supabase cookies
  const supabaseCookies = allCookies.filter(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('session')
  );
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Authentication Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">All Cookies ({allCookies.length})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' })), null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supabase Cookies ({supabaseCookies.length})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(supabaseCookies.map(c => ({ name: c.name, value: c.value.substring(0, 50) + '...' })), null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify({ session, sessionError }, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify({ user, authError }, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify({
                hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 