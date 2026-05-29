'use client';

import type { AdminCategory, AdminTool } from '../types';
import CategoriesOverviewTable from './CategoriesOverviewTable';

interface CategoriesTabPanelProps {
  categories: AdminCategory[];
  tools: AdminTool[];
  loading: boolean;
  onSyncCategories: () => void;
  onShowCategoryForm: () => void;
  onEditCategory: (category: AdminCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoriesTabPanel({
  categories,
  tools,
  loading,
  onSyncCategories,
  onShowCategoryForm,
  onEditCategory,
  onDeleteCategory,
}: CategoriesTabPanelProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Categories</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onSyncCategories}
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm min-h-[44px]"
          >
            {loading ? 'Syncing...' : '🔄 Sync Categories'}
          </button>
          <button
            onClick={onShowCategoryForm}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm min-h-[44px]"
          >
            Add New Category
          </button>
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
