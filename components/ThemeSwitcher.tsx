'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette, Settings, ChevronDown } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'dropdown' | 'compact';
}

export default function ThemeSwitcher({ 
  className = '', 
  showLabel = true, 
  variant = 'button' 
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('vaultx-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add active theme class
    root.classList.add(activeTheme);

    // Update CSS custom properties for smooth transitions
    if (activeTheme === 'dark') {
      root.style.setProperty('--color-bg-primary', '#111827');
      root.style.setProperty('--color-bg-secondary', '#1f2937');
      root.style.setProperty('--color-text-primary', '#f9fafb');
      root.style.setProperty('--color-text-secondary', '#d1d5db');
      root.style.setProperty('--color-border', '#374151');
      root.style.setProperty('--color-accent', '#3b82f6');
    } else {
      root.style.setProperty('--color-bg-primary', '#ffffff');
      root.style.setProperty('--color-bg-secondary', '#f9fafb');
      root.style.setProperty('--color-text-primary', '#111827');
      root.style.setProperty('--color-text-secondary', '#6b7280');
      root.style.setProperty('--color-border', '#e5e7eb');
      root.style.setProperty('--color-accent', '#3b82f6');
    }

    // Save theme preference
    localStorage.setItem('vaultx-theme', theme);
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // Add transition class for smooth theme change
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 300);
  };

  const getThemeIcon = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getThemeLabel = (themeType: Theme) => {
    switch (themeType) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
    }
  };

  if (!mounted) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
        className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Theme options"
        >
          {getThemeIcon(theme)}
          {showLabel && <span className="text-sm">{getThemeLabel(theme)}</span>}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => {
                  handleThemeChange(themeOption);
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  theme === themeOption
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {getThemeIcon(themeOption)}
                <span className="text-sm font-medium">{getThemeLabel(themeOption)}</span>
                {theme === themeOption && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default button variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
        <button
          key={themeOption}
          onClick={() => handleThemeChange(themeOption)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            theme === themeOption
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label={`Switch to ${themeOption} theme`}
        >
          {getThemeIcon(themeOption)}
        </button>
      ))}
    </div>
  );
}

// Add CSS for smooth theme transitions
useEffect(() => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transitioning * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      
      :root {
        --color-bg-primary: #ffffff;
        --color-bg-secondary: #f9fafb;
        --color-text-primary: #111827;
        --color-text-secondary: #6b7280;
        --color-border: #e5e7eb;
        --color-accent: #3b82f6;
      }
      
      .dark {
        --color-bg-primary: #111827;
        --color-bg-secondary: #1f2937;
        --color-text-primary: #f9fafb;
        --color-text-secondary: #d1d5db;
        --color-border: #374151;
        --color-accent: #3b82f6;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }
}, []);
