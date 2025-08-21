'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  CogIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner, LoadingButton } from '../AdminLoadingStates';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'action' | 'condition';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  assignee?: string;
  dueDate?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
}

interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  logic: 'and' | 'or';
}

interface WorkflowAction {
  id: string;
  type: 'send_email' | 'update_status' | 'create_task' | 'webhook' | 'database_update';
  config: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
}

interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: 'manual' | 'on_create' | 'on_update' | 'on_delete' | 'scheduled';
  status: 'active' | 'paused' | 'draft';
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  executionCount: number;
  successRate: number;
}

interface WorkflowAutomationProps {
  workflows: Workflow[];
  onWorkflowChange?: (workflow: Workflow) => void;
  onWorkflowToggle?: (workflowId: string, status: 'active' | 'paused') => void;
  onWorkflowDelete?: (workflowId: string) => void;
  className?: string;
}

export function WorkflowAutomation({ 
  workflows, 
  onWorkflowChange, 
  onWorkflowToggle, 
  onWorkflowDelete,
  className = '' 
}: WorkflowAutomationProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({
    name: '',
    description: '',
    trigger: 'manual',
    status: 'draft'
  });

  const handleCreateWorkflow = useCallback(() => {
    if (!newWorkflow.name) return;

    const workflow: Workflow = {
      id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newWorkflow.name,
      description: newWorkflow.description,
      trigger: newWorkflow.trigger || 'manual',
      status: 'draft',
      steps: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 100
    };

    if (onWorkflowChange) {
      onWorkflowChange(workflow);
    }

    // Reset form
    setNewWorkflow({
      name: '',
      description: '',
      trigger: 'manual',
      status: 'draft'
    });
    setShowCreateForm(false);
  }, [newWorkflow, onWorkflowChange]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400';
      case 'paused':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'draft':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'manual':
        return <PlayIcon className="h-4 w-4" />;
      case 'on_create':
        return <PlusIcon className="h-4 w-4" />;
      case 'on_update':
        return <ArrowPathIcon className="h-4 w-4" />;
      case 'on_delete':
        return <XCircleIcon className="h-4 w-4" />;
      case 'scheduled':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <CogIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Workflow Automation
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Automate approval processes, content pipelines, and task management
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {/* Create Workflow Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Create New Workflow
            </h4>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter workflow name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trigger Type
              </label>
              <select
                value={newWorkflow.trigger}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, trigger: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="on_create">On Create</option>
                <option value="on_update">On Update</option>
                <option value="on_delete">On Delete</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newWorkflow.description}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this workflow does"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWorkflow}
              disabled={!newWorkflow.name}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Workflow
            </button>
          </div>
        </div>
      )}

      {/* Workflows List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    {workflow.name}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
                
                {workflow.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {workflow.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    {getTriggerIcon(workflow.trigger)}
                    <span>{workflow.trigger.replace('_', ' ')}</span>
                  </div>
                  <span>•</span>
                  <span>{workflow.steps.length} steps</span>
                  <span>•</span>
                  <span>{workflow.executionCount} runs</span>
                  <span>•</span>
                  <span>{workflow.successRate}% success</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onWorkflowToggle?.(workflow.id, workflow.status === 'active' ? 'paused' : 'active')}
                  className={`p-2 rounded-md transition-colors ${
                    workflow.status === 'active'
                      ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                      : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                  }`}
                  title={workflow.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}
                >
                  {workflow.status === 'active' ? (
                    <PauseIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedWorkflow(workflow)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Edit Workflow"
                >
                  <CogIcon className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onWorkflowDelete?.(workflow.id)}
                  className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20"
                  title="Delete Workflow"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Workflow Steps Preview */}
            <div className="space-y-2">
              {workflow.steps.slice(0, 3).map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : step.status === 'running'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : step.status === 'failed'
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircleIcon className="h-3 w-3" />
                    ) : step.status === 'running' ? (
                      <LoadingSpinner size="xs" />
                    ) : step.status === 'failed' ? (
                      <XCircleIcon className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{step.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    step.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : step.status === 'running'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : step.status === 'failed'
                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {step.status}
                  </span>
                </div>
              ))}
              
              {workflow.steps.length > 3 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  +{workflow.steps.length - 3} more steps
                </div>
              )}
            </div>

            {/* Last Run Info */}
            {workflow.lastRun && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
                Last run: {workflow.lastRun.toLocaleDateString()} at {workflow.lastRun.toLocaleTimeString()}
                {workflow.nextRun && (
                  <span className="ml-4">
                    Next run: {workflow.nextRun.toLocaleDateString()} at {workflow.nextRun.toLocaleTimeString()}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Editor Modal */}
      {selectedWorkflow && (
        <WorkflowEditor
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          onSave={(updatedWorkflow) => {
            if (onWorkflowChange) {
              onWorkflowChange(updatedWorkflow);
            }
            setSelectedWorkflow(null);
          }}
        />
      )}
    </div>
  );
}

// Workflow Editor Component
interface WorkflowEditorProps {
  workflow: Workflow;
  onClose: () => void;
  onSave: (workflow: Workflow) => void;
}

function WorkflowEditor({ workflow, onClose, onSave }: WorkflowEditorProps) {
  const [editedWorkflow, setEditedWorkflow] = useState<Workflow>(workflow);
  const [activeStep, setActiveStep] = useState<WorkflowStep | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);

  const addStep = useCallback((step: Omit<WorkflowStep, 'id'>) => {
    const newStep: WorkflowStep = {
      ...step,
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setEditedWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  }, []);

  const updateStep = useCallback((stepId: string, updates: Partial<WorkflowStep>) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  }, []);

  const handleSave = useCallback(() => {
    const updatedWorkflow = {
      ...editedWorkflow,
      updatedAt: new Date()
    };
    onSave(updatedWorkflow);
  }, [editedWorkflow, onSave]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Edit Workflow: {workflow.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Workflow Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={editedWorkflow.name}
                onChange={(e) => setEditedWorkflow(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={editedWorkflow.status}
                onChange={(e) => setEditedWorkflow(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Workflow Steps
              </h4>
              <button
                onClick={() => setShowStepForm(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Step
              </button>
            </div>

            <div className="space-y-3">
              {editedWorkflow.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">{step.name}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        step.type === 'approval'
                          ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          : step.type === 'review'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : step.type === 'notification'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : step.type === 'action'
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {step.type}
                      </span>
                    </div>
                    
                    {step.assignee && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assigned to: {step.assignee}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveStep(step)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <CogIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeStep(step.id)}
                      className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing workflows
export function useWorkflows(initialWorkflows: Workflow[] = []) {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);

  const addWorkflow = useCallback((workflow: Workflow) => {
    setWorkflows(prev => [...prev, workflow]);
  }, []);

  const updateWorkflow = useCallback((workflowId: string, updates: Partial<Workflow>) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId ? { ...workflow, ...updates } : workflow
    ));
  }, []);

  const deleteWorkflow = useCallback((workflowId: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
  }, []);

  const toggleWorkflow = useCallback((workflowId: string, status: 'active' | 'paused') => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId ? { ...workflow, status } : workflow
    ));
  }, []);

  const getWorkflowStats = useCallback(() => {
    return {
      total: workflows.length,
      active: workflows.filter(w => w.status === 'active').length,
      paused: workflows.filter(w => w.status === 'paused').length,
      draft: workflows.filter(w => w.status === 'draft').length,
      totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
      averageSuccessRate: workflows.length > 0 
        ? Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)
        : 0
    };
  }, [workflows]);

  return {
    workflows,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    getWorkflowStats
  };
}
