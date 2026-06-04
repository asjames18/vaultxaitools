import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Server Directory — Melanated In Tech',
  description: 'Find Model Context Protocol servers that extend your AI agents with real-world tools, databases, and APIs. Reviewed and ready to integrate.',
};

export const revalidate = 3600;

export default async function MCPServersPage() {
  const supabase = await createClient();

  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, description, category, rating, website')
    .eq('category', 'MCP Servers')
    .order('rating', { ascending: false })
    .limit(50);

  const servers = tools ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 mb-4">
            MCP Directory
          </span>
          <h1 className="text-5xl font-bold mb-4">MCP Server Directory</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Model Context Protocol servers that give your AI agents access to databases, APIs, files, and real-world tools. Reviewed and integration-ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/agents"
              className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              Browse Agents →
            </Link>
            <Link
              href="/skills"
              className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              Agent Skills →
            </Link>
          </div>
        </div>

        {/* Grid */}
        {servers.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">MCP Servers coming soon.</p>
            <p className="text-sm mt-2">We&apos;re cataloging the best MCP servers for builders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Link
                key={server.id}
                href={`/tool/${server.id}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-green-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">
                    MCP Server
                  </span>
                  <span className="text-xs text-gray-600 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    Community Reviewed
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {server.name}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 flex-1">{server.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  {server.rating ? (
                    <span className="flex items-center gap-1 text-sm text-yellow-400">
                      <span>★</span>
                      <span>{server.rating.toFixed(1)}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-green-400 group-hover:translate-x-1 transition-transform">
                    View & Integrate →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-white/10 pt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-bold">Built an MCP Server?</h2>
            <p className="text-gray-400 text-sm">Submit it to the directory. We list servers that are stable, documented, and integration-ready.</p>
            <Link
              href="/contact"
              className="inline-block mt-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              Submit Your MCP Server
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-bold">New MCP servers weekly</h2>
            <p className="text-gray-400 text-sm">Get notified when new servers drop — plus integration guides and use-case playbooks.</p>
            <Link
              href="/#email-capture"
              className="inline-block mt-2 px-5 py-2.5 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              Get Weekly MCP Drops
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
