'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Tool } from '@/lib/types/tool';
import { X, Star, Users, ExternalLink } from 'lucide-react';

export default function ComparePage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const raw = localStorage.getItem('compare-tools');
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (ids.length === 0) { setLoading(false); return; }
        const { data } = await supabase.from('tools').select('*').in('id', ids);
        if (data) {
          setTools(data.map((t: any): Tool => ({
            id: t.id,
            name: t.name,
            logo: t.logo || '🔧',
            description: t.description,
            longDescription: t.long_description,
            category: t.category,
            rating: t.rating || 0,
            reviewCount: t.review_count || 0,
            weeklyUsers: t.weekly_users || 0,
            growth: t.growth || '0%',
            website: t.website || '',
            pricing: t.pricing || 'Unknown',
            features: t.features,
            pros: t.pros,
            cons: t.cons,
            tags: t.tags,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
          })));
        }
      } catch (err) {
        console.error('Error loading comparison tools:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const removeTool = (id: string) => {
    const raw = localStorage.getItem('compare-tools');
    const current: string[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem('compare-tools', JSON.stringify(current.filter((cid) => cid !== id)));
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => {
    localStorage.removeItem('compare-tools');
    setTools([]);
  };

  const rows: { label: string; render: (t: Tool) => React.ReactNode }[] = [
    { label: 'Category', render: (t) => t.category || '—' },
    { label: 'Pricing', render: (t) => t.pricing || '—' },
    {
      label: 'Rating',
      render: (t) => (
        <span className="inline-flex items-center gap-1 justify-center">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {(t.rating || 0).toFixed(1)}
        </span>
      ),
    },
    { label: 'Reviews', render: (t) => (t.reviewCount || 0).toLocaleString() },
    {
      label: 'Weekly Users',
      render: (t) => (
        <span className="inline-flex items-center gap-1 justify-center">
          <Users className="w-4 h-4 text-gray-400" />
          {(t.weeklyUsers || 0).toLocaleString()}
        </span>
      ),
    },
    { label: 'Growth', render: (t) => t.growth || '—' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Tools</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Side-by-side comparison of up to 3 AI tools</p>
          </div>
          {tools.length > 0 && (
            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {loading && <div className="text-center py-20 text-gray-500">Loading…</div>}

        {!loading && tools.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tools to compare</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Click "Compare" on any tool card to add it here. You can compare up to 3 tools at once.
            </p>
            <Link href="/AITools" className="inline-flex items-center px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
              Browse AI Tools
            </Link>
          </div>
        )}

        {!loading && tools.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-32">Feature</th>
                  {tools.map((tool) => (
                    <th key={tool.id} className="p-3 relative align-top">
                      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 relative">
                        <button
                          onClick={() => removeTool(tool.id)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${tool.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="text-3xl mb-2">{tool.logo}</div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{tool.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</div>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          <Link href={`/tool/${tool.id}`} className="text-xs text-green-500 hover:text-green-400 transition-colors">
                            Details →
                          </Link>
                          {tool.website && (
                            <a href={tool.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors">
                              Visit <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                  {tools.length < 3 && (
                    <th className="p-3 align-top">
                      <Link href="/AITools" className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-green-500 dark:hover:border-green-500 transition-colors min-h-[120px]">
                        <div className="text-2xl mb-1 text-gray-400">+</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Add a tool</div>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ label, render }) => (
                  <tr key={label} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-4 text-center text-sm text-gray-900 dark:text-white">
                        {render(tool)}
                      </td>
                    ))}
                    {tools.length < 3 && <td />}
                  </tr>
                ))}

                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-top">Pros</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-sm align-top">
                      {tool.pros && (tool.pros as string[]).length > 0 ? (
                        <ul className="space-y-1">
                          {(tool.pros as string[]).slice(0, 4).map((pro, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-green-700 dark:text-green-400">
                              <span>✓</span><span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  ))}
                  {tools.length < 3 && <td />}
                </tr>

                <tr className="border-t border-gray-100 dark:border-gray-800">
                  <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-top">Cons</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-sm align-top">
                      {tool.cons && (tool.cons as string[]).length > 0 ? (
                        <ul className="space-y-1">
                          {(tool.cons as string[]).slice(0, 4).map((con, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-red-600 dark:text-red-400">
                              <span>✗</span><span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  ))}
                  {tools.length < 3 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
