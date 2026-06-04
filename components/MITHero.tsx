import Link from 'next/link';
import EmailCapture from '@/components/EmailCapture';

export default function MITHero() {
  return (
    <section className="w-full bg-black py-20 px-4 text-center">
      {/* Badge */}
      <div className="inline-block mb-6">
        <span className="px-3 py-1 rounded-full border border-green-500 text-green-400 text-sm font-semibold tracking-wide uppercase">
          AI Agent Commerce Ecosystem
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
        The Practical Ecosystem for AI Agent Commerce
      </h1>

      {/* Sub-headline */}
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
        Pre-built agents, MCP servers, and production-ready skills — deploy in minutes, monetize in hours. Built by Black creators, for everyone building with AI.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <Link
          href="/agents"
          className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Browse Marketplace
        </Link>
        <Link
          href="/products/content-creation-prompt-pack"
          className="px-8 py-4 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold rounded-lg transition-colors text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        >
          Shop Products
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 max-w-2xl mx-auto mb-10" />

      {/* Email Capture */}
      <p className="text-gray-400 text-sm mb-4">Get weekly agent blueprints. Automation playbooks, MCP server drops, and marketplace launches — straight to your inbox.</p>
      <EmailCapture source="homepage-hero" />

      {/* Stats Row */}
      <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-gray-500">
        {[
          '15+ AI Agents',
          '5 MCP Servers',
          '10+ Products',
          'Built for Builders',
        ].map((stat, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="hidden sm:inline text-gray-700">·</span>}
            <span className="text-white font-semibold">{stat}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
