'use client';

import { PlusIcon } from 'lucide-react';

interface ContentManagementHeaderProps {
  onCreateClick: () => void;
}

export default function ContentManagementHeader({ onCreateClick }: ContentManagementHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and push updates to the frontend</p>
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Content
          </button>
        </div>
      </div>
    </div>
  );
}
