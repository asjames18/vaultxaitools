'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', color = 'primary', className = '', text }: LoadingSpinnerProps) {
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
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
        role="status"
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
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{text}</p>
      )}
    </div>
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
    <div className={`flex space-x-1 ${className}`} role="status" aria-label="Loading">
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

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'list' | 'table';
}

export function LoadingSkeleton({ className = '', lines = 3, variant = 'text' }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
          <div className="bg-gray-300 dark:bg-gray-600 rounded h-4 w-3/4 mb-3"></div>
          <div className="bg-gray-300 dark:bg-gray-600 rounded h-3 w-1/2 mb-2"></div>
          <div className="bg-gray-300 dark:bg-gray-600 rounded h-3 w-2/3"></div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-8 w-8"></div>
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-3/4"></div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-2 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-full mb-3"></div>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-3 mb-2">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/3"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default text variant
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2 ${
            index === 0 ? 'w-3/4' : index === 1 ? 'w-1/2' : 'w-2/3'
          }`}
        />
      ))}
    </div>
  );
}

// New: Progress Bar Component
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = true, 
  variant = 'default' 
}: ProgressBarProps) {
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-out ${variantClasses[variant]}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${clampedProgress}%`}
        />
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(clampedProgress)}%
        </p>
      )}
    </div>
  );
}

// New: Content Placeholder Component
interface ContentPlaceholderProps {
  className?: string;
  type?: 'image' | 'video' | 'text' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

export function ContentPlaceholder({ 
  className = '', 
  type = 'text', 
  size = 'md' 
}: ContentPlaceholderProps) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const typeIcons = {
    image: '🖼️',
    video: '🎥',
    text: '📄',
    button: '🔘'
  };

  return (
    <div className={`animate-pulse flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg ${sizeClasses[size]} ${className}`}>
      <span className="text-2xl opacity-50">{typeIcons[type]}</span>
    </div>
  );
}

// New: Search Results Skeleton
export function SearchResultsSkeleton({ className = '', count = 5 }: { className?: string; count?: number }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-12 w-12 flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-1/2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded h-3 w-2/3"></div>
                <div className="flex space-x-2 pt-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 w-16"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// New: Authentication Loading States
export function AuthLoadingState({ className = '', type = 'signin' }: { className?: string; type?: 'signin' | 'signup' | 'reset' }) {
  const messages = {
    signin: 'Signing you in...',
    signup: 'Creating your account...',
    reset: 'Sending reset email...'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="lg" color="primary" />
      <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {messages[type]}
      </p>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
        Please wait while we process your request
      </p>
    </div>
  );
}

// New: Infinite Scroll Loading
export function InfiniteScrollLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingDots size="md" color="primary" />
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
        Loading more results...
      </span>
    </div>
  );
}

interface LoadingOverlayProps {
  children?: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({ children, className = '' }: LoadingOverlayProps) {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        {children || <LoadingSpinner size="lg" />}
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false, 
  className = '',
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

interface ContentLoadingProps {
  className?: string;
}

export function ContentLoading({ className = '' }: ContentLoadingProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32 mb-4" />
      <div className="space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-2/3" />
      </div>
    </div>
  );
}

// Hero section loading skeleton
export const HeroLoadingSkeleton = () => (
  <section className="relative overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="text-center max-w-4xl mx-auto">
        {/* Badge skeleton */}
        <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-full px-6 py-3 mb-8 animate-pulse">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="mb-6">
          <div className="w-96 h-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="w-80 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="mb-8">
          <div className="w-full max-w-2xl h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
          <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
        </div>
        
        {/* CTA button skeleton */}
        <div className="w-48 h-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>
    </div>
  </section>
);

// Tools grid loading skeleton
export const ToolsGridLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);

// Stats loading skeleton
export const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-2xl sm:max-w-3xl mx-auto">
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="text-center">
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>
    ))}
  </div>
);

// Full page loading skeleton
export const FullPageLoadingSkeleton = () => (
  <div className="min-h-screen">
    <HeroLoadingSkeleton />
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="w-96 h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
        </div>
        <ToolsGridLoadingSkeleton />
      </div>
    </section>
  </div>
);

// Error state component
export const ErrorState = ({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void; 
}) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Toast notification component
export const Toast = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void; 
}) => (
  <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
    type === 'success' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`}>
    <div className="flex items-center gap-2">
      {type === 'success' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  </div>
);

export default {
  HeroLoadingSkeleton,
  ToolsGridLoadingSkeleton,
  StatsLoadingSkeleton,
  FullPageLoadingSkeleton,
  ErrorState,
  Toast
};
