'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function LoadingDots({ size = 'md', color = 'primary', className = '' }: LoadingDotsProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white'
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

interface LoadingBarProps {
  progress?: number; // 0-100
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export function LoadingBar({ 
  progress, 
  indeterminate = false, 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
      {indeterminate ? (
        <div
          className={`${colorClasses[color]} h-full rounded-full animate-pulse`}
          style={{
            animation: 'loading-bar-indeterminate 2s ease-in-out infinite'
          }}
        />
      ) : (
        <div
          className={`${colorClasses[color]} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${progress || 0}%` }}
        />
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  type: 'text' | 'title' | 'avatar' | 'card' | 'table-row' | 'custom';
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ type, lines = 3, className = '' }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
                  i === lines - 1 ? 'w-3/4' : 'w-full'
                }`}
              />
            ))}
          </div>
        );

      case 'title':
        return (
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>
        );

      case 'avatar':
        return (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
            <div className="space-y-2">
              {Array.from({ length: lines }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
                    i === lines - 1 ? 'w-1/2' : 'w-full'
                  }`}
                />
              ))}
            </div>
            <div className="flex space-x-2 pt-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
            </div>
          </div>
        );

      case 'table-row':
        return (
          <div className="flex items-center space-x-4 py-3">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4" />
            </div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = 'Loading...', 
  showSpinner = true,
  className = '' 
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          {showSpinner && <LoadingSpinner size="lg" className="mx-auto mb-3" />}
          <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = 'Loading...', 
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && (
        <>
          <LoadingSpinner size="sm" color="white" className="mr-2" />
          {loadingText}
        </>
      )}
      {!isLoading && children}
    </button>
  );
}

// CSS for indeterminate loading bar animation
const loadingBarStyles = `
  @keyframes loading-bar-indeterminate {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0%); }
    100% { transform: translateX(100%); }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'admin-loading-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = loadingBarStyles;
    document.head.appendChild(style);
  }
}
