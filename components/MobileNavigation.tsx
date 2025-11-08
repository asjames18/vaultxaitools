'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, Home, Grid, BookOpen, Heart, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface MobileNavigationProps {
  isAuthenticated?: boolean;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
}

export default function MobileNavigation({ 
  isAuthenticated = false, 
  onSearchClick,
  onProfileClick 
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll for background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
          { name: 'Home', href: '/', icon: Home },
      { name: 'Media Tools', href: '/AITools', icon: Grid },
      { name: 'Favorites', href: '/favorites', icon: Heart },
  ];

  const adminItems = [
    { name: 'Dashboard', href: '/admin', icon: Settings },
    { name: 'Logout', href: '/logout', icon: LogOut, action: 'logout' },
  ];

  const handleItemClick = (item: any) => {
    if (item.action === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
      return;
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200' 
            : 'bg-gray-900/90 backdrop-blur-sm text-white'
        }`}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div 
            ref={menuRef}
            className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white">VaultX Tech</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Media Tools Directory</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  onSearchClick?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search media tools...</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="px-4 py-2">
                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Quick Actions */}
              <div className="px-4 space-y-2">
                <Link
                  href="/compare"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-5 h-5 bg-orange-100 dark:bg-orange-900/20 rounded flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">⚖️</span>
                  </div>
                  <span className="font-medium">Compare Tools</span>
                </Link>
                
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold">📝</span>
                  </div>
                  <span className="font-medium">Blog</span>
                </Link>
              </div>

              {/* Admin Section */}
              {isAuthenticated && (
                <>
                  <div className="px-4 py-2">
                    <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="px-4 space-y-2">
                    <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Admin
                    </p>
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleItemClick(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {isAuthenticated ? 'Admin User' : 'Guest User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAuthenticated ? 'Manage your account' : 'Sign in for more features'}
                  </p>
                </div>
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setIsOpen(false);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
