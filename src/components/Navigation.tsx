'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import AuthModal from './AuthModal';
import { getUserRole } from '@/lib/auth';

// Simple SVG icons as fallback
const Bars3Icon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
        } else {
          console.log('User data:', data.user);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
      } finally {
        setLoading(false);
      }
    };

    // Get initial user state
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Handle scroll effect for enhanced sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Search', href: '/search' },
    { name: 'Categories', href: '/categories' },
    { name: 'Trending', href: '/trending' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    // Admin link will be conditionally rendered below
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg lg:text-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                V
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 group-hover:scale-105 transition-transform duration-300">
                VaultX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}
            {/* Conditionally render Admin link for admins only */}
            {user && getUserRole(user) === 'admin' && (
              <Link
                key="Admin"
                href="/admin"
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
              >
                Admin
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Button */}
            <Link
              href="/search"
              className="p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group"
            >
              <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {signingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/submit-tool"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit Tool
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Conditionally render Admin link for admins only */}
            {user && getUserRole(user) === 'admin' && (
              <Link
                key="Admin"
                href="/admin"
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {/* Mobile Search */}
            <div className="px-4 py-2">
              <Link
                href="/search"
                className="block w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                  Search AI tools...
                </div>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="px-4 py-2 space-y-3">
              <Link
                href="/submit-tool"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center shadow-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Submit Tool
              </Link>
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {user.email}
                  </div>
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    disabled={signingOut}
                    className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
} 