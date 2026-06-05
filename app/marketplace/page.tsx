import { createClientWithoutCookies } from '@/lib/supabase-server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace — Melanated In Tech',
  description: 'The practical ecosystem for AI agent commerce. Browse agents, MCP servers, skills, and products built by the community.',
};

export const revalidate = 3600;

const categoryLabel: Record<string, string> = {
  'prompt-pack': 'Prompt Pack',
  'template': 'Template',
  'blueprint': 'Blueprint',
  'guide': 'Guide',
  'course': 'Course',
};

const trendingTags = [
  'customer-support', 'content-generation', 'research', 'automation',
  'seo', 'code-review', 'lead-generation', 'data-extraction',
];

export default async function MarketplacePage() {
  const supabase = createClientWithoutCookies();

  const [
    { data: featuredAgents },
    { data: featuredServers },
    { data: featuredProducts },
    { data: featuredSkills },
  ] = await Promise.all([
    supabase.from('tools').select('id, name, description, category, rating').eq('category', 'AI Agents').order('rating', { ascending: false }).limit(6),
    supabase.from('tools').select('id, name, description, category, rating').eq('category', 'MCP Servers').order('rating', { ascending: false }).limit(3),
    supabase.from('products').select('id, name, description, price, slug, category').eq('status', 'live').order('created_at', { ascending: false }).limit(3),
    supabase.from('tools').select('id, name, description, category, rating').eq('category', 'Agent Skills').order('rating', { ascending: false }).limit(3),
  ]);

  const agents = featuredAgents ?? [];
  const servers = featuredServers ?? [];
  const products = featuredProducts ?? [];
  const skills = featuredSkills ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            AI Agent Commerce
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-tight">The MIT Marketplace</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Agents, MCP servers, skills, and blueprints &mdash; everything you need to deploy and monetize AI automation systems.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {trendingTags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full hover:border-green-500/30 hover:text-green-400 transition-colors cursor-default">#{tag}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { label: 'Agents', href: '/agents', color: 'bg-green-500 hover:bg-green-400 text-black' },
              { label: 'MCP Servers', href: '/mcp-servers', color: 'border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400' },
              { label: 'Skills', href: '/skills', color: 'border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400' },
              { label: 'Products', href: '/products', color: 'border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400' },
            ].map(item => (
              <Link key={item.href} href={item.href} className={`px-5 py-2.5 font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500 ${item.color}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Agents */}
        {agents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-1">Top Rated</p>
                <h2 className="text-2xl font-bold">Featured Agents</h2>
              </div>
              <Link href="/agents" className="text-sm text-green-400 hover:text-green-300 transition-colors">View all &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <Link key={agent.id} href={`/tool/${agent.id}`} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">AI Agent</span>
                    <span className="text-xs text-gray-600 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">Ready to Deploy</span>
                  </div>
                  <h3 className="font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{agent.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 flex-1">{agent.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    {agent.rating ? <span className="flex items-center gap-1 text-sm text-yellow-400">&#9733; {agent.rating.toFixed(1)}</span> : <span />}
                    <span className="text-xs text-green-400 group-hover:translate-x-1 transition-transform">View &amp; Deploy &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products + MCP grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {products.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-1">Blueprints &amp; Packs</p>
                  <h2 className="text-2xl font-bold">New Products</h2>
                </div>
                <Link href="/products" className="text-sm text-green-400 hover:text-green-300 transition-colors">View all &rarr;</Link>
              </div>
              <div className="space-y-4">
                {products.map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-green-500">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{categoryLabel[p.category] ?? p.category}</p>
                      <p className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">{p.name}</p>
                      <p className="text-gray-400 text-sm line-clamp-1 mt-0.5">{p.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white">${(p.price / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">one-time</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {servers.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-1">Integrations</p>
                  <h2 className="text-2xl font-bold">MCP Servers</h2>
                </div>
                <Link href="/mcp-servers" className="text-sm text-green-400 hover:text-green-300 transition-colors">View all &rarr;</Link>
              </div>
              <div className="space-y-4">
                {servers.map(server => (
                  <Link key={server.id} href={`/tool/${server.id}`} className="group flex items-start gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-green-500">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm flex-shrink-0">MCP</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-green-400 transition-colors">{server.name}</p>
                      <p className="text-gray-400 text-sm line-clamp-2 mt-0.5">{server.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Agent Skills */}
        {skills.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Plug &amp; Play</p>
                <h2 className="text-2xl font-bold">Agent Skills</h2>
              </div>
              <Link href="/skills" className="text-sm text-green-400 hover:text-green-300 transition-colors">View all &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {skills.map(skill => (
                <Link key={skill.id} href={`/tool/${skill.id}`} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-xl p-5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-green-500">
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Agent Skill</span>
                  <h3 className="font-bold text-white mt-1 mb-1.5 group-hover:text-green-400 transition-colors">{skill.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{skill.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Creator CTA */}
        <section className="border-t border-white/10 pt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <span className="text-xs text-green-400 font-semibold uppercase tracking-widest">For Builders</span>
            <h2 className="text-2xl font-bold">Sell on the MIT Marketplace</h2>
            <p className="text-gray-400">Built an agent, MCP server, skill, or automation blueprint? List it and earn from every sale.</p>
            <Link href="/creators" className="inline-block px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-white">Become a Creator</Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Stay Updated</span>
            <h2 className="text-2xl font-bold">Weekly Marketplace Drops</h2>
            <p className="text-gray-400">New agents, MCP server drops, and automation blueprints &mdash; every week in your inbox.</p>
            <Link href="/#email-capture" className="inline-block px-6 py-3 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-green-500">Get Weekly Drops</Link>
          </div>
        </section>

      </div>
    </div>
  );
}
