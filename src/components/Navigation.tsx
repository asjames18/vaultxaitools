'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import AuthModal from './AuthModal';
import { getUserRole } from '@/lib/auth';
import { usePathname } from 'next/navigation';

// Enhanced SVG icons
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

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 0 12h-9a6 6 0 0 1 0-12h9z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const [favorites, setFavorites] = useState(12); // Mock favorites count
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Viewed ChatGPT', time: '2m ago', type: 'view' },
    { id: 2, action: 'Favorited Midjourney', time: '15m ago', type: 'favorite' },
    { id: 3, action: 'Reviewed GitHub Copilot', time: '1h ago', type: 'review' }
  ]);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const pathname = usePathname();

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
          
          // Get user role
          if (data.user) {
            try {
              const role = await getUserRole(data.user);
              setUserRole(role);
            } catch (roleError) {
              console.error('Error getting user role:', roleError);
              setUserRole('user');
            }
          } else {
            setUserRole('user');
          }
        }
      } catch (getUserError) {
        console.error('Error in getUser:', getUserError);
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
          
          // Get user role
          if (session?.user) {
            try {
              const role = await getUserRole(session.user);
              setUserRole(role);
            } catch (error) {
              console.error('Error getting user role:', error);
              setUserRole('user');
            }
          } else {
            setUserRole('user');
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserRole('user');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setShowQuickActions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Trap focus in mobile menu
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = menuRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUser(null);
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error in handleSignOut:', error);
    } finally {
      setSigningOut(false);
    }
  };

  // Smart navigation with engagement features
  const navigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: SparklesIcon,
      badge: null,
      description: 'Discover AI tools'
    },
    { 
      name: 'Search', 
      href: '/search', 
      icon: MagnifyingGlassIcon,
      badge: null,
      description: 'Find specific tools'
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: null,
      badge: null,
      description: 'Browse by category'
    },
    { 
      name: 'Trending', 
      href: '/trending', 
      icon: FireIcon,
      badge: '🔥',
      description: 'Popular tools'
    },
    { 
      name: 'News', 
      href: '/news', 
      icon: null,
      badge: notifications > 0 ? notifications : null,
      description: 'AI industry updates'
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: null,
      badge: null,
      description: 'AI insights & guides'
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: null,
      badge: null,
      description: 'Learn about us'
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: null,
      badge: null,
      description: 'Get in touch'
    },
  ];

  // Quick actions for logged-in users
  const quickActions = [
    { name: 'Dashboard', href: '/dashboard', icon: null, count: null },
    { name: 'My Favorites', href: '/favorites', icon: HeartIcon, count: favorites },
    { name: 'Recent Activity', href: '/activity', icon: ClockIcon, count: recentActivity.length },
    { name: 'Submit Tool', href: '/submit-tool', icon: null, count: null },
    { name: 'Settings', href: '/settings', icon: null, count: null },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
              aria-label="VaultX AI Tools - Home"
            >
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg lg:text-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                V
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 group-hover:scale-105 transition-transform duration-300">
                VaultX
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group ${
                  pathname === item.href
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                role="menuitem"
                tabIndex={0}
              >
                <div className="flex items-center space-x-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      typeof item.badge === 'number' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                        : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {item.description}
                </div>
              </Link>
            ))}
            
            {/* Admin link for admins */}
            {user && userRole === 'admin' && (
              <Link
                href="/admin"
                className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="menuitem"
              >
                <span className="flex items-center space-x-2">
                  <span>Admin</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                    Pro
                  </span>
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Smart Search */}
            <Link
              href="/search"
              className="relative p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Smart search AI tools"
            >
              <MagnifyingGlassIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Smart Search
              </div>
            </Link>

            {/* Notifications */}
            <button
              className="relative p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Notifications"
            >
              <BellIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {notifications}
                </span>
              )}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Notifications
              </div>
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="My favorites"
            >
              <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {favorites > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {favorites}
                </span>
              )}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                My Favorites
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Quick Actions Dropdown */}
                  <div className="relative" ref={quickActionsRef}>
                    <button
                      onClick={() => setShowQuickActions(!showQuickActions)}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Quick actions"
                    >
                      <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                      <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showQuickActions && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="py-2">
                          {quickActions.map((action) => (
                            <Link
                              key={action.name}
                              href={action.href}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                              onClick={() => setShowQuickActions(false)}
                            >
                              <div className="flex items-center space-x-3">
                                {action.icon && <action.icon className="w-4 h-4" />}
                                <span>{action.name}</span>
                              </div>
                              {action.count !== null && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                  {action.count}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                          <button
                            onClick={() => { handleSignOut(); setShowQuickActions(false); }}
                            disabled={signingOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {signingOut ? 'Signing out...' : 'Sign Out'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Sign in or sign up"
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/submit-tool"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Submit a new AI tool"
            >
              Submit Tool
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="px-4 py-2 space-y-1">
            <h2 id="mobile-menu-title" className="sr-only">Mobile navigation menu</h2>
            
            {/* User info for logged-in users */}
            {user && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Member since {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            )}
            
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    typeof item.badge === 'number' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Admin link for admins */}
            {user && userRole === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-base font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Admin</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Pro
                </span>
              </Link>
            )}
          </div>
          
          {/* Mobile Actions */}
          <div className="px-4 py-2 space-y-3 border-t border-gray-200 dark:border-gray-700">
            {/* Quick Actions for logged-in users */}
            {user && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Actions</p>
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      {action.icon && <action.icon className="w-4 h-4" />}
                      <span>{action.name}</span>
                    </div>
                    {action.count !== null && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {action.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
            
            <Link
              href="/submit-tool"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Submit Tool
            </Link>
            
            {!user && (
              <button
                onClick={() => { setAuthOpen(true); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Sign in or sign up"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
      
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </nav>
  );
} 