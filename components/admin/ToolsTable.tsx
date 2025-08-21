'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AdminPagination, usePagination } from '@/components/AdminPagination';
import { AdminSearchFilter, useSearchFilter } from '@/components/AdminSearchFilter';
import { LoadingSkeleton } from '@/components/AdminLoadingStates';

interface Tool {
  id: string;
  name: string;
  description?: string;
  category?: string;
  website?: string;
  logo?: string;
  rating?: number;
  review_count?: number;
  weekly_users?: number;
  status?: 'draft' | 'published' | 'archived';
  created_at?: string;
  updated_at?: string;
}

interface ToolsTableProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (id: string, status: string) => void;
  loading?: boolean;
  className?: string;
}

export function ToolsTable({
  tools,
  onEdit,
  onDelete,
  onToggleStatus,
  loading = false,
  className = ''
}: ToolsTableProps) {
  const {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination
  } = usePagination(25);

  const {
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    clearAll
  } = useSearchFilter();

  // Filter and search tools
  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description?.toLowerCase().includes(query) ||
        tool.category?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(tool => tool.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(tool => tool.category === filters.category);
    }
    if (filters.rating) {
      filtered = filtered.filter(tool => (tool.rating || 0) >= Number(filters.rating));
    }

    return filtered;
  }, [tools, searchQuery, filters]);

  // Paginate filtered tools
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTools.slice(startIndex, endIndex);
  }, [filteredTools, currentPage, itemsPerPage]);

  // Get unique categories for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tools.map(tool => tool.category).filter(Boolean))];
    return uniqueCategories.map(category => ({
      value: category!,
      label: category!,
      count: tools.filter(tool => tool.category === category).length
    }));
  }, [tools]);

  // Filter configurations
  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: categories
    },
    {
      key: 'rating',
      label: 'Min Rating',
      type: 'select' as const,
      options: [
        { value: '1', label: '1+ Stars' },
        { value: '2', label: '2+ Stars' },
        { value: '3', label: '3+ Stars' },
        { value: '4', label: '4+ Stars' },
        { value: '5', label: '5 Stars' }
      ]
    }
  ];

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [filters, searchQuery, resetPagination]);

  const handleStatusToggle = useCallback((tool: Tool) => {
    if (!onToggleStatus) return;
    
    const newStatus = tool.status === 'published' ? 'draft' : 'published';
    onToggleStatus(tool.id, newStatus);
  }, [onToggleStatus]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton type="title" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} type="table-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterConfigs={filterConfigs}
        onClearAll={clearAll}
        searchPlaceholder="Search tools by name, description, or category..."
      />

      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
        {searchQuery.trim() && ` matching "${searchQuery}"`}
        {Object.keys(filters).length > 0 && ' with applied filters'}
      </div>

      {/* Tools Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {tool.logo ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={tool.logo}
                            alt={tool.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {tool.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tool.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {tool.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tool.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : tool.status === 'draft'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      {tool.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <span className="mr-2">{tool.rating || 0}/5</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        ({tool.review_count || 0} reviews)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatNumber(tool.weekly_users)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(tool.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onToggleStatus && (
                        <button
                          onClick={() => handleStatusToggle(tool)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title={tool.status === 'published' ? 'Hide tool' : 'Show tool'}
                        >
                          {tool.status === 'published' ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(tool)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit tool"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(tool.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete tool"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedTools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {filteredTools.length === 0 ? (
                <div>
                  <p className="text-lg font-medium">No tools found</p>
                  <p className="text-sm mt-1">
                    {searchQuery.trim() || Object.keys(filters).length > 0
                      ? 'Try adjusting your search or filters'
                      : 'No tools have been added yet'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">No tools on this page</p>
                  <p className="text-sm mt-1">Try going to the first page</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTools.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTools.length / itemsPerPage)}
          totalItems={filteredTools.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
