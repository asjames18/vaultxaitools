'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/auth-js';
import { User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon, Search as SearchIcon, Shield as ShieldIcon } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleDebug, setRoleDebug] = useState<any>(null);
  const [authDebug, setAuthDebug] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUserAndRole = async () => {
      try {
        console.log('🔍 Navigation: Fetching user and role...');
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('👤 User data:', user);
        console.log('❌ User error:', userError);
        
        setUser(user);
        setAuthDebug({ user, userError, timestamp: new Date().toISOString() });
        
        if (user) {
          console.log('🔐 User found, fetching role for user ID:', user.id);
          
          // Get user role
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
            
          console.log('👑 Role data:', data);
          console.log('❌ Role error:', error);
          
          setUserRole(data?.role || null);
          setRoleDebug({ data, error, userId: user.id, timestamp: new Date().toISOString() });
        } else {
          console.log('🚫 No user found, clearing role');
          setUserRole(null);
          setRoleDebug(null);
        }
      } catch (err) {
        console.error('💥 Error in getUserAndRole:', err);
        setAuthDebug({ error: err, timestamp: new Date().toISOString() });
      }
    };

    // Initial fetch
    getUserAndRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      getUserAndRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">VaultX</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="space-x-1 hidden md:flex">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400${pathname === '/' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400${pathname === '/categories' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
          >
            Categories
          </Link>
          <a className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" href="/trending">Trending 🔥</a>
          {/* <a className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" href="/news">News</a> */}
          <Link 
            href="/blog" 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400${pathname === '/blog' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
          >
            Blog
          </Link>
          <Link 
            href="/about" 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400${pathname === '/about' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400${pathname === '/contact' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <Link 
            href="/search" 
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </Link>
          {user ? (
            <Menu as="div" className="relative hidden sm:block">
              <Menu.Button className="flex items-center focus:outline-none">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="font-semibold text-gray-900 dark:text-white">{user?.email}</div>
                </div>
                <div className="py-1">
                  {userRole === 'admin' && (
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-gray-900 dark:text-white`}
                        >
                          <ShieldIcon className="w-4 h-4" /> Admin Portal
                        </Link>
                      )}
                    </Menu.Item>
                  )}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-gray-900 dark:text-white`}
                      >
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/settings"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-gray-900 dark:text-white`}
                      >
                        <SettingsIcon className="w-4 h-4" /> Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-700' : ''} text-red-600 dark:text-red-400`}
                      >
                        <LogOutIcon className="w-4 h-4" /> Sign Out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          ) : (
            <Link 
              href="/sign-in" 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
          )}
          <Link 
            href="/submit-tool" 
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors hidden sm:block"
          >
            Submit Tool
          </Link>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-blue-400"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* DEBUG: Show user and userRole for troubleshooting (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: 60, right: 10, zIndex: 9999, background: '#222', color: '#fff', padding: 8, borderRadius: 8, fontSize: 11, maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#00ff00' }}>🔍 AUTH DEBUG</div>
          <div>User: {user?.email || 'none'}</div>
          <div>Role: {userRole || 'none'}</div>
          <div style={{ marginTop: 8, fontSize: 10, color: '#ccc' }}>
            Auth Debug: {authDebug && JSON.stringify(authDebug, null, 2)}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: '#ccc' }}>
            Role Debug: {roleDebug && JSON.stringify(roleDebug, null, 2)}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/categories" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/categories' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              Categories
            </Link>
            <Link 
              href="/trending" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/trending' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              Trending 🔥
            </Link>
            <Link 
              href="/blog" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/blog' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/about' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300${pathname === '/contact' ? ' bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
            >
              Contact
            </Link>
            
            {/* Mobile actions */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {!user && (
                <Link 
                  href="/sign-in" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg text-center"
                >
                  Sign In
                </Link>
              )}
              <Link 
                href="/submit-tool" 
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-lg text-center"
              >
                Submit Tool
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}