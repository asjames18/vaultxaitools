'use client';
import { useState } from 'react';
import { tools, categories, Tool } from '@/data';

export default function AdminPage() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditTool = (tool: Tool) => {
    setSelectedTool(tool);
    setIsEditing(true);
  };

  const handleSaveTool = (updatedTool: Tool) => {
    // In a real app, this would save to a database
    console.log('Saving tool:', updatedTool);
    setIsEditing(false);
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage tools and categories data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tools List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tools ({tools.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{tool.logo}</div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tool.category} • {tool.rating}/5 ({tool.reviewCount} reviews)
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditTool(tool)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Categories ({categories.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="text-xl">{category.icon}</div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.count} tools
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(tools.reduce((sum, tool) => sum + tool.rating, 0) / tools.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {tools.reduce((sum, tool) => sum + tool.weeklyUsers, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {isEditing && selectedTool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit {selectedTool.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedTool.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    defaultValue={selectedTool.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSaveTool(selectedTool)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedTool(null);
                    }}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 