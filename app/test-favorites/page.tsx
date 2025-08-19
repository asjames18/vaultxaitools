'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function TestFavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authMethod, setAuthMethod] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    // Try multiple authentication methods
    checkAllAuthMethods();
  }, []);

  // Monitor user state changes
  useEffect(() => {
    console.log('🔍 User state changed:', { user: !!user, email: user?.email });
    if (user) {
      setMessage(`User state updated: ${user.email}`);
    }
  }, [user]);

  // Monitor auth method changes
  useEffect(() => {
    console.log('🔍 Auth method changed:', authMethod);
  }, [authMethod]);

  const checkAllAuthMethods = async () => {
    setMessage('Checking all authentication methods...');
    console.log('🔍 Starting authentication check...');
    
    // Method 1: Check session
    try {
      console.log('🔍 Method 1: Checking session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔍 Session result:', { session: !!session, error: sessionError, hasToken: !!session?.access_token });
      
      if (sessionError) {
        console.log('❌ Session error:', sessionError);
        setMessage(`Session error: ${sessionError.message}`);
        return;
      }
      
      if (session?.access_token) {
        console.log('✅ Method 1: Session found with token');
        setMessage('✅ Method 1: Session found, getting user...');
        setAuthMethod('session');
        
        // Get user from session and set state
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('🔍 User result:', { user: !!user, error: userError, userEmail: user?.email });
        
        if (userError) {
          console.log('❌ User error:', userError);
          setMessage(`User error: ${userError.message}`);
          return;
        }
        
        if (user) {
          console.log('✅ User found:', user.email);
          setUser(user);
          setMessage(`✅ Method 1: Session found, user: ${user.email}`);
          loadFavorites();
          return;
        } else {
          console.log('❌ No user found despite having session');
          setMessage('Session found but no user data');
        }
      } else {
        console.log('❌ No session or access token');
      }
    } catch (error) {
      console.log('❌ Method 1 failed:', error);
    }

    // Method 2: Check user directly
    try {
      console.log('🔍 Method 2: Checking user directly...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('🔍 Direct user result:', { user: !!user, error: userError, userEmail: user?.email });
      
      if (userError) {
        console.log('❌ Direct user error:', userError);
      } else if (user) {
        console.log('✅ Method 2: User found directly:', user.email);
        setMessage('✅ Method 2: User found directly');
        setAuthMethod('direct');
        setUser(user);
        loadFavorites();
        return;
      }
    } catch (error) {
      console.log('❌ Method 2 failed:', error);
    }

    // Method 3: Check if we're authenticated on the main site
    try {
      console.log('🔍 Method 3: Checking main site...');
      const response = await fetch('/', { credentials: 'include' });
      console.log('🔍 Main site response:', response.status);
      
      if (response.ok) {
        setMessage('✅ Method 3: Main site accessible');
        setAuthMethod('main-site');
        // Try to get user info from main site
        await checkUserFromMainSite();
        return;
      }
    } catch (error) {
      console.log('❌ Method 3 failed:', error);
    }

    console.log('❌ All authentication methods failed');
    setMessage('❌ All authentication methods failed');
    setAuthMethod('none');
  };

  const checkUserFromMainSite = async () => {
    try {
      // Try to access a protected API endpoint
      const response = await fetch('/api/favorites', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.status === 401) {
        setMessage('Main site accessible but not authenticated');
      } else if (response.ok) {
        setMessage('Main site accessible and authenticated');
        // Try to get user info
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          loadFavorites();
        }
      }
    } catch (error) {
      setMessage(`Error checking main site auth: ${error}`);
    }
  };

  const checkUser = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setMessage('No session token');
        return;
      }

      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        setMessage(`Loaded ${data.favorites?.length || 0} favorites`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${response.status} - ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setMessage('No session token');
        return;
      }

      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        setMessage(`Loaded ${data.favorites?.length || 0} favorites`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${response.status} - ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (toolId: string) => {
    if (!user) {
      setMessage('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setMessage('No session token');
        return;
      }

      const isFavorite = favorites.includes(toolId);
      const action = isFavorite ? 'remove' : 'add';

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ toolId, action })
      });

      if (response.ok) {
        if (isFavorite) {
          setFavorites(prev => prev.filter(id => id !== toolId));
        } else {
          setFavorites(prev => [...prev, toolId]);
        }
        setMessage(`Favorite ${action}ed successfully`);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${response.status} - ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setMessage('Attempting to sign in...');
    try {
      // First try to get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setMessage('Already have a session, refreshing...');
        await supabase.auth.refreshSession();
        checkUser();
        return;
      }

      // Try to sign in with a test account
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setMessage(`Sign in error: ${error.message}`);
        
        // If it's an invalid credentials error, try to create an account
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Test account not found. Trying to create one...');
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'test@example.com',
            password: 'password123'
          });
          
          if (signUpError) {
            setMessage(`Sign up error: ${signUpError.message}`);
          } else {
            setMessage('Account created! Please check your email to confirm.');
          }
        }
      } else {
        setMessage('Sign in successful!');
        checkUser();
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      setMessage(`Sign in exception: ${error}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
    setMessage('Signed out');
    setAuthMethod('none');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Favorites Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Auth Method: <span className="font-mono">{authMethod}</span></p>
          </div>
          {user ? (
            <div>
              <p className="text-green-600 mb-2">✅ Signed in as: {user.email}</p>
              <p className="text-sm text-gray-600 mb-2">User ID: {user.id}</p>
              <button
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p className="text-red-600 mb-2">❌ Not signed in</p>
              <div className="space-y-2">
                <button
                  onClick={checkAllAuthMethods}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Check All Auth Methods
                </button>
                <button
                  onClick={signIn}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                >
                  Sign In (Test)
                </button>
                <button
                  onClick={async () => {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      const { data: { user } } = await supabase.auth.getUser();
                      
                      let debugInfo = '=== DEBUG INFO ===\n';
                      debugInfo += `Session exists: ${!!session}\n`;
                      debugInfo += `Session token: ${session?.access_token ? 'Yes' : 'No'}\n`;
                      debugInfo += `User exists: ${!!user}\n`;
                      if (user) {
                        debugInfo += `User email: ${user.email}\n`;
                        debugInfo += `User ID: ${user.id}\n`;
                      }
                      debugInfo += `Current user state: ${user ? user.email : 'null'}\n`;
                      debugInfo += `Auth method: ${authMethod}\n`;
                      
                      setMessage(debugInfo);
                    } catch (error) {
                      setMessage(`Debug error: ${error}`);
                    }
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
                >
                  Debug Session Data
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Check Supabase client configuration
                      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
                      
                      let configInfo = '=== SUPABASE CONFIG ===\n';
                      configInfo += `URL: ${supabaseUrl ? 'Set' : 'Not set'}\n`;
                      configInfo += `Key: ${supabaseKey ? 'Set' : 'Not set'}\n`;
                      
                      // Test a simple query
                      try {
                        const { data, error } = await supabase.from('user_favorites').select('*').limit(1);
                        configInfo += `\nDatabase test: ${error ? `Error: ${error.message}` : `Success: ${data?.length || 0} rows`}\n`;
                      } catch (dbError) {
                        configInfo += `\nDatabase test: Exception: ${dbError}\n`;
                      }
                      
                      setMessage(configInfo);
                    } catch (error) {
                      setMessage(`Config error: ${error}`);
                    }
                  }}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 ml-2"
                >
                  Check Supabase Config
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Manually test setting user state
                      const { data: { user } } = await supabase.auth.getUser();
                      if (user) {
                        console.log('🔍 Manually setting user state:', user.email);
                        setUser(user);
                        setMessage(`Manually set user: ${user.email}`);
                      } else {
                        setMessage('No user found to set');
                      }
                    } catch (error) {
                      setMessage(`Manual set error: ${error}`);
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
                >
                  Manually Set User
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Favorites Test</h2>
          <div className="mb-4">
            <button
              onClick={loadFavorites}
              disabled={loading || !user}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Favorites'}
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Test Tools:</p>
            <div className="flex gap-2 mt-2">
              {['chatgpt', 'claude', 'midjourney'].map(toolId => (
                <button
                  key={toolId}
                  onClick={() => toggleFavorite(toolId)}
                  disabled={loading || !user}
                  className={`px-3 py-1 rounded text-sm ${
                    favorites.includes(toolId)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {favorites.includes(toolId) ? '❤️' : '🤍'} {toolId}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Current Favorites:</p>
            <div className="mt-2">
              {favorites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {favorites.map(toolId => (
                    <span key={toolId} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {toolId}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No favorites yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status Messages</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm font-mono whitespace-pre-wrap">{message || 'No messages yet'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
