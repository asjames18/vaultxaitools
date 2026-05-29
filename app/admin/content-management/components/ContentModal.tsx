'use client';

import type { ContentFormData, ContentItem, ContentModalType } from '../types';
import { getStatusColor } from '../utils';

interface ContentModalProps {
  modalType: ContentModalType;
  selectedItem: ContentItem | null;
  formData: ContentFormData;
  onClose: () => void;
  onFormChange: (data: ContentFormData) => void;
  onCreate: (data: ContentFormData) => void;
  onUpdate: (id: string, data: ContentFormData) => void;
}

export default function ContentModal({
  modalType,
  selectedItem,
  formData,
  onClose,
  onFormChange,
  onCreate,
  onUpdate,
}: ContentModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {modalType === 'create' && 'Create New Content'}
            {modalType === 'edit' && 'Edit Content'}
            {modalType === 'view' && 'View Content'}
          </h3>

          {modalType === 'view' && selectedItem ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedItem.content}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}
                >
                  {selectedItem.status}
                </span>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (modalType === 'create') {
                  onCreate(formData);
                } else if (modalType === 'edit' && selectedItem) {
                  onUpdate(selectedItem.id, formData);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => onFormChange({ ...formData, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={formData.type || 'news'}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      type: e.target.value as ContentFormData['type'],
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="news">News</option>
                  <option value="tool-update">Tool Update</option>
                  <option value="announcement">Announcement</option>
                  <option value="feature">Feature</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select
                  value={formData.priority || 'medium'}
                  onChange={(e) =>
                    onFormChange({
                      ...formData,
                      priority: e.target.value as ContentFormData['priority'],
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {modalType === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
