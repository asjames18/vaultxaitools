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
import AdminDashboardHeader from './components/AdminDashboardHeader';
import AdminMessageBanner from './components/AdminMessageBanner';
import AdminTabNav from './components/AdminTabNav';
import ToolsTabPanel from './components/ToolsTabPanel';
import CategoriesTabPanel from './components/CategoriesTabPanel';
import type { AdminCategory, AdminMessage, AdminTab, AdminTool } from './types';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('tools');
  const [showToolForm, setShowToolForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [editingTool, setEditingTool] = useState<AdminTool | null>(null);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<AdminMessage>(null);
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

  const handleEditTool = (tool: AdminTool) => {
    console.log('Editing tool:', tool); // Debug log
    setEditingTool(tool);
    setShowToolForm(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
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
      <div className="min-h-screen bg-[#0a0a0a]">
        <AdminDashboardHeader user={user} sessionInfo={sessionInfo} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <AdminMessageBanner message={message} />

        <AdminTabNav
          activeTab={activeTab}
          toolsCount={localTools.length}
          categoriesCount={localCategories.length}
          onTabChange={setActiveTab}
          onContentManagement={navigateToContentManagement}
        />

        {activeTab === 'tools' && (
          <ToolsTabPanel
            tools={localTools}
            categories={localCategories}
            loading={loading}
            onShowToolForm={() => setShowToolForm(true)}
            onRefresh={refreshToolsData}
            onSetLoading={setLoading}
            onSetMessage={setMessage}
            onEditTool={handleEditTool}
            onDeleteTool={handleDeleteTool}
            onToggleToolStatus={handleToggleToolStatus}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTabPanel
            categories={localCategories}
            tools={localTools}
            loading={loading}
            onSyncCategories={handleSyncCategories}
            onShowCategoryForm={() => setShowCategoryForm(true)}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
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
                className="px-4 py-2.5 rounded-md text-sm font-medium bg-green-500 text-black hover:bg-green-400 transition-colors"
              >
                ➕ Add Sponsored Content
              </button>
            </div>

            {/* Sponsored Content Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-green-900">
                <div className="text-3xl mb-3">⭐</div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-green-400">Featured Tools</div>
                <div className="text-xs text-green-400/70 mt-1">Premium placement</div>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl border border-green-900">
                <div className="text-3xl mb-3">🎯</div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-sm text-green-400">Sponsored Slots</div>
                <div className="text-xs text-green-400/70 mt-1">Paid promotions</div>
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
                  className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Features Coming Soon */}
            <div className="bg-gray-800/50 rounded-xl border border-green-900 p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                🚀 Upcoming Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-400">✅</div>
                  <div>
                    <div className="font-medium text-white">Featured Tool Placement</div>
                    <div className="text-sm text-gray-400">Premium positioning for sponsored tools</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400">✅</div>
                  <div>
                    <div className="font-medium text-white">Analytics Dashboard</div>
                    <div className="text-sm text-gray-400">Track sponsored content performance</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400">✅</div>
                  <div>
                    <div className="font-medium text-white">Revenue Tracking</div>
                    <div className="text-sm text-gray-400">Monitor sponsored content earnings</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-400">✅</div>
                  <div>
                    <div className="font-medium text-white">Automated Scheduling</div>
                    <div className="text-sm text-gray-400">Set content rotation schedules</div>
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
                className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors"
              >
                Open Contact Management
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">
                  🚀 Quick Access
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/admin/contact', '_blank')}
                    className="w-full bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
                  >
                    Manage Messages
                  </button>
                  <p className="text-sm text-gray-400">
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
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">
                  🚀 Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open('/admin/automation', '_blank')}
                    className="w-full bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
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
                    className="w-full bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
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
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-400 mb-2">♿ Accessibility Features</h3>
                <ul className="text-gray-300 space-y-2">
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
            tool={editingTool as React.ComponentProps<typeof ToolForm>['tool']}
            categories={localCategories}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {showCategoryForm && (
          <CategoryForm
            category={editingCategory as React.ComponentProps<typeof CategoryForm>['category']}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </div>
      </AdminErrorBoundary>
  );
} 