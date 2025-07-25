'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryForm({ category, onClose, onSuccess }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    count: 0,
    color: '',
    popular_tools: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        description: category.description,
        count: category.count,
        color: category.color,
        popular_tools: category.popular_tools || [],
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const categoryData = {
        ...formData,
        count: Number(formData.count),
      };

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({ ...categoryData, updated_at: new Date().toISOString() })
          .eq('id', category.id);
        
        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);
        
        if (error) throw error;
      }

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePopularToolsInput = (value: string) => {
    const tools = value.split(',').map(tool => tool.trim()).filter(tool => tool);
    setFormData(prev => ({ ...prev, popular_tools: tools }));
  };

  const handlePopularToolsDisplay = () => {
    return formData.popular_tools.join(', ');
  };

  const colorOptions = [
    { value: 'from-blue-500 to-cyan-500', label: 'Blue' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple' },
    { value: 'from-green-500 to-emerald-500', label: 'Green' },
    { value: 'from-yellow-500 to-orange-500', label: 'Yellow' },
    { value: 'from-red-500 to-rose-500', label: 'Red' },
    { value: 'from-indigo-500 to-blue-500', label: 'Indigo' },
    { value: 'from-pink-500 to-purple-500', label: 'Pink' },
    { value: 'from-teal-500 to-cyan-500', label: 'Teal' },
    { value: 'from-gray-500 to-slate-500', label: 'Gray' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Language, Design, Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon (emoji) *
            </label>
            <input
              type="text"
              required
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="💬"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tools Count
            </label>
            <input
              type="number"
              min="0"
              value={formData.count}
              onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Theme *
            </label>
            <select
              required
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a color theme</option>
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Popular Tools (comma-separated)
            </label>
            <input
              type="text"
              value={handlePopularToolsDisplay()}
              onChange={(e) => handlePopularToolsInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Tool 1, Tool 2, Tool 3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 