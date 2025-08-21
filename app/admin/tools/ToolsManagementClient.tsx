'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import AdminAuthWrapper from '../AdminAuthWrapper';
import { AdvancedSearch } from '@/components/admin/AdvancedSearch';
import { AdminPagination, usePagination } from '@/components/AdminPagination';
import { AdminSearchFilter, useSearchFilter } from '@/components/AdminSearchFilter';
import { ToolsTable } from '@/components/admin/ToolsTable';
import { AdminErrorDisplay } from '@/components/AdminErrorDisplay';
import { AdminProgressTracker } from '@/components/AdminProgressTracker';
import { LoadingSpinner, LoadingOverlay } from '@/components/AdminLoadingStates';
import { logCRUD } from '@/lib/auditLogger';

type ToolStatus = 'draft' | 'published' | 'archived';

interface ToolForm {
  id?: string;
  name: string;
  website: string;
  category: string;
  pricing: string;
  description: string;
  longDescription?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  tags?: string[];
  logo?: string;
  og_image_url?: string;
  favicon_url?: string;
  status: ToolStatus;
  curator_notes?: string;
}

function ToolsManagementContent() {
  const supabase = createClient();

  const [tools, setTools] = useState<ToolForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ToolStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<ToolForm | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichUrl, setEnrichUrl] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [operationProgress, setOperationProgress] = useState<{ isActive: boolean; step: number; totalSteps: number; message: string }>({
    isActive: false,
    step: 0,
    totalSteps: 0,
    message: ''
  });

  // Advanced search and filtering
  const { searchQuery, filters, onSearchChange, onFilterChange, clearFilters } = useSearchFilter();
  
  // Pagination
  const { currentPage, itemsPerPage, totalPages, goToPage, nextPage, prevPage, setItemsPerPage } = usePagination(tools.length, 10);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Start progress tracking
      setOperationProgress({
        isActive: true,
        step: 1,
        totalSteps: 3,
        message: 'Connecting to database...'
      });

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;

      setOperationProgress({
        isActive: true,
        step: 2,
        totalSteps: 3,
        message: 'Processing data...'
      });

      setTools((data || []) as any);

      // Log the operation
      await logCRUD('tools', 'READ', 'Loaded tools list', {
        tool_count: data?.length || 0,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      setOperationProgress({
        isActive: true,
        step: 3,
        totalSteps: 3,
        message: 'Complete!'
      });

      // Hide progress after a moment
      setTimeout(() => {
        setOperationProgress({ isActive: false, step: 0, totalSteps: 0, message: '' });
      }, 1000);

    } catch (e: any) {
      setError(e.message || 'Failed to load tools');
      setOperationProgress({ isActive: false, step: 0, totalSteps: 0, message: '' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let base = activeTab === 'all' ? tools : tools.filter((t) => t.status === activeTab);
    
    // Apply advanced search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter((t) =>
        [t.name, t.website, t.category, t.pricing, t.description, (t.tags || []).join(' ')].join(' ').toLowerCase().includes(q)
      );
    }
    
    // Apply advanced filters
    filters.forEach(filter => {
      base = base.filter(t => {
        const value = t[filter.field as keyof ToolForm];
        if (!value) return false;
        
        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'equals':
            return String(value).toLowerCase() === String(filter.value).toLowerCase();
          case 'starts_with':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          default:
            return true;
        }
      });
    });
    
    return base;
  }, [tools, activeTab, searchQuery, filters]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const startCreate = () => {
    setEditing({
      name: '',
      website: '',
      category: '',
      pricing: 'Unknown',
      description: '',
      status: 'draft',
    });
    setShowForm(true);
  };

  const saveTool = async (form: ToolForm) => {
    setError('');
    try {
      if (form.id) {
        const { error } = await supabase.from('tools').update(form).eq('id', form.id);
        if (error) return setError(error.message);
        
        // Log the update operation
        await logCRUD('tools', 'UPDATE', `Updated tool: ${form.name}`, {
          tool_id: form.id,
          tool_name: form.name,
          updated_fields: Object.keys(form).filter(key => key !== 'id'),
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      } else {
        const { error } = await supabase.from('tools').insert([form]);
        if (error) return setError(error.message);
        
        // Log the create operation
        await logCRUD('tools', 'CREATE', `Created new tool: ${form.name}`, {
          tool_name: form.name,
          category: form.category,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      }
      setShowForm(false);
      setEditing(null);
      loadTools();
    } catch (e: any) {
      setError(e.message || 'Failed to save tool');
    }
  };

  const publishTool = async (t: ToolForm) => {
    const { error } = await supabase.from('tools').update({ status: 'published' }).eq('id', t.id);
    if (!error) loadTools();
  };

  const unpublishTool = async (t: ToolForm) => {
    const { error } = await supabase.from('tools').update({ status: 'draft' }).eq('id', t.id);
    if (!error) loadTools();
  };

  const archiveTool = async (t: ToolForm) => {
    const { error } = await supabase.from('tools').update({ status: 'archived' }).eq('id', t.id);
    if (!error) loadTools();
  };

  const enrichFromUrl = async () => {
    if (!enrichUrl) return;
    try {
      setEnriching(true);
      const res = await fetch('/api/admin/tools/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: enrichUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Enrich failed');
      setEditing((prev) => ({ ...(prev || { name: '', website: '', category: '', pricing: 'Unknown', description: '', status: 'draft' }), ...data }));
      setShowForm(true);
    } catch (e: any) {
      setError(e.message || 'Failed to enrich');
    } finally {
      setEnriching(false);
    }
  };

  const statusBadgeClasses = (status: ToolStatus) => {
    if (status === 'published') return 'bg-green-100 text-green-800 ring-1 ring-green-200 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-800/60';
    if (status === 'draft') return 'bg-amber-100 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/60';
    return 'bg-gray-100 text-gray-800 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700';
  };

  if (loading) return (
    <div className="p-6">
      <LoadingOverlay message="Loading tools..." />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with enhanced controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tools Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage {tools.length} AI tools with advanced features
          </p>
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`px-4 py-2.5 rounded-md text-sm font-medium border transition-colors ${
              showAdvancedSearch 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            🔍 Advanced Search
          </button>
          
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-4 py-2.5 rounded-md text-sm font-medium border transition-colors ${
              showAnalytics 
                ? 'bg-purple-600 text-white border-purple-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
          >
            📊 Analytics
          </button>
          
          <button
            onClick={startCreate}
            className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            ➕ Create Tool
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <AdminErrorDisplay
          type="error"
          title="Operation Failed"
          message={error}
          actions={[
            { label: 'Dismiss', onClick: () => setError('') },
            { label: 'Retry', onClick: loadTools }
          ]}
        />
      )}

      {/* Progress Tracker */}
      {operationProgress.isActive && (
        <AdminProgressTracker
          steps={[
            { id: '1', label: 'Connect', status: operationProgress.step >= 1 ? 'completed' : 'pending' },
            { id: '2', label: 'Process', status: operationProgress.step >= 2 ? 'completed' : 'pending' },
            { id: '3', label: 'Complete', status: operationProgress.step >= 3 ? 'completed' : 'pending' }
          ]}
          currentStep={operationProgress.step.toString()}
        />
      )}

      {/* Advanced Search Panel */}
      {showAdvancedSearch && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
            🔍 AI-Powered Advanced Search
          </h3>
          <AdvancedSearch
            onSearch={(query, filters) => {
              onSearchChange(query);
              // Apply filters
              filters.forEach(filter => onFilterChange(filter));
            }}
            data={tools}
            showFilters={true}
            showSuggestions={true}
            placeholder="Search tools with AI intelligence..."
          />
        </div>
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-3">
            📊 Tools Analytics Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{tools.filter(t => t.status === 'published').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
              <div className="text-2xl font-bold text-yellow-600">{tools.filter(t => t.status === 'draft').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
              <div className="text-2xl font-bold text-gray-600">{tools.filter(t => t.status === 'archived').length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Archived</div>
            </div>
          </div>
        </div>
      )}

      {/* Enrich from URL */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          🔗 Enrich Tool from URL
        </h3>
        <div className="flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            placeholder="https://example.com"
            aria-label="Enrich from URL"
            value={enrichUrl}
            onChange={(e) => setEnrichUrl(e.target.value)}
          />
          <button
            onClick={enrichFromUrl}
            disabled={enriching}
            className="px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            {enriching ? <LoadingSpinner size="sm" /> : 'Enrich from URL'}
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {(['all','draft','published','archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab===tab}
            className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
              activeTab===tab
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-500'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            {tab} ({activeTab === tab ? filtered.length : tools.filter(t => tab === 'all' ? true : t.status === tab).length})
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Showing {paginatedResults.length} of {filtered.length} tools
            {searchQuery.trim() && ` matching "${searchQuery}"`}
            {filters.length > 0 && ` with ${filters.length} filter${filters.length === 1 ? '' : 's'}`}
          </span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Enhanced Tools Display */}
      <div className="grid md:grid-cols-2 gap-4">
        {paginatedResults.map((t) => (
          <div key={t.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">{t.name}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex gap-2">
                  {t.category && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{t.category}</span>}
                  {t.pricing && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{t.pricing}</span>}
                </div>
              </div>
              <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 ring-1 ${statusBadgeClasses(t.status)}`}>{t.status}</span>
            </div>
            <div className="text-sm leading-6 text-gray-700 dark:text-gray-300 mb-3">{t.description}</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setEditing(t); setShowForm(true); }} className="px-3.5 py-2 rounded-md text-sm border border-gray-400 text-gray-900 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" title="Edit tool">Edit</button>
              {t.status !== 'published' ? (
                <button onClick={async () => {
                  setError('');
                  const res = await fetch('/api/admin/tools/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: t.id }) });
                  const data = await res.json();
                  if (!res.ok) return setError(data.error || 'Failed to publish');
                  loadTools();
                }} className="px-3.5 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/60">Publish</button>
              ) : (
                <button onClick={() => unpublishTool(t)} className="px-3.5 py-2 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60">Unpublish</button>
              )}
              <button onClick={() => archiveTool(t)} className="px-3.5 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/60">Archive</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}

      {/* No Results */}
      {paginatedResults.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tools found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery.trim() || filters.length > 0 
              ? 'Try adjusting your search criteria or filters'
              : 'No tools match the current status filter'
            }
          </p>
          {(searchQuery.trim() || filters.length > 0) && (
            <button
              onClick={() => {
                onSearchChange('');
                clearFilters();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 max-w-2xl w-full rounded-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{editing.id ? 'Edit Tool' : 'Create Tool'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Close">✕</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Name" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.name} onChange={(e) => setEditing({ ...(editing as ToolForm), name: e.target.value })} />
              <input placeholder="Website" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.website} onChange={(e) => setEditing({ ...(editing as ToolForm), website: e.target.value })} />
              <input placeholder="Category" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.category} onChange={(e) => setEditing({ ...(editing as ToolForm), category: e.target.value })} />
              <input placeholder="Pricing" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.pricing} onChange={(e) => setEditing({ ...(editing as ToolForm), pricing: e.target.value })} />
            </div>
            <textarea placeholder="Short description" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md w-full" rows={3} value={editing.description} onChange={(e) => setEditing({ ...(editing as ToolForm), description: e.target.value })} />
            <textarea placeholder="Long description" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md w-full" rows={5} value={editing.longDescription || ''} onChange={(e) => setEditing({ ...(editing as ToolForm), longDescription: e.target.value })} />
            <input placeholder="Tags (comma-separated)" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md w-full" value={(editing.tags || []).join(', ')} onChange={(e) => setEditing({ ...(editing as ToolForm), tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
            <div className="grid md:grid-cols-2 gap-4">
              <input placeholder="Logo URL" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.logo || ''} onChange={(e) => setEditing({ ...(editing as ToolForm), logo: e.target.value })} />
              <input placeholder="OG Image URL" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.og_image_url || ''} onChange={(e) => setEditing({ ...(editing as ToolForm), og_image_url: e.target.value })} />
              <input placeholder="Favicon URL" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.favicon_url || ''} onChange={(e) => setEditing({ ...(editing as ToolForm), favicon_url: e.target.value })} />
              <select className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md" value={editing.status} onChange={(e) => setEditing({ ...(editing as ToolForm), status: e.target.value as ToolStatus })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <textarea placeholder="Curator notes" className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md w-full" rows={3} value={editing.curator_notes || ''} onChange={(e) => setEditing({ ...(editing as ToolForm), curator_notes: e.target.value })} />
            <div className="flex gap-2">
              <button onClick={() => saveTool(editing)} className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Save</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2.5 rounded-md text-sm border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolsManagementClient() {
  return (
    <AdminAuthWrapper>
      {(user) => <ToolsManagementContent />}
    </AdminAuthWrapper>
  );
}


