import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Marketplace — Melanated In Tech',
  description: 'Browse production-ready AI agents built for creators, entrepreneurs, and builders. Deploy in minutes, monetize in hours.',
};

export const revalidate = 3600;

export default async function AgentsPage() {
  const supabase = await createClient();

  const { data: tools } = await supabase
    .from('tools')
    .select('id, name, description, category, rating, website')
    .eq('category', 'AI Agents')
    .order('rating', { ascending: false })
    .limit(50);

  const agents = tools ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 mb-4">
            Agent Marketplace
          </span>
          <h1 className="text-5xl font-bold mb-4">AI Agent Marketplace</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Production-ready agents that automate your workflows, research your markets, and create content at scale. Deploy in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/products"
              className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              Browse Blueprints →
            </Link>
            <Link
              href="/mcp-servers"
              className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              MCP Servers →
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
        {agents.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">Agents coming soon.</p>
            <p className="text-sm mt-2">We&apos;re curating the best AI agents for you.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/tool/${agent.id}`}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-green-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">
                    AI Agent
                  </span>
                  <span className="text-xs text-gray-600 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    Ready to Deploy
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                  {agent.name}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-3 flex-1">
                  {agent.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {agent.rating ? (
                    <span className="flex items-center gap-1 text-sm text-yellow-400">
                      <span>★</span>
                      <span>{agent.rating.toFixed(1)}</span>
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-green-400 group-hover:translate-x-1 transition-transform">
                    View & Deploy →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-white/10 pt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-bold">Built an agent?</h2>
            <p className="text-gray-400 text-sm">Submit it to the marketplace. We review and list production-ready agents that help our builder community.</p>
            <Link
              href="/contact"
              className="inline-block mt-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              Submit Your Agent
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-bold">Get weekly agent drops</h2>
            <p className="text-gray-400 text-sm">New agents, deployment guides, and automation playbooks — straight to your inbox.</p>
            <Link
              href="/#email-capture"
              className="inline-block mt-2 px-5 py-2.5 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              Get Agent Blueprints
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
