'use client';

import React, { useState } from 'react';
import { 
  LoadingSpinner, 
  LoadingSkeleton, 
  ProgressBar, 
  SearchResultsSkeleton,
  AuthLoadingState,
  InfiniteScrollLoader 
} from './LoadingStates';
import { 
  SuccessMessage, 
  ErrorMessage, 
  InfoMessage,
  useUserFeedback,
  UserFeedbackProvider 
} from './UserFeedback';
import { 
  SkipNavigation,
  AccessibilityToolbar,
  FocusTrap,
  AccessibleButton,
  AccessibleFormField,
  useAccessibility,
  AccessibilityProvider 
} from './AccessibilityEnhancements';

// Demo component for the accessibility features
function AccessibilityDemo() {
  const { announceToScreenReader } = useAccessibility();
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Accessibility Features
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccessibleButton
          onClick={() => announceToScreenReader('Button clicked!')}
          variant="primary"
          size="md"
        >
          Announce to Screen Reader
        </AccessibleButton>
        
        <AccessibleButton
          variant="secondary"
          size="md"
          aria-expanded={false}
          aria-controls="demo-content"
        >
          Accessible Button
        </AccessibleButton>
      </div>
      
      <div className="space-y-4">
        <AccessibleFormField
          label="Email Address"
          id="demo-email"
          type="email"
          placeholder="Enter your email"
          helperText="We'll never share your email with anyone else."
          required
        />
        
        <AccessibleFormField
          label="Password"
          id="demo-password"
          type="password"
          placeholder="Enter your password"
          error="Password must be at least 8 characters"
        />
      </div>
    </div>
  );
}

// Demo component for loading states
function LoadingStatesDemo() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const simulateProgress = () => {
    setProgress(0);
    setIsLoading(true);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Loading States & Feedback
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
        
        <div className="text-center">
          <LoadingSpinner size="md" color="secondary" />
        </div>
        
        <div className="text-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Progress Indicators
        </h4>
        
        <ProgressBar progress={progress} className="mb-4" />
        
        <button
          onClick={simulateProgress}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Start Progress'}
        </button>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Skeleton Loaders
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="list" lines={3} />
        </div>
        
        <LoadingSkeleton variant="table" lines={4} />
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Specialized Loading States
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AuthLoadingState type="signin" />
          <SearchResultsSkeleton count={3} />
        </div>
        
        <InfiniteScrollLoader />
      </div>
    </div>
  );
}

// Demo component for user feedback
function UserFeedbackDemo() {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo, 
    showLoading,
    clearAllToasts 
  } = useUserFeedback();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        User Feedback & Notifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => showSuccess('Success!', 'Your action was completed successfully.')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={() => showError('Error!', 'Something went wrong. Please try again.')}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={() => showWarning('Warning!', 'Please review your input before proceeding.')}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={() => showInfo('Info!', 'Here is some helpful information.')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Show Info Toast
        </button>
        
        <button
          onClick={() => showLoading('Processing...', 'Please wait while we complete your request.')}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Show Loading Toast
        </button>
        
        <button
          onClick={clearAllToasts}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Clear All Toasts
        </button>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Inline Messages
        </h4>
        
        <SuccessMessage
          title="Profile Updated"
          message="Your profile has been successfully updated."
          onDismiss={() => {}}
        />
        
        <ErrorMessage
          title="Upload Failed"
          message="The file upload failed. Please check your connection and try again."
          retryAction={() => {}}
        />
        
        <InfoMessage
          title="New Feature Available"
          message="Check out our new search filters for better results."
        />
      </div>
    </div>
  );
}

// Main demo page component
export default function UXDemoPage() {
  const [activeTab, setActiveTab] = useState('loading');

  const tabs = [
    { id: 'loading', label: 'Loading States', component: LoadingStatesDemo },
    { id: 'feedback', label: 'User Feedback', component: UserFeedbackDemo },
    { id: 'accessibility', label: 'Accessibility', component: AccessibilityDemo },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || LoadingStatesDemo;

  return (
    <UserFeedbackProvider>
      <AccessibilityProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <SkipNavigation />
          
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                UX Improvements Demo
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Showcasing enhanced loading states, error handling, accessibility features, and user feedback
              </p>
            </header>

            {/* Tab Navigation */}
            <nav className="mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main id="main-content" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <ActiveComponent />
            </main>

            {/* Accessibility Toolbar */}
            <AccessibilityToolbar />
          </div>
        </div>
      </AccessibilityProvider>
    </UserFeedbackProvider>
  );
}
