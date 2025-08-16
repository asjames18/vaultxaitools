'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import AdminAuthWrapper from '../AdminAuthWrapper';

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

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setTools((data || []) as any);
    } catch (e: any) {
      setError(e.message || 'Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const base = activeTab === 'all' ? tools : tools.filter((t) => t.status === activeTab);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter((t) =>
      [t.name, t.website, t.category, t.pricing, t.description, (t.tags || []).join(' ')].join(' ').toLowerCase().includes(q)
    );
  }, [tools, activeTab, query]);

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
    if (form.id) {
      const { error } = await supabase.from('tools').update(form).eq('id', form.id);
      if (error) return setError(error.message);
    } else {
      const { error } = await supabase.from('tools').insert([form]);
      if (error) return setError(error.message);
    }
    setShowForm(false);
    setEditing(null);
    loadTools();
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

  if (loading) return <div className="p-6">Loading tools…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Tools Management</h1>
        <div className="flex gap-2 items-center">
          <input
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            placeholder="Search by name/website/tags"
            aria-label="Search tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2.5 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
            {enriching ? 'Enriching…' : 'Enrich from URL'}
          </button>
          <button
            onClick={startCreate}
            className="px-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          >
            Create Tool
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all','draft','published','archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab===tab}
            className={`px-3.5 py-2 rounded-md text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${activeTab===tab
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:border-blue-500'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
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


