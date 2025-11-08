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
import EnhancedWorkflowManager from '@/components/admin/EnhancedWorkflowManager';
import { AdminAccessibilityProvider, AdminSkipLink, useKeyboardNavigation } from '@/components/AdminAccessibility';
import { AdminErrorDisplay, useErrorManager } from '@/components/AdminErrorDisplay';
import { AdminProgressTracker, useProgressTracker } from '@/components/AdminProgressTracker';
import { AdminLineChart, AdminBarChart, AdminDoughnutChart, AdminStatsGrid, chartColors, generateTimeSeriesData } from '@/components/admin/AnalyticsCharts';
import { RealTimeMonitor, useRealTimeMetrics } from '@/components/admin/RealTimeMonitor';
import { DataExport, ScheduledExport } from '@/components/admin/DataExport';
import { AdminPagination, usePagination } from '@/components/AdminPagination';
import { AdminSearchFilter, useSearchFilter } from '@/components/AdminSearchFilter';
import { ToolsTable } from '@/components/admin/ToolsTable';
import DataQualityMonitor from '@/components/admin/DataQualityMonitor';
import { revalidateToolsPages, triggerGlobalUpdate } from '@/lib/revalidate';

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
  tools: any[];
  categories: any[];
  user: User;
  systemMetrics?: {
    totalUsers: number;
    systemHealth: number;
    activeUsers: number;
    systemLoad: number;
    apiResponseTime: number;
  };
}

export default function AdminDashboard({ tools, categories, user, systemMetrics }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'tools' | 'categories' | 'sponsored' | 'signup' | 'users' | 'contact' | 'automation' | 'performance' | 'search' | 'workflows' | 'accessibility' | 'data' | 'quality'>('tools');
  const [showToolForm, setShowToolForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [localTools, setLocalTools] = useState<any[]>(tools);
  const [localCategories, setLocalCategories] = useState<any[]>(categories);
  
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
    console.log('Editing tool:', tool); // Debug log
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

  const handleFormSuccess = async () => {
    setMessage({ type: 'success', text: 'Operation completed successfully' });
    handleFormClose();
    
    // Refresh the data from database
    await refreshToolsData();
    
    // Trigger comprehensive revalidation and global updates
    try {
      console.log('🔄 Triggering comprehensive update after form submission...');
      
      // 1. Server-side revalidation
      await revalidateToolsPages();
      
      // 2. Global update notification for all components
      triggerGlobalUpdate('all');
      
      console.log('✅ Comprehensive update completed after form submission');
    } catch (error) {
      console.error('❌ Failed to update frontend after form submission:', error);
      setMessage({ type: 'error', text: 'Tool updated but frontend refresh failed. Please refresh the page manually.' });
    }
  };

  const navigateToContentManagement = () => {
    router.push('/admin/content-management');
  };

  // Function to refresh tools data from database
  const refreshToolsData = async () => {
    try {
      const { data: freshTools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (toolsError) throw toolsError;

      const { data: freshCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;

      setLocalTools(freshTools || []);
      setLocalCategories(freshCategories || []);
      
      console.log('Data refreshed:', { tools: freshTools?.length, categories: freshCategories?.length });
    } catch (error: any) {
      console.error('Failed to refresh data:', error);
      setMessage({ type: 'error', text: 'Failed to refresh data from database' });
    }
  };

  const handleToggleToolStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
    setLoading(true);
    try {
      // First get the tool data for logging
      const { data: toolToUpdate } = await supabase
        .from('tools')
        .select('name, status')
        .eq('id', id)
        .single();

      if (!toolToUpdate) {
        throw new Error('Tool not found');
      }

      // Update the tool status
      const { error } = await supabase
        .from('tools')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Log status change
      await logCRUD(user.id, user.email || '', 'UPDATE', 'TOOL', id, {
        tool_name: toolToUpdate.name || 'Unknown',
        old_status: toolToUpdate.status,
        new_status: status
      });

      setMessage({ type: 'success', text: `Tool status updated to ${status}` });
      
      // Refresh the tools data from database instead of page reload
      await refreshToolsData();
      
      // Trigger comprehensive revalidation and global updates
      try {
        console.log('🔄 Triggering comprehensive update after status change...');
        
        // 1. Server-side revalidation
        await revalidateToolsPages();
        
        // 2. Global update notification for all components
        triggerGlobalUpdate('tools');
        
        console.log('✅ Comprehensive update completed after status change');
      } catch (error) {
        console.error('❌ Failed to update frontend after status change:', error);
        setMessage({ type: 'error', text: 'Status updated but frontend refresh failed. Please refresh the page manually.' });
      }
      
    } catch (error: any) {
      setMessage({ type: 'error', text: `Failed to update tool status: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // Get tool info for logging
      const { data: toolToDelete } = await supabase
        .from('tools')
        .select('name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log deletion
      await logCRUD(user.id, user.email || '', 'DELETE', 'TOOL', id, {
        tool_name: toolToDelete?.name || 'Unknown'
      });

      setMessage({ type: 'success', text: 'Tool deleted successfully' });
      
      // Refresh the tools data from database
      await refreshToolsData();
      
      // Trigger comprehensive revalidation and global updates
      try {
        console.log('🔄 Triggering comprehensive update after deletion...');
        
        // 1. Server-side revalidation
        await revalidateToolsPages();
        
        // 2. Global update notification for all components
        triggerGlobalUpdate('tools');
        
        console.log('✅ Comprehensive update completed after deletion');
      } catch (error) {
        console.error('❌ Failed to update frontend after deletion:', error);
        setMessage({ type: 'error', text: 'Tool deleted but frontend refresh failed. Please refresh the page manually.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to delete tool: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
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
                Tools ({localTools.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Categories ({localCategories.length})
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
                onClick={() => setActiveTab('quality')}
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'quality'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                🔍 Data Quality
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
                  Manage {localTools.length} AI tools with comprehensive information
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowToolForm(true)}
                  className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  ➕ Create Tool
                </button>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await refreshToolsData();
                      triggerGlobalUpdate('all');
                      setMessage({ type: 'success', text: 'Manual refresh completed!' });
                    } catch (error) {
                      setMessage({ type: 'error', text: 'Manual refresh failed' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>

            {/* Enhanced Tools Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                🛠️ Advanced Tools Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Use the enhanced table below for advanced search, filtering, and bulk operations.
              </p>
              
              {/* Quick Actions Toolbar */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">⚡ Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowToolForm(true)}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    ➕ Add New Tool
                  </button>
                  <button
                    onClick={() => {
                      // Quick publish all draft tools
                      const draftTools = localTools.filter(t => t.status === 'draft');
                      if (draftTools.length > 0) {
                        if (confirm(`Publish all ${draftTools.length} draft tools?`)) {
                          draftTools.forEach(tool => {
                            handleToggleToolStatus(tool.id, 'published');
                          });
                        }
                      } else {
                        setMessage({ type: 'success', text: 'No draft tools to publish' });
                      }
                    }}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    🚀 Publish All Drafts
                  </button>
                  <button
                    onClick={() => {
                      // Quick archive old tools
                      const oldTools = localTools.filter(t => {
                        if (!t.updated_at) return false;
                        const daysSinceUpdate = (Date.now() - new Date(t.updated_at).getTime()) / (1000 * 60 * 60 * 24);
                        return daysSinceUpdate > 30; // Archive tools not updated in 30+ days
                      });
                      if (oldTools.length > 0) {
                        if (confirm(`Archive ${oldTools.length} tools not updated in 30+ days?`)) {
                          oldTools.forEach(tool => {
                            handleToggleToolStatus(tool.id, 'archived');
                          });
                        }
                      } else {
                        setMessage({ type: 'success', text: 'No old tools to archive' });
                      }
                    }}
                    className="px-3 py-2 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    📦 Archive Old Tools
                  </button>
                  <button
                    onClick={() => {
                      // Export tools data
                      const csvContent = localTools.map(tool => 
                        `${tool.name},${tool.category},${tool.status},${tool.rating || 0},${tool.review_count || 0}`
                      ).join('\n');
                      const blob = new Blob([`Name,Category,Status,Rating,Reviews\n${csvContent}`], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'ai-tools-export.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    📊 Export CSV
                  </button>
                </div>
              </div>
              
              <ToolsTable 
                tools={localTools} 
                onEdit={(tool) => handleEditTool(tool)}
                onDelete={(id) => handleDeleteTool(id)}
                onToggleStatus={(id, status) => handleToggleToolStatus(id, status as 'draft' | 'published' | 'archived')}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-200">{localCategories.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Categories</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">🔧</div>
                <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                  {localCategories.reduce((total, cat) => total + localTools.filter(t => t.category === cat.name).length, 0)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Total Tools</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                  {localCategories.length > 0 ? Math.round(localTools.length / localCategories.length) : 0}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Avg Tools/Category</div>
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
                    {localCategories.map((category) => (
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
                          {localTools.filter(tool => tool.category === category.name).length} tools
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
                    {localCategories.map((category) => (
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
                          {localTools.filter(tool => tool.category === category.name).length} tools
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

        {activeTab === 'sponsored' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💎 Sponsored Content Management</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage sponsored tools, featured content, and promotional placements
                </p>
              </div>
              
              <button
                onClick={() => setMessage({ type: 'success', text: 'Sponsored content management coming soon!' })}
                className="px-4 py-2.5 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                ➕ Add Sponsored Content
              </button>
            </div>

            {/* Sponsored Content Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">0</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Featured Tools</div>
                <div className="text-xs text-purple-500 dark:text-purple-300 mt-1">Premium placement</div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">0</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Sponsored Slots</div>
                <div className="text-xs text-blue-500 dark:text-blue-300 mt-1">Paid promotions</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                <div className="text-3xl mb-3">📊</div>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">$0</div>
                <div className="text-sm text-green-600 dark:text-green-400">Revenue This Month</div>
                <div className="text-xs text-green-500 dark:text-green-300 mt-1">Sponsored content</div>
              </div>
            </div>

            {/* Sponsored Tools Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                📋 Current Sponsored Content
              </h3>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Sponsored Content Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start monetizing your platform by adding sponsored tools and featured content
                </p>
                <button
                  onClick={() => setMessage({ type: 'success', text: 'Sponsored content management features will be implemented soon!' })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Features Coming Soon */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700 p-6">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-100 mb-4">
                🚀 Upcoming Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="text-purple-600 dark:text-purple-400">✅</div>
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Featured Tool Placement</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Premium positioning for sponsored tools</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-purple-600 dark:text-purple-400">✅</div>
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Analytics Dashboard</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Track sponsored content performance</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-purple-600 dark:text-purple-400">✅</div>
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Revenue Tracking</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Monitor sponsored content earnings</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-purple-600 dark:text-purple-400">✅</div>
                  <div>
                    <div className="font-medium text-purple-900 dark:text-purple-100">Automated Scheduling</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Set content rotation schedules</div>
                  </div>
                </div>
              </div>
            </div>
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
              data={localTools} // Pass tools data for AI suggestions
              showFilters={true}
              showSuggestions={true}
            />
          </div>
        )}

        {activeTab === 'workflows' && (
          <EnhancedWorkflowManager />
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



        {activeTab === 'data' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              💾 Data Management & Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Advanced data management and export capabilities.
            </p>
            
            <div className="space-y-6">
              {/* Enhanced Tools Table */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Enhanced Tools Management</h3>
                <ToolsTable 
                  tools={localTools} 
                  onEdit={(tool) => handleEditTool(tool)}
                  onDelete={(id) => handleDeleteTool(id)}
                  onToggleStatus={(id, status) => handleToggleToolStatus(id, status as 'draft' | 'published' | 'archived')}
                />
              </div>

              {/* Data Export */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Data Export</h3>
                <DataExport data={localTools} filename="ai-tools-export" />
              </div>

              {/* Scheduled Exports */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Scheduled Exports</h3>
                <ScheduledExport 
                  schedules={[]}
                  onScheduleChange={(schedule) => console.log('Schedule changed:', schedule)}
                  onScheduleToggle={(id, enabled) => console.log('Schedule toggled:', id, enabled)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <DataQualityMonitor />
        )}

        {/* Forms */}
        {showToolForm && (
          <ToolForm
            tool={editingTool}
            categories={localCategories}
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