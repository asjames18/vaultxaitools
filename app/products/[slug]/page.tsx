import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import BuyButton from './BuyButton';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .eq('status', 'live')
    .single();

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — Melanated In Tech`,
    description: product.description,
  };
}

const categoryLabel: Record<string, string> = {
  'prompt-pack': 'Prompt Pack',
  'template': 'Template',
  'blueprint': 'Blueprint',
  'guide': 'Guide',
  'course': 'Course',
};

const categoryUseCases: Record<string, string[]> = {
  'prompt-pack': [
    'Content teams automating copy at scale',
    'Freelancers building repeatable client workflows',
    'Entrepreneurs drafting high-converting outreach',
  ],
  'template': [
    'Agencies deploying repeatable client deliverables',
    'Builders scaffolding new automation projects fast',
    'Teams standardizing their AI workflow outputs',
  ],
  'blueprint': [
    'Founders building their first automated system',
    'Operators replacing manual processes with AI',
    'Developers prototyping agent architectures',
  ],
  'guide': [
    'Beginners learning agent infrastructure hands-on',
    'Teams upskilling on MCP server integration',
    'Entrepreneurs mapping their AI automation strategy',
  ],
  'course': [
    'Self-taught builders adding structured depth',
    'Teams getting everyone to the same skill level',
    'Freelancers expanding their service offerings',
  ],
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: relatedProducts }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'live')
      .single(),
    supabase
      .from('products')
      .select('id, name, description, price, slug, category')
      .eq('status', 'live')
      .neq('slug', slug)
      .limit(3),
  ]);

  if (!product) notFound();

  const price = (product.price / 100).toFixed(2);
  const label = categoryLabel[product.category] ?? product.category;
  const useCases = categoryUseCases[product.category] ?? categoryUseCases['blueprint'];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
          <Link href="/products" className="hover:text-green-400 transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
            Products
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-400">{product.name}</span>
        </nav>

        {/* Category badge */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            {label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Left: Details (3/5 width) */}
          <div className="md:col-span-3 space-y-10">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-400 text-lg">{product.description}</p>
            </div>

            {/* What you'll build */}
            {product.tags?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">What&apos;s Included</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 text-sm bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Long description */}
            {product.long_description && (
              <div>
                <h2 className="text-xl font-bold mb-4">About This {label}</h2>
                <div
                  className="prose prose-invert prose-sm max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
              </div>
            )}

            {/* Use cases */}
            <div>
              <h2 className="text-xl font-bold mb-4">Who This Is For</h2>
              <ul className="space-y-3">
                {useCases.map((useCase, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            {/* Creator block */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Curated by</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 font-bold">
                  MIT
                </div>
                <div>
                  <p className="font-semibold text-white">Melanated In Tech Team</p>
                  <p className="text-sm text-gray-500">Vetted, tested, and ready to deploy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Purchase card (2/5 width) */}
          <div className="md:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sticky top-8 space-y-6">
              <div>
                <div className="text-5xl font-bold text-white mb-1">${price}</div>
                <p className="text-gray-400 text-sm">One-time payment. Instant download.</p>
              </div>

              <BuyButton productSlug={product.slug} productName={product.name} />

              <ul className="space-y-2.5 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Instant digital delivery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Works with Claude, GPT-4, Gemini
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Secure checkout via Stripe
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 30-day satisfaction guarantee
                </li>
              </ul>

              <div className="pt-2 border-t border-white/10 text-center">
                <p className="text-xs text-gray-600">
                  Questions?{' '}
                  <Link href="/contact" className="text-green-400 hover:text-green-300 transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <h2 className="text-2xl font-bold mb-8">Builders Also Grabbed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/30 rounded-2xl p-6 transition-all duration-200 flex flex-col focus-visible:outline-2 focus-visible:outline-green-500"
                >
                  <span className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-2">
                    {categoryLabel[p.category] ?? p.category}
                  </span>
                  <h3 className="font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 flex-1">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-green-400 font-bold">${(p.price / 100).toFixed(2)}</span>
                    <span className="text-xs text-gray-500 group-hover:text-green-400 transition-colors">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross-sell to marketplace */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white">Looking for a full agent system?</p>
            <p className="text-gray-400 text-sm">Browse production-ready agents and MCP servers in the marketplace.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/agents"
              className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              Browse Agents
            </Link>
            <Link
              href="/mcp-servers"
              className="px-5 py-2.5 border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400 font-semibold rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
            >
              MCP Servers
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
