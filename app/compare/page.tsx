'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToolById } from '@/data';

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('compare-tools');
    const selected: string[] = raw ? JSON.parse(raw) : [];
    setIds(selected);
    (async () => {
      const fetched = await Promise.all(selected.map((id) => getToolById(id)));
      setTools(fetched.filter(Boolean) as any[]);
    })();
  }, []);

  const clear = () => {
    localStorage.removeItem('compare-tools');
    setIds([]);
    setTools([]);
  };

  if (ids.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Compare Tools</h1>
        <p className="text-gray-600 mb-4">No tools selected. Use the Compare button on tool cards to add up to 3 tools.</p>
        <Link href="/search" className="text-blue-600 underline">Browse tools</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Compare Tools</h1>
        <button onClick={clear} className="px-3 py-1.5 border rounded">Clear</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-3 py-2 text-left">Attribute</th>
              {tools.map((t) => (
                <th key={t.id} className="border px-3 py-2 text-left">
                  <Link href={`/tool/${t.id}`} className="text-blue-600 underline">{t.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Category', (t:any)=>t.category],
              ['Pricing', (t:any)=>t.pricing],
              ['Website', (t:any)=> (<a href={t.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit</a>)],
              ['Features', (t:any)=> (t.features?.join(', ') || '—')],
              ['Pros', (t:any)=> (t.pros?.join(', ') || '—')],
              ['Cons', (t:any)=> (t.cons?.join(', ') || '—')],
              ['Tags', (t:any)=> (t.tags?.join(', ') || '—')],
            ].map(([label, picker]) => (
              <tr key={label as string}>
                <td className="border px-3 py-2 font-medium">{label as string}</td>
                {tools.map((t) => (
                  <td key={t.id + (label as string)} className="border px-3 py-2">{(picker as any)(t)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



