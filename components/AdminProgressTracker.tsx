'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckIcon, XMarkIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner, LoadingBar } from './AdminLoadingStates';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  progress?: number; // 0-100
  error?: string;
  startTime?: number;
  endTime?: number;
  metadata?: Record<string, any>;
}

export interface ProgressTrackerProps {
  title: string;
  description?: string;
  steps: ProgressStep[];
  currentStepIndex: number;
  overallProgress: number;
  isRunning: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function AdminProgressTracker({
  title,
  description,
  steps,
  currentStepIndex,
  overallProgress,
  isRunning,
  isPaused = false,
  onPause,
  onResume,
  onCancel,
  onRetry,
  showDetails = true,
  className = ''
}: ProgressTrackerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XMarkIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <LoadingSpinner size="sm" color="primary" />;
      case 'skipped':
        return <span className="h-5 w-5 text-gray-400">⏭</span>;
      default:
        return <span className="h-5 w-5 text-gray-400">○</span>;
    }
  };

  const getStepStatusColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'running':
        return 'text-blue-600 dark:text-blue-400';
      case 'skipped':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getStepDuration = (step: ProgressStep) => {
    if (!step.startTime) return null;
    const endTime = step.endTime || Date.now();
    const duration = endTime - step.startTime;
    
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const failedSteps = steps.filter(step => step.status === 'failed').length;
  const skippedSteps = steps.filter(step => step.status === 'skipped').length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {isRunning && !isPaused && onPause && (
              <button
                onClick={onPause}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <PauseIcon className="h-4 w-4 mr-2" />
                Pause
              </button>
            )}
            
            {isPaused && onResume && (
              <button
                onClick={onResume}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Resume
              </button>
            )}
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <LoadingBar progress={overallProgress} size="lg" />
          
          {/* Summary Stats */}
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Total: {steps.length}</span>
            <span className="text-green-600 dark:text-green-400">✓ {completedSteps}</span>
            {failedSteps > 0 && <span className="text-red-600 dark:text-red-400">✗ {failedSteps}</span>}
            {skippedSteps > 0 && <span className="text-gray-500 dark:text-gray-400">⏭ {skippedSteps}</span>}
            <span className="text-blue-600 dark:text-blue-400">⟳ {steps.filter(s => s.status === 'running').length}</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 transition-colors ${
              step.status === 'running'
                ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                : step.status === 'completed'
                ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                : step.status === 'failed'
                ? 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step)}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${getStepStatusColor(step)}`}>
                      {step.label}
                    </h4>
                    {step.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {step.status === 'failed' && onRetry && (
                      <button
                        onClick={onRetry}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      >
                        Retry
                      </button>
                    )}
                    
                    {showDetails && (step.metadata || step.error || step.progress !== undefined) && (
                      <button
                        onClick={() => toggleStepExpansion(step.id)}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {expandedSteps.has(step.id) ? 'Hide' : 'Details'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step Progress Bar */}
                {step.progress !== undefined && step.status === 'running' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Step Progress</span>
                      <span>{Math.round(step.progress)}%</span>
                    </div>
                    <LoadingBar progress={step.progress} size="sm" />
                  </div>
                )}

                {/* Step Duration */}
                {step.startTime && (
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Duration: {getStepDuration(step)}
                  </div>
                )}

                {/* Expanded Details */}
                {expandedSteps.has(step.id) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    {step.error && (
                      <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-700 dark:text-red-300">
                        <strong>Error:</strong> {step.error}
                      </div>
                    )}
                    
                    {step.metadata && Object.keys(step.metadata).length > 0 && (
                      <div className="text-xs">
                        <strong className="text-gray-700 dark:text-gray-300">Metadata:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400 overflow-auto max-h-32">
                          {JSON.stringify(step.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook for managing progress state
export function useProgressTracker(initialSteps: Omit<ProgressStep, 'id'>[]) {
  const [steps, setSteps] = useState<ProgressStep[]>(() =>
    initialSteps.map((step, index) => ({
      ...step,
      id: `step_${index}`,
      status: 'pending' as const
    }))
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const updateStep = useCallback((stepId: string, updates: Partial<ProgressStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  const startStep = useCallback((stepId: string) => {
    updateStep(stepId, { 
      status: 'running', 
      startTime: Date.now(),
      progress: 0
    });
  }, [updateStep]);

  const completeStep = useCallback((stepId: string, metadata?: Record<string, any>) => {
    updateStep(stepId, { 
      status: 'completed', 
      endTime: Date.now(),
      progress: 100,
      metadata
    });
  }, [updateStep]);

  const failStep = useCallback((stepId: string, error: string) => {
    updateStep(stepId, { 
      status: 'failed', 
      endTime: Date.now(),
      error
    });
  }, [updateStep]);

  const skipStep = useCallback((stepId: string) => {
    updateStep(stepId, { 
      status: 'skipped',
      endTime: Date.now()
    });
  }, [updateStep]);

  const updateStepProgress = useCallback((stepId: string, progress: number) => {
    updateStep(stepId, { progress });
  }, [updateStep]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending' as const,
      progress: undefined,
      error: undefined,
      startTime: undefined,
      endTime: undefined,
      metadata: undefined
    })));
    setCurrentStepIndex(0);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const overallProgress = useMemo(() => {
    if (steps.length === 0) return 0;
    const totalProgress = steps.reduce((sum, step) => {
      if (step.status === 'completed') return sum + 100;
      if (step.status === 'failed' || step.status === 'skipped') return sum + 0;
      return sum + (step.progress || 0);
    }, 0);
    return totalProgress / steps.length;
  }, [steps]);

  return {
    steps,
    currentStepIndex,
    isRunning,
    isPaused,
    overallProgress,
    updateStep,
    startStep,
    completeStep,
    failStep,
    skipStep,
    updateStepProgress,
    start,
    pause,
    resume,
    stop,
    reset
  };
}
