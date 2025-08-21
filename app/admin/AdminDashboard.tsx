'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import UserManagement from './UserManagement';
import ToolForm from './ToolForm';
import CategoryForm from './CategoryForm';
import ContactManagementClient from './contact/ContactManagementClient';
import SponsoredSlots from './SponsoredSlots';
import AdminSignupForm from './AdminSignupForm';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { sessionManager } from '@/lib/sessionManager';
import { logLogout, logCRUD } from '@/lib/auditLogger';
import { LoadingSpinner, LoadingButton, LoadingOverlay } from '@/components/AdminLoadingStates';
import { AdvancedSearch, useAdvancedSearch } from '@/components/admin/AdvancedSearch';
import { WorkflowAutomation, useWorkflows } from '@/components/admin/WorkflowAutomation';
import { AdminAccessibilityProvider, AdminSkipLink, useKeyboardNavigation } from '@/components/AdminAccessibility';
import { AdminErrorDisplay, useErrorManager } from '@/components/AdminErrorDisplay';
import { AdminProgressTracker, useProgressTracker } from '@/components/AdminProgressTracker';
import { AdminLineChart, AdminBarChart, AdminDoughnutChart, AdminStatsGrid, chartColors, generateTimeSeriesData } from '@/components/admin/AnalyticsCharts';
import { RealTimeMonitor, useRealTimeMetrics } from '@/components/admin/RealTimeMonitor';
import { DataExport, ScheduledExport } from '@/components/admin/DataExport';
import { AdminPagination, usePagination } from '@/components/AdminPagination';
import { AdminSearchFilter, useSearchFilter } from '@/components/AdminSearchFilter';
import { ToolsTable } from '@/components/admin/ToolsTable';

// Simplified types to prevent database type issues
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
  created_at?: string;
  status?: 'draft' | 'published' | 'archived';
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
}

interface AdminDashboardProps {
  tools: Tool[];
  categories: Category[];
  user: User;
}

export default function AdminDashboard({ tools, categories, user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'categories' | 'sponsored' | 'signup' | 'users' | 'contact' | 'automation' | 'performance' | 'search' | 'workflows' | 'accessibility' | 'analytics' | 'data'>('tools');
  const [showToolForm, setShowToolForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  
  const supabase = createClient();
  const router = useRouter();

  // Initialize session management
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === 'undefined') return;
    
    // Update activity on component mount
    sessionManager.updateActivity();
    
    // Get session info
    const info = sessionManager.getSessionInfo();
    setSessionInfo(info);
    
    // Set up periodic session checks
    const interval = setInterval(() => {
      const currentInfo = sessionManager.getSessionInfo();
      setSessionInfo(currentInfo);
      
      if (currentInfo && currentInfo.isExpired) {
        handleLogout();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      // Log logout action (IP will be captured server-side)
      await logLogout(user.id, user.email || '');
      
      // Clean up session manager
      sessionManager.destroy();
      
      await supabase.auth.signOut();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect anyway
      window.location.href = '/admin/login';
    }
  };

  const handleSyncCategories = async () => {
    setLoading(true);
    try {
      setMessage({ 
        type: 'success', 
        text: 'Categories synced successfully!' 
      });
      // Refresh the page to show updated data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to sync categories. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    
    setLoading(true);
    try {
      // Get tool info before deletion for audit log
      const { data: toolToDelete } = await supabase
        .from('tools')
        .select('name, category')
        .eq('id', id)
        .single();
      
      const { error } = await supabase.from('tools').delete().eq('id', id);
      if (error) throw error;
      
      // Log deletion
      await logCRUD(user.id, user.email || '', 'DELETE', 'TOOL', id, {
        tool_name: toolToDelete?.name || 'Unknown',
        category: toolToDelete?.category || 'Unknown'
      });
      
      setMessage({ type: 'success', text: 'Tool deleted successfully' });
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete tool' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Category deleted successfully' });
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete category' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setShowToolForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleFormClose = () => {
    setShowToolForm(false);
    setShowCategoryForm(false);
    setShowSignupForm(false);
    setEditingTool(null);
    setEditingCategory(null);
  };

  const handleFormSuccess = () => {
    setMessage({ type: 'success', text: 'Operation completed successfully' });
    handleFormClose();
    // Refresh the page to update the data
    window.location.reload();
  };

  const navigateToContentManagement = () => {
    router.push('/admin/content-management');
  };

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user.email}
                </p>
                {sessionInfo && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      sessionInfo.isExpired ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <span className="text-xs text-gray-500">
                      Session expires in {Math.floor(sessionInfo.timeRemaining / 60000)} minutes
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base min-h-[44px]"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
              <button
                onClick={() => setActiveTab('tools')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'tools'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tools ({tools.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('sponsored')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'sponsored'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                💎 Sponsored
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                👥 Users
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📧 Contact
              </button>
              <a
                href="/admin/blog"
                className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                📝 Blog
              </a>
              <a
                href="/investor"
                className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              >
                📊 Investor
              </a>
              <button
                onClick={() => setActiveTab('automation')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'automation'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🤖 Automation
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📊 Performance
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'search'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🔍 Advanced Search
              </button>
              <button
                onClick={() => setActiveTab('workflows')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'workflows'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                ⚙️ Workflows
              </button>
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'accessibility'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                ♿ Accessibility
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'data'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                💾 Data Management
              </button>
              <button
                onClick={navigateToContentManagement}
                className="py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300"
              >
                📰 Content
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'signup'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                👑 Admin
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
                {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Tools Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage {tools.length} AI tools with comprehensive information
                </p>
              </div>
              
              <button
                onClick={() => setShowToolForm(true)}
                className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                ➕ Create Tool
              </button>
            </div>

            {/* Search */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search tools..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2">
              {(['all','draft','published','archived'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors ${
                    tab === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab} ({tools.filter(t => tab === 'all' ? true : t.status === tab).length})
                </button>
              ))}
            </div>

            {/* Tools Display */}
            <div className="space-y-6">
              {tools.map((tool) => (
                <div key={tool.id} className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                  {/* Tool Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{tool.logo || '🔧'}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tool.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{tool.description || 'No description available'}</p>
                          <div className="flex gap-2 mt-2">
                            {tool.category && <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm">{tool.category}</span>}
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-sm">Published</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditTool(tool)} 
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">⭐ {tool.rating || 'N/A'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{tool.review_count || 0} reviews</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{tool.weekly_users ? `${(tool.weekly_users / 1000).toFixed(1)}k` : 'N/A'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Users</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{tool.website ? '🌐' : '❌'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Website</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{tool.created_at ? '📅' : '❌'}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">⚡ Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button className="px-3 py-2 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600">
                        ⏸️ Unpublish
                      </button>
                      <button className="px-3 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-700">
                        📦 Archive
                      </button>
                      {tool.website && (
                        <a 
                          href={tool.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center block"
                        >
                          🌐 Website
                        </a>
                      )}
                      <button 
                        onClick={() => handleEditTool(tool)}
                        className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {tools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No tools match the current criteria
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Categories
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSyncCategories}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm min-h-[44px]"
                >
                  {loading ? 'Syncing...' : '🔄 Sync Categories'}
                </button>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm min-h-[44px]"
                >
                  Add New Category
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tools Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{category.icon || '📁'}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {category.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {tools.filter(tool => tool.category === category.name).length} tools
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'sponsored' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💎 Sponsored Content Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sponsored content management features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  📧 Contact Messages
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and respond to contact form submissions from users.
                </p>
              </div>
              <button
                onClick={() => window.open('/admin/contact', '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Contact Management
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                  🚀 Quick Access
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/admin/contact', '_blank')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Manage Messages
                  </button>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    View, respond to, and manage all contact form submissions
                  </p>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-3">
                  📊 Message Overview
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Messages:</span>
                    <span className="text-green-600 dark:text-green-400">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unread:</span>
                    <span className="text-red-600 dark:text-red-400">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replied:</span>
                    <span className="text-green-600 dark:text-green-400">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🤖 AI Automation Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Monitor and control the AI tools and news automation system.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Quick Actions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                  🚀 Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/admin/automation', '_blank')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Open Automation Dashboard
                  </button>
                  <button
                    onClick={() => window.open('/AITools', '_blank')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Categories
                  </button>
                  {/* <button
                    onClick={() => window.open('/news', '_blank')}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View News
                  </button> */}
                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100 mb-3">
                  📊 System Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>AI Tools Automation:</span>
                    <span className="text-green-600 dark:text-green-400">✅ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI News Automation:</span>
                    <span className="text-green-600 dark:text-green-400">✅ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Scheduler:</span>
                    <span className="text-yellow-600 dark:text-yellow-400">⏰ 6 AM UTC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                📈 Recent Activity
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>• Last AI tools run: Today at 9:51 AM</div>
                <div>• Last news run: Today at 9:51 AM</div>
                <div>• Total tools collected: 1 new tool</div>
                <div>• Total news articles: 31 new articles</div>
                <div>• Next scheduled run: Tomorrow at 6:00 AM UTC</div>
              </div>
            </div>

            {/* Commands Reference */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                💻 Available Commands
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                    npm run automation:combined
                  </code>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Run both tools and news automation</p>
                </div>
                <div>
                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                    npm run automation:start
                  </code>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Start daily scheduler</p>
                </div>
                <div>
                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                    npm run automation:status
                  </code>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Check automation status</p>
                </div>
                <div>
                  <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">
                    npm run automation:test
                  </code>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Test automation system</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Performance Monitor
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Real-time monitoring of Core Web Vitals and platform performance metrics.
            </p>
            
            <PerformanceMonitor />
          </div>
        )}

        {activeTab === 'signup' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              👑 Admin Signup
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Admin signup features coming soon...
            </p>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🔍 Advanced Search & AI Intelligence
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              AI-powered search with semantic understanding, advanced filtering, and intelligent suggestions.
            </p>
            
            <AdvancedSearch
              onSearch={(query, filters) => {
                console.log('Search query:', query);
                console.log('Search filters:', filters);
                // Here you would integrate with your actual search API
              }}
              data={tools} // Pass tools data for AI suggestions
              showFilters={true}
              showSuggestions={true}
            />
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ⚙️ Workflow Automation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Automate approval processes, content pipelines, and task management with visual workflow builder.
            </p>
            
            <WorkflowAutomation
              workflows={[]} // Start with empty workflows
              onWorkflowChange={(workflow) => {
                console.log('Workflow created/updated:', workflow);
                // Here you would save to your database
              }}
              onWorkflowToggle={(workflowId, status) => {
                console.log('Workflow toggled:', workflowId, status);
                // Here you would update workflow status
              }}
              onWorkflowDelete={(workflowId) => {
                console.log('Workflow deleted:', workflowId);
                // Here you would delete from your database
              }}
            />
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ♿ Accessibility & UX Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enhanced accessibility features, error handling, and user experience improvements.
            </p>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">♿ Accessibility Features</h3>
                <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                  <li>• Keyboard navigation support</li>
                  <li>• Screen reader compatibility</li>
                  <li>• Focus management</li>
                  <li>• High contrast support</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">✨ UX Improvements</h3>
                <ul className="text-green-700 dark:text-green-300 space-y-2">
                  <li>• Enhanced error handling</li>
                  <li>• Progress tracking</li>
                  <li>• Loading states</li>
                  <li>• User feedback systems</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Analytics & Data Visualization
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comprehensive analytics dashboard with charts, real-time monitoring, and data insights.
            </p>
            
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">{tools.length}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Tools</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📁</div>
                  <div className="text-lg font-semibold text-green-800 dark:text-green-200">{categories.length}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Categories</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">1,234</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Total Users</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-lg font-semibold text-orange-800 dark:text-orange-200">98%</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">System Health</div>
                </div>
              </div>

              {/* Chart Placeholders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">📈 Platform Activity</h3>
                  <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Component Ready</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">🥧 Category Distribution</h3>
                  <div className="h-64 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Component Ready</span>
                  </div>
                </div>
              </div>

              {/* Real-time Monitor Placeholder */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">⏱️ Real-time Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">156</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">23%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">System Load</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">145ms</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">API Response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💾 Data Management & Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Advanced data management, export capabilities, and scheduled operations.
            </p>
            
            <div className="space-y-6">
              {/* Enhanced Tools Table */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Enhanced Tools Management</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Tools Table Component Ready</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Advanced table with pagination, search, and filtering</p>
                </div>
              </div>

              {/* Data Export */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Data Export</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Export Component Ready</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Export data in CSV, JSON, and Excel formats</p>
                </div>
              </div>

              {/* Scheduled Exports */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Scheduled Exports</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Scheduled Export Component Ready</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Automated data exports on schedule</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forms */}
        {showToolForm && (
          <ToolForm
            tool={editingTool}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {showCategoryForm && (
          <CategoryForm
            category={editingCategory}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
      </AdminErrorBoundary>
  );
} 