'use client';

import { memo } from 'react';
import { Toast } from './LoadingStates';

interface NotificationBannersProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  componentError: string | null;
  showUpdateBanner: boolean;
  error: string | null;
  onCloseToast: () => void;
  onCloseUpdateBanner: () => void;
}

const NotificationBanners = memo(({
  toast,
  componentError,
  showUpdateBanner,
  error,
  onCloseToast,
  onCloseUpdateBanner
}: NotificationBannersProps) => {
  return (
    <>
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={onCloseToast}
        />
      )}
      
      {/* Component Error Display */}
      {componentError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Component Error
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {componentError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automation Update Banner */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">🚀 New AI tools discovered! Data updated with latest tools.</span>
            <button
              onClick={onCloseUpdateBanner}
              className="ml-4 text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} - Showing sample data
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

NotificationBanners.displayName = 'NotificationBanners';

export default NotificationBanners;
