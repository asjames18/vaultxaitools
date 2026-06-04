'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu } from '@headlessui/react';
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/auth-js';
import { User as UserIcon, Settings as SettingsIcon, LogOut as LogOutIcon, Search as SearchIcon, Shield as ShieldIcon, Sun as SunIcon, Moon as MoonIcon, Heart as HeartIcon, Scale as ScaleIcon } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const supabase = createClient();

  useEffect(() => {
    const getUserAndRole = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        setUser(user);
        
        if (user) {
          // Load profile display name
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('id', user.id)
              .maybeSingle();
            setDisplayName(profile?.display_name || null);
          } catch {}

          // Get user role
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();
            
          setUserRole(data?.role || null);
        } else {
          setUserRole(null);
          setDisplayName(null);
        }
      } catch (err) {
        // Handle error silently
        setUser(null);
        setUserRole(null);
        setDisplayName(null);
      }
    };

    // Initial fetch
    getUserAndRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      getUserAndRole();
    });

    // Listen for profile updates dispatched from anywhere in the app
    const onProfileUpdated = () => getUserAndRole();
    if (typeof window !== 'undefined') {
      window.addEventListener('profile-updated', onProfileUpdated as any);
    }

    return () => {
      subscription.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('profile-updated', onProfileUpdated as any);
      }
    };
  }, []);

  // Theme management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }
      } else {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark');
        }
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
          <Image
            src="/logo.png"
            alt="Melanated In Tech"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
          <span className="text-lg font-bold text-white tracking-wide hidden sm:inline">Melanated In Tech</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="space-x-1 hidden md:flex">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/AITools"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/AITools' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            AI Tools
          </Link>
          <Link
            href="/agents"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/agents' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            Agents
          </Link>
          <Link
            href="/mcp-servers"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/mcp-servers' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            MCP Servers
          </Link>
          <Link
            href="/blog"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/blog' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            Tutorials
          </Link>
          <Link
            href="/about"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/about' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:text-green-400 dark:hover:text-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500${pathname === '/contact' ? ' bg-green-900/30 text-green-300 dark:bg-green-900/30 dark:text-green-300' : ''}`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          {/* Favorites */}
          <Link
            href="/favorites"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            aria-label="Favorites"
          >
            <HeartIcon className="w-5 h-5" />
          </Link>
          {/* Compare */}
          <Link
            href="/compare"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            aria-label="Compare tools"
          >
            <ScaleIcon className="w-5 h-5" />
          </Link>
          {/* Search */}
          <Link
            href="/AITools"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-400 dark:hover:text-green-400 rounded-lg hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            aria-label="Search tools"
          >
            <SearchIcon className="w-5 h-5" />
          </Link>
          {user ? (
            <Menu as="div" className="relative hidden sm:block">
              <Menu.Button className="flex items-center focus:outline-none">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                  {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl focus:outline-none z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  {displayName && (
                    <div className="font-semibold text-gray-900 dark:text-white">{displayName}</div>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</div>
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
              className="px-4 py-2 bg-green-500 text-black text-sm font-medium rounded-lg hover:bg-green-400 transition-colors hidden sm:block"
            >
              Sign In
            </Link>
          )}
              <Link 
                href="/submit-tool" 
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 text-black text-sm font-medium rounded-lg hover:from-green-400 hover:to-green-300 transition-colors hidden sm:block"
              >
                Submit Resource
              </Link>
          {/* Mobile menu button */}
            <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-green-400 focus-visible:outline-2 focus-visible:outline-green-500 rounded"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* DEBUG: Show user and userRole for troubleshooting (development only) */}
      {/* Removed for production security */}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-300${pathname === '/' ? ' bg-green-900/30 text-green-300' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/AITools"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-300${pathname === '/AITools' ? ' bg-green-900/30 text-green-300' : ''}`}
            >
              AI Tools
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-300${pathname === '/blog' ? ' bg-green-900/30 text-green-300' : ''}`}
            >
              Tutorials
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-300${pathname === '/about' ? ' bg-green-900/30 text-green-300' : ''}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium text-gray-300${pathname === '/contact' ? ' bg-green-900/30 text-green-300' : ''}`}
            >
              Contact
            </Link>
            

            
            {/* Mobile actions */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {user && userRole === 'admin' && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg text-center dark:bg-gray-700"
                >
                  Admin Portal
                </Link>
              )}
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg text-center"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium rounded-lg text-center"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg text-center"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!user && (
                <Link
                  href="/sign-in"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 bg-green-500 text-black text-sm font-medium rounded-lg text-center"
                >
                  Sign In
                </Link>
              )}
                  <Link 
                    href="/submit-tool" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 bg-gradient-to-r from-green-500 to-green-400 text-black text-sm font-medium rounded-lg text-center"
                  >
                    Submit Resource
                  </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}