import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products — Melanated In Tech',
  description: 'Prompt packs, blueprints, templates, and guides built for AI agent builders. One-time purchase. Instant download.',
};

export const revalidate = 3600;

const categoryLabel: Record<string, string> = {
  'prompt-pack': 'Prompt Pack',
  'template': 'Template',
  'blueprint': 'Blueprint',
  'guide': 'Guide',
  'course': 'Course',
};

const categoryColors: Record<string, string> = {
  'prompt-pack': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'template': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'blueprint': 'text-green-400 bg-green-500/10 border-green-500/20',
  'guide': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  'course': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('id, name, description, price, slug, category, tags')
    .eq('status', 'live')
    .order('created_at', { ascending: false });

  const allProducts = products ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 mb-4">
            Marketplace
          </span>
          <h1 className="text-5xl font-bold mb-4">Products</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Prompt packs, automation blueprints, templates, and guides — built for AI agent builders. One-time purchase. Instant download.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/agents" className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
              Browse Agents →
            </Link>
            <Link href="/mcp-servers" className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
              MCP Servers →
            </Link>
            <Link href="/skills" className="px-4 py-2 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
              Agent Skills →
            </Link>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-gray-500">
          {['One-time payment', 'Instant download', 'Lifetime access', 'Works with Claude, GPT-4, Gemini', 'Secure via Stripe'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="text-green-400">✓</span>
              {item}
            </span>
          ))}
        </div>

        {/* Grid */}
        {allProducts.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <p className="text-lg">Products coming soon.</p>
            <p className="text-sm mt-2">We&apos;re building the catalog. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => {
              const label = categoryLabel[product.category] ?? product.category;
              const colorClass = categoryColors[product.category] ?? 'text-green-400 bg-green-500/10 border-green-500/20';
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-green-500"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
                      {label}
                    </span>
                    <span className="text-xl font-bold text-white">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold mb-2 group-hover:text-green-400 transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-3 flex-1">{product.description}</p>

                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {product.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs text-gray-600 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">One-time · Instant download</span>
                    <span className="text-xs text-green-400 group-hover:translate-x-1 transition-transform">
                      View & Buy →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 border-t border-white/10 pt-16 text-center space-y-4">
          <h2 className="text-2xl font-bold">Need a custom blueprint?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We build bespoke automation systems, prompt packs, and agent architectures for teams and founders.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            Talk to the Team
          </Link>
        </div>

      </div>
    </div>
  );
}
