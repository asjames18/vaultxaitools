'use client';

import React from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'success';

interface AdminErrorDisplayProps {
  type: ErrorSeverity;
  title: string;
  message: string;
  details?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
  }>;
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

export function AdminErrorDisplay({
  type,
  title,
  message,
  details,
  actions = [],
  onDismiss,
  showDetails = false,
  className = '',
  autoDismiss = false,
  dismissDelay = 5000
}: AdminErrorDisplayProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [showFullDetails, setShowFullDetails] = React.useState(showDetails);

  React.useEffect(() => {
    if (autoDismiss && type !== 'error') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissDelay);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissDelay, onDismiss, type]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'rounded-lg p-4 border-l-4';
    switch (type) {
      case 'info':
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500`;
      case 'error':
        return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-500`;
      case 'success':
        return `${baseClasses} bg-green-50 dark:bg-green-900/20 border-green-500`;
      default:
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-500`;
    }
  };

  const getTextClasses = () => {
    switch (type) {
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'success':
        return 'text-green-800 dark:text-green-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${getTextClasses()}`}>
                {title}
              </h3>
              <div className={`mt-2 text-sm ${getTextClasses()}`}>
                <p>{message}</p>
              </div>
              
              {/* Details Section */}
              {details && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowFullDetails(!showFullDetails)}
                    className="text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {showFullDetails ? 'Hide details' : 'Show details'}
                  </button>
                  {showFullDetails && (
                    <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                      {details}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        action.variant === 'primary'
                          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                          : action.variant === 'danger'
                          ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500'
                      }`}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Dismiss Button */}
            {onDismiss && (
              <div className="ml-3 flex-shrink-0">
                <button
                  onClick={handleDismiss}
                  className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    type === 'info'
                      ? 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:ring-blue-500'
                      : type === 'warning'
                      ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 focus:ring-yellow-500'
                      : type === 'error'
                      ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-500'
                      : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 focus:ring-green-500'
                  }`}
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing multiple errors
export function useErrorManager() {
  const [errors, setErrors] = React.useState<Array<{
    id: string;
    type: ErrorSeverity;
    title: string;
    message: string;
    details?: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'danger';
      icon?: React.ReactNode;
    }>;
    timestamp: number;
  }>>([]);

  const addError = React.useCallback((error: Omit<typeof errors[0], 'id' | 'timestamp'>) => {
    const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setErrors(prev => [...prev, { ...error, id, timestamp: Date.now() }]);
    return id;
  }, []);

  const removeError = React.useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const clearErrorsByType = React.useCallback((type: ErrorSeverity) => {
    setErrors(prev => prev.filter(error => error.type !== type));
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearAllErrors,
    clearErrorsByType
  };
}

// Error display container for multiple errors
export function AdminErrorContainer({ errors, onDismiss }: { 
  errors: ReturnType<typeof useErrorManager>['errors'];
  onDismiss: (id: string) => void;
}) {
  if (errors.length === 0) return null;

  return (
    <div className="space-y-3">
      {errors.map((error) => (
        <AdminErrorDisplay
          key={error.id}
          type={error.type}
          title={error.title}
          message={error.message}
          details={error.details}
          actions={error.actions}
          onDismiss={() => onDismiss(error.id)}
          autoDismiss={error.type !== 'error'}
        />
      ))}
    </div>
  );
}
