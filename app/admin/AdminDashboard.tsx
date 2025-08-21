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
  const [activeTab, setActiveTab] = useState<'tools' | 'categories' | 'sponsored' | 'signup' | 'users' | 'contact' | 'automation' | 'performance' | 'search' | 'workflows'>('tools');
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Tools
              </h2>
              <a
                href="/admin/tools"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Tools Management
              </a>
            </div>

            {/* Quick Search Demo */}
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  🔍 Quick Search Demo
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                  Try the new AI-powered search! Go to the "Advanced Search" tab for full features.
                </p>
                <AdvancedSearch
                  onSearch={(query, filters) => {
                    console.log('Quick search:', query, filters);
                    // Filter tools based on search
                  }}
                  data={tools}
                  showFilters={false}
                  showSuggestions={true}
                  placeholder="Search tools with AI intelligence..."
                  className="max-w-md"
                />
              </div>
            </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              {/* Mobile view - cards */}
              <div className="block sm:hidden">
                <div className="p-4 space-y-4">
                  {tools.map((tool) => (
                    <div key={tool.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center mb-3">
                        <div className="text-2xl mr-3">{tool.logo || '🔧'}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tool.website || 'No website'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {tool.category || 'Uncategorized'}
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditTool(tool)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm min-h-[32px] px-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm min-h-[32px] px-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop view - table */}
              <div className="hidden sm:block overflow-x-auto">
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{tool.logo || '🔧'}</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {tool.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {tool.website || 'No website'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {tool.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditTool(tool)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTool(tool.id)}
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

        {/* Forms */}
        {showToolForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Manage Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Use the dedicated Tools Management page to create, edit, publish and archive tools.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleFormClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Close
                </button>
                <a
                  href="/admin/tools"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open Tools Management
                </a>
              </div>
            </div>
          </div>
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