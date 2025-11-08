'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  TrashIcon, 
  PencilIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner } from '@/components/AdminLoadingStates';
import { devLog } from '@/lib/utils';

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  config: any;
  triggers: any[];
  actions: any[];
  conditions: any[];
  schedule: any;
  last_run?: string;
  next_run?: string;
  run_count: number;
  success_count: number;
  error_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  result?: any;
  error_message?: string;
  triggered_by: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  config: any;
  is_public: boolean;
  usage_count: number;
  rating: number;
  tags: string[];
}

export default function EnhancedWorkflowManager() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
    loadTemplates();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      } else {
        console.error('Failed to load workflows');
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      // For now, we'll use mock templates until the database is set up
      const mockTemplates: WorkflowTemplate[] = [
        {
          id: '1',
          name: 'Content Review Workflow',
          description: 'Automated workflow for reviewing and approving content before publication',
          category: 'content-management',
          config: { steps: ['draft', 'review', 'approve', 'publish'] },
          is_public: true,
          usage_count: 15,
          rating: 4.5,
          tags: ['content', 'approval', 'workflow']
        },
        {
          id: '2',
          name: 'Data Quality Check',
          description: 'Automated data validation and quality assurance workflow',
          category: 'data-management',
          config: { steps: ['validate', 'clean', 'verify', 'report'] },
          is_public: true,
          usage_count: 8,
          rating: 4.2,
          tags: ['data', 'quality', 'validation']
        },
        {
          id: '3',
          name: 'User Onboarding',
          description: 'Automated user onboarding and activation workflow',
          category: 'user-management',
          config: { steps: ['welcome', 'tutorial', 'verification', 'activation'] },
          is_public: true,
          usage_count: 12,
          rating: 4.7,
          tags: ['onboarding', 'user', 'activation']
        }
      ];
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const executeWorkflow = async (workflowId: string) => {
    setExecutingWorkflow(workflowId);
    try {
      const response = await fetch('/api/admin/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId, triggeredBy: 'manual' })
      });

      if (response.ok) {
        const result = await response.json();
        devLog.log('Workflow executed:', result);
        // Reload workflows to get updated stats
        await loadWorkflows();
      } else {
        console.error('Failed to execute workflow');
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setExecutingWorkflow(null);
    }
  };

  const toggleWorkflowStatus = async (workflow: Workflow) => {
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    try {
      const response = await fetch('/api/admin/workflows', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: workflow.id, status: newStatus })
      });

      if (response.ok) {
        await loadWorkflows();
      }
    } catch (error) {
      console.error('Error updating workflow status:', error);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/admin/workflows?id=${workflowId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadWorkflows();
      }
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const createWorkflowFromTemplate = async (template: WorkflowTemplate) => {
    const newWorkflow = {
      name: `${template.name} - Copy`,
      description: template.description,
      type: 'automation',
      config: template.config,
      triggers: [],
      actions: [],
      conditions: [],
      schedule: {}
    };

    try {
      const response = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkflow)
      });

      if (response.ok) {
        await loadWorkflows();
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
      case 'archived': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />;
      case 'paused': return <PauseIcon className="w-4 h-4" />;
      case 'draft': return <ClockIcon className="w-4 h-4" />;
      case 'archived': return <ExclamationTriangleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚙️ Workflow Automation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and execute automated workflows for your platform
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-blue-600">{workflows.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Workflows</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-green-600">
            {workflows.filter(w => w.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {workflows.reduce((sum, w) => sum + w.run_count, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Runs</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-orange-600">
            {workflows.reduce((sum, w) => sum + w.success_count, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Active Workflows
          </h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <LoadingSpinner />
          </div>
        ) : workflows.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No workflows created yet. Create your first workflow or use a template to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Run
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {workflows.map((workflow) => (
                  <tr key={workflow.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {workflow.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {workflow.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {getStatusIcon(workflow.status)}
                        <span className="ml-1">{workflow.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {workflow.last_run ? new Date(workflow.last_run).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {workflow.run_count} runs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => executeWorkflow(workflow.id)}
                          disabled={executingWorkflow === workflow.id}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                          title="Execute workflow"
                        >
                          {executingWorkflow === workflow.id ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleWorkflowStatus(workflow)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title={workflow.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
                        >
                          {workflow.status === 'active' ? (
                            <PauseIcon className="w-4 h-4" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedWorkflow(workflow)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          title="View workflow"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setShowEditForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Edit workflow"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteWorkflow(workflow.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete workflow"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Templates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            📚 Workflow Templates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use these pre-built templates to quickly create common workflows
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {template.usage_count} uses
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {template.rating}
                    </span>
                  </div>
                  <button
                    onClick={() => createWorkflowFromTemplate(template)}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create/Edit Forms would go here */}
      {/* For now, we'll show a simple message */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create New Workflow
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Workflow creation form will be implemented here. For now, you can use templates to get started.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
