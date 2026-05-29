'use client';

import { ToolsTable } from '@/components/admin/ToolsTable';
import { triggerGlobalUpdate } from '@/lib/revalidate';
import type { AdminCategory, AdminMessage, AdminTool } from '../types';
import CategoriesOverviewTable from './CategoriesOverviewTable';

interface ToolsTabPanelProps {
  tools: AdminTool[];
  categories: AdminCategory[];
  loading: boolean;
  onShowToolForm: () => void;
  onRefresh: () => Promise<void>;
  onSetLoading: (loading: boolean) => void;
  onSetMessage: (message: AdminMessage) => void;
  onEditTool: (tool: AdminTool) => void;
  onDeleteTool: (id: string) => void;
  onToggleToolStatus: (id: string, status: 'draft' | 'published' | 'archived') => void;
  onEditCategory: (category: AdminCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export default function ToolsTabPanel({
  tools,
  categories,
  loading,
  onShowToolForm,
  onRefresh,
  onSetLoading,
  onSetMessage,
  onEditTool,
  onDeleteTool,
  onToggleToolStatus,
  onEditCategory,
  onDeleteCategory,
}: ToolsTabPanelProps) {
  const handleManualRefresh = async () => {
    onSetLoading(true);
    try {
      await onRefresh();
      triggerGlobalUpdate('all');
      onSetMessage({ type: 'success', text: 'Manual refresh completed!' });
    } catch {
      onSetMessage({ type: 'error', text: 'Manual refresh failed' });
    } finally {
      onSetLoading(false);
    }
  };

  const handlePublishAllDrafts = () => {
    const draftTools = tools.filter((t) => t.status === 'draft');
    if (draftTools.length > 0) {
      if (confirm(`Publish all ${draftTools.length} draft tools?`)) {
        draftTools.forEach((tool) => onToggleToolStatus(tool.id, 'published'));
      }
    } else {
      onSetMessage({ type: 'success', text: 'No draft tools to publish' });
    }
  };

  const handleArchiveOldTools = () => {
    const oldTools = tools.filter((t) => {
      if (!t.updated_at) return false;
      const daysSinceUpdate =
        (Date.now() - new Date(t.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate > 30;
    });
    if (oldTools.length > 0) {
      if (confirm(`Archive ${oldTools.length} tools not updated in 30+ days?`)) {
        oldTools.forEach((tool) => onToggleToolStatus(tool.id, 'archived'));
      }
    } else {
      onSetMessage({ type: 'success', text: 'No old tools to archive' });
    }
  };

  const handleExportCsv = () => {
    const csvContent = tools
      .map(
        (tool) =>
          `${tool.name},${tool.category},${tool.status},${tool.rating || 0},${tool.review_count || 0}`
      )
      .join('\n');
    const blob = new Blob([`Name,Category,Status,Rating,Reviews\n${csvContent}`], {
      type: 'text/csv',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-tools-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toolsInCategories = categories.reduce(
    (total, cat) => total + tools.filter((t) => t.category === cat.name).length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Tools Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage {tools.length} AI tools with comprehensive information
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onShowToolForm}
            className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            ➕ Create Tool
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="px-4 py-2.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          🛠️ Advanced Tools Management
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use the enhanced table below for advanced search, filtering, and bulk operations.
        </p>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">⚡ Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onShowToolForm}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ➕ Add New Tool
            </button>
            <button
              onClick={handlePublishAllDrafts}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              🚀 Publish All Drafts
            </button>
            <button
              onClick={handleArchiveOldTools}
              className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              📦 Archive Old Tools
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              📊 Export CSV
            </button>
          </div>
        </div>

        <ToolsTable
          tools={tools}
          onEdit={onEditTool}
          onDelete={onDeleteTool}
          onToggleStatus={(id, status) =>
            onToggleToolStatus(id, status as 'draft' | 'published' | 'archived')
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl mb-2">📁</div>
          <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">{categories.length}</div>
          <div className="text-sm text-blue-600 dark:text-blue-400">Total Categories</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl mb-2">🔧</div>
          <div className="text-lg font-semibold text-green-800 dark:text-green-200">{toolsInCategories}</div>
          <div className="text-sm text-green-600 dark:text-green-400">Total Tools</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">
            {categories.length > 0 ? Math.round(tools.length / categories.length) : 0}
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-400">Avg Tools/Category</div>
        </div>
      </div>

      <CategoriesOverviewTable
        categories={categories}
        tools={tools}
        onEdit={onEditCategory}
        onDelete={onDeleteCategory}
      />
    </div>
  );
}
