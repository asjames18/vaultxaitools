'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: any[],
  onSelect: (item: any, index: number) => void,
  options: {
    horizontal?: boolean;
    wrap?: boolean;
    initialFocus?: number;
  } = {}
) {
  const [focusedIndex, setFocusedIndex] = React.useState(options.initialFocus || 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const focusItem = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setFocusedIndex(index);
      const element = containerRef.current?.querySelector(`[data-index="${index}"]`) as HTMLElement;
      element?.focus();
    }
  }, [items.length]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey } = event;
    
    if (ctrlKey || metaKey) return; // Don't interfere with shortcuts

    let newIndex = focusedIndex;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = options.horizontal ? focusedIndex + 1 : focusedIndex + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = options.horizontal ? focusedIndex - 1 : focusedIndex - 1;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect(items[focusedIndex], focusedIndex);
        return;
      default:
        return;
    }

    // Handle wrapping
    if (options.wrap) {
      if (newIndex < 0) newIndex = items.length - 1;
      if (newIndex >= items.length) newIndex = 0;
    } else {
      newIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    }

    focusItem(newIndex);
  }, [focusedIndex, items, onSelect, focusItem, options.horizontal, options.wrap]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return {
    focusedIndex,
    focusItem,
    containerRef,
    getItemProps: (index: number) => ({
      'data-index': index,
      tabIndex: focusedIndex === index ? 0 : -1,
      'aria-selected': focusedIndex === index,
      onFocus: () => setFocusedIndex(index),
      onClick: () => onSelect(items[index], index)
    })
  };
}

// Focus trap hook for modals
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the previously focused element
    previousFocus.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the container
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusableElements = Array.from(
          container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ) as HTMLElement[];

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: move backwards
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move forwards
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      // Restore focus when unmounting
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [enabled]);

  return containerRef;
}

// Screen reader announcement hook
export function useScreenReaderAnnouncement() {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear the message after a short delay
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce, announceRef };
}

// Skip link component for keyboard navigation
export function AdminSkipLink({ targetId, children }: { targetId: string; children: React.ReactNode }) {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg"
    >
      {children}
    </a>
  );
}

// Accessible button component
export function AdminAccessibleButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

// Accessible form field component
export function AdminFormField({
  label,
  id,
  error,
  required = false,
  children,
  className = '',
  description
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  description?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      )}
      
      {children}
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible table component
export function AdminAccessibleTable({
  caption,
  children,
  className = ''
}: {
  caption?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

// Accessible table header component
export function AdminTableHeader({
  children,
  scope = 'col',
  sortable = false,
  sortDirection = 'none',
  onSort,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  scope?: 'col' | 'row';
  sortable?: boolean;
  sortDirection?: 'none' | 'asc' | 'desc';
  onSort?: () => void;
}) {
  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  const getSortIcon = () => {
    if (!sortable) return null;
    
    switch (sortDirection) {
      case 'asc':
        return <span className="ml-1">↑</span>;
      case 'desc':
        return <span className="ml-1">↓</span>;
      default:
        return <span className="ml-1">↕</span>;
    }
  };

  return (
    <th
      scope={scope}
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
        sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
      }`}
      onClick={handleClick}
      {...props}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon()}
      </div>
    </th>
  );
}

// Accessibility provider component
export function AdminAccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { announce, announceRef } = useScreenReaderAnnouncement();

  // Provide accessibility context
  const contextValue = React.useMemo(() => ({
    announce
  }), [announce]);

  return (
    <div>
      {/* Screen reader announcements */}
      <div
        ref={announceRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      
      {/* Skip link */}
      <AdminSkipLink targetId="main-content">Skip to main content</AdminSkipLink>
      
      {children}
    </div>
  );
}
