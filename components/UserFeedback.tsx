'use client';

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

// Toast interface
interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Context interface
interface UserFeedbackContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showLoading: (title: string, message?: string) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Create context
const UserFeedbackContext = createContext<UserFeedbackContextType | undefined>(undefined);

// Hook to use the context
export const useUserFeedback = () => {
  const context = useContext(UserFeedbackContext);
  if (!context) {
    throw new Error('useUserFeedback must be used within a UserFeedbackProvider');
  }
  return context;
};

// Provider component
interface UserFeedbackProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export function UserFeedbackProvider({ 
  children, 
  maxToasts = 5, 
  defaultDuration = 5000 
}: UserFeedbackProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto-dismiss for non-loading toasts
    if (toast.type !== 'loading' && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, newToast.duration);
    }
  }, [maxToasts, defaultDuration]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    addToast(toast);
  }, [addToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const showLoading = useCallback((title: string, message?: string) => {
    addToast({ type: 'loading', title, message, duration: 0 });
  }, [addToast]);

  const contextValue: UserFeedbackContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
    clearAllToasts
  };

  return (
    <UserFeedbackContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </UserFeedbackContext.Provider>
  );
}

// Toast container component
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Individual toast component
interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 150);
  };

  const getToastStyles = (type: ToastType) => {
    const baseStyles = "transform transition-all duration-200 ease-out";
    const visibilityStyles = isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200`;
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} ${visibilityStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200`;
      case 'loading':
        return `${baseStyles} ${visibilityStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200`;
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-gray-600 dark:text-gray-400 animate-spin" />;
      default:
        return <Info className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  return (
    <div className={`${getToastStyles(toast.type)} border rounded-lg shadow-lg p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon(toast.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium mb-1">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm opacity-90">
              {toast.message}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        {toast.type !== 'loading' && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Success message component
interface SuccessMessageProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function SuccessMessage({ 
  title, 
  message, 
  onDismiss, 
  showIcon = true, 
  className = '' 
}: SuccessMessageProps) {
  return (
    <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {message}
            </p>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Error message component
interface ErrorMessageProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
  showIcon?: boolean;
  className?: string;
  retryAction?: () => void;
}

export function ErrorMessage({ 
  title, 
  message, 
  onDismiss, 
  showIcon = true, 
  className = '',
  retryAction
}: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {message}
            </p>
          )}
          
          {retryAction && (
            <button
              onClick={retryAction}
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
            >
              Try Again
            </button>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Info message component
interface InfoMessageProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function InfoMessage({ 
  title, 
  message, 
  onDismiss, 
  showIcon = true, 
  className = '' 
}: InfoMessageProps) {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {message}
            </p>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 ml-3 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent rounded"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
