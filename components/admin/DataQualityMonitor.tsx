'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, RefreshCw, Eye, Edit3 } from 'lucide-react';
import { validateToolData, isMockData, generateRealisticDataSuggestions, ToolValidationResult } from '@/lib/toolValidation';

interface Tool {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  weeklyUsers: number;
  growth: string;
  category: string;
  website: string;
  description: string;
}

interface DataQualityStats {
  totalTools: number;
  validTools: number;
  toolsWithWarnings: number;
  toolsWithErrors: number;
  suspiciousTools: number;
  mockDataTools: number;
}

export default function DataQualityMonitor() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [validationResults, setValidationResults] = useState<Map<string, ToolValidationResult>>(new Map());
  const [stats, setStats] = useState<DataQualityStats>({
    totalTools: 0,
    validTools: 0,
    toolsWithWarnings: 0,
    toolsWithErrors: 0,
    suspiciousTools: 0,
    mockDataTools: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || []);
        validateAllTools(data.tools || []);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateAllTools = (toolsList: Tool[]) => {
    const results = new Map<string, ToolValidationResult>();
    let validCount = 0;
    let warningsCount = 0;
    let errorsCount = 0;
    let suspiciousCount = 0;
    let mockDataCount = 0;

    toolsList.forEach(tool => {
      const validation = validateToolData(tool);
      results.set(tool.id, validation);

      if (validation.isValid && validation.warnings.length === 0) {
        validCount++;
      }
      if (validation.warnings.length > 0) {
        warningsCount++;
      }
      if (validation.errors.length > 0) {
        errorsCount++;
      }
      if (isMockData(tool)) {
        suspiciousCount++;
        mockDataCount++;
      }
    });

    setValidationResults(results);
    setStats({
      totalTools: toolsList.length,
      validTools: validCount,
      toolsWithWarnings: warningsCount,
      toolsWithErrors: errorsCount,
      suspiciousTools: suspiciousCount,
      mockDataTools: mockDataCount
    });
  };

  const getValidationIcon = (validation: ToolValidationResult) => {
    if (validation.errors.length > 0) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (validation.warnings.length > 0) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getValidationColor = (validation: ToolValidationResult) => {
    if (validation.errors.length > 0) return 'border-red-200 bg-red-50';
    if (validation.warnings.length > 0) return 'border-yellow-200 bg-yellow-50';
    return 'border-green-200 bg-green-50';
  };

  const handleRefresh = () => {
    fetchTools();
  };

  const handleViewTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowSuggestions(false);
  };

  const handleShowSuggestions = (tool: Tool) => {
    setSelectedTool(tool);
    setShowSuggestions(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading data quality report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Quality Monitor</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and validate tool data quality</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTools}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600">{stats.validTools}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Valid</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.toolsWithWarnings}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
          <div className="text-2xl font-bold text-red-600">{stats.toolsWithErrors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="text-2xl font-bold text-orange-600">{stats.suspiciousTools}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Suspicious</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-600">{stats.mockDataTools}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Mock Data</div>
        </div>
      </div>

      {/* Tools List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tool Validation Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tool Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Weekly Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Growth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tools.map((tool) => {
                const validation = validationResults.get(tool.id);
                if (!validation) return null;

                return (
                  <tr key={tool.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${getValidationColor(validation)}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getValidationIcon(validation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                      {isMockData(tool) && (
                        <div className="text-xs text-red-600 dark:text-red-400">⚠️ Mock Data Detected</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tool.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tool.rating}⭐
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tool.reviewCount?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tool.weeklyUsers?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tool.growth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewTool(tool)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(validation.warnings.length > 0 || validation.errors.length > 0) && (
                          <button
                            onClick={() => handleShowSuggestions(tool)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tool Details Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {showSuggestions ? 'Data Suggestions' : 'Tool Details'}: {selectedTool.name}
                </h3>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {showSuggestions ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Realistic Data Suggestions</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      These suggestions are based on typical AI tool statistics and can help make your data more realistic.
                    </p>
                  </div>
                  
                  {(() => {
                    const suggestions = generateRealisticDataSuggestions(selectedTool);
                    return (
                      <div className="space-y-3">
                        {suggestions.rating && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Rating:</span>
                            <span className="font-mono text-sm">
                              {selectedTool.rating} → <span className="text-green-600">{suggestions.rating}</span>
                            </span>
                          </div>
                        )}
                        {suggestions.reviewCount && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Review Count:</span>
                            <span className="font-mono text-sm">
                              {selectedTool.reviewCount} → <span className="text-green-600">{suggestions.reviewCount.toLocaleString()}</span>
                            </span>
                          </div>
                        )}
                        {suggestions.weeklyUsers && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Weekly Users:</span>
                            <span className="font-mono text-sm">
                              {selectedTool.weeklyUsers?.toLocaleString()} → <span className="text-green-600">{suggestions.weeklyUsers.toLocaleString()}</span>
                            </span>
                          </div>
                        )}
                        {suggestions.growth && (
                          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300">Growth:</span>
                            <span className="font-mono text-sm">
                              {selectedTool.growth} → <span className="text-green-600">{suggestions.growth}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTool.rating}⭐</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Review Count</label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTool.reviewCount?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Users</label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTool.weeklyUsers?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Growth</label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTool.growth}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <div className="mt-1 text-sm text-gray-900 dark:text-white">{selectedTool.description}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                    <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                      <a href={selectedTool.website} target="_blank" rel="noopener noreferrer">
                        {selectedTool.website}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              {showSuggestions && (
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View Details
                </button>
              )}
              {!showSuggestions && (() => {
                const validation = validationResults.get(selectedTool.id);
                return validation && (validation.warnings.length > 0 || validation.errors.length > 0);
              })() && (
                <button
                  onClick={() => setShowSuggestions(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  View Suggestions
                </button>
              )}
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
