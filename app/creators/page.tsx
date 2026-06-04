import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Creator — Melanated In Tech',
  description: 'Sell your AI agents, MCP servers, agent skills, and automation blueprints on the MIT Marketplace. Earn from every sale.',
};

const listingTypes = [
  {
    type: 'AI Agent',
    description: 'Production-ready agents that automate workflows, research, content creation, or customer support.',
    requirements: ['Documented deployment steps', 'Tested with at least one LLM provider', 'Clear use-case description'],
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    type: 'MCP Server',
    description: 'Model Context Protocol servers that give agents access to APIs, databases, or real-world data.',
    requirements: ['Stable and documented API', 'README with integration guide', 'Works with at least one MCP-compatible client'],
    color: 'border-purple-500/30 bg-purple-500/5',
    badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    type: 'Agent Skill',
    description: 'Plug-and-play capabilities that extend agent behavior — SEO, brand voice, code review, and more.',
    requirements: ['Clear skill description and expected output', 'Compatible with standard agent frameworks', 'Example usage included'],
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    type: 'Blueprint / Prompt Pack',
    description: 'Automation systems, prompt packs, templates, or guides that help builders ship faster.',
    requirements: ['Instant digital delivery', 'Works with major LLMs (Claude, GPT-4, Gemini)', 'Includes a quick-start guide'],
    color: 'border-yellow-500/30 bg-yellow-500/5',
    badge: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  },
];

const steps = [
  { num: '01', title: 'Submit your listing', body: 'Fill out the form below with details about your agent, server, skill, or product. We review every submission.' },
  { num: '02', title: 'We review & test', body: 'Our team evaluates your submission for quality, documentation, and real-world deployability. Turnaround: 3–5 business days.' },
  { num: '03', title: 'Go live', body: 'Approved listings go live in the marketplace. You get a creator profile, product page, and direct purchase flow.' },
  { num: '04', title: 'Earn from every sale', body: 'Creators keep 80% of every sale. Payouts processed monthly via Stripe.' },
];

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            Creator Program
          </span>
          <h1 className="text-5xl font-black leading-tight">
            Build It. List It.<br />Get Paid.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            The MIT Marketplace connects Black builders and creators with an audience that&apos;s actively deploying AI agents and automation systems. List your work and earn from every sale.
          </p>
          <a
            href="#submit"
            className="inline-block px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Submit Your Listing
          </a>
        </div>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(step => (
              <div key={step.num} className="space-y-3">
                <span className="text-4xl font-black text-green-400/20">{step.num}</span>
                <h3 className="font-bold text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue callout */}
        <div className="bg-green-950/30 border border-green-800/50 rounded-2xl p-10 text-center space-y-3">
          <p className="text-5xl font-black text-green-400">80%</p>
          <p className="text-xl font-bold text-white">Creator Revenue Share</p>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            You keep 80% of every sale. MIT keeps 20% to cover platform costs, payment processing, and curation. Payouts via Stripe, monthly.
          </p>
        </div>

        {/* What we accept */}
        <section>
          <h2 className="text-2xl font-bold mb-3">What We Accept</h2>
          <p className="text-gray-400 mb-8">We list four types of products on the MIT Marketplace. Each has a quality bar to ensure buyers get real value.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listingTypes.map(item => (
              <div key={item.type} className={`rounded-2xl border p-6 space-y-4 ${item.color}`}>
                <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${item.badge}`}>
                  {item.type}
                </span>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">Requirements</p>
                  <ul className="space-y-1">
                    {item.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submission form */}
        <section id="submit" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">Submit Your Listing</h2>
          <p className="text-gray-400 mb-8">Fill out the form and we&apos;ll review your submission within 3–5 business days.</p>

          <form
            action="/api/contact"
            method="POST"
            className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <input type="hidden" name="source" value="creator-submission" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="creator-name" className="block text-sm font-semibold text-gray-300">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="creator-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="creator-email" className="block text-sm font-semibold text-gray-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="creator-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="listing-type" className="block text-sm font-semibold text-gray-300">
                What are you submitting? <span className="text-red-400">*</span>
              </label>
              <select
                id="listing-type"
                name="listing_type"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="" disabled>Select a type</option>
                <option value="ai-agent">AI Agent</option>
                <option value="mcp-server">MCP Server</option>
                <option value="agent-skill">Agent Skill</option>
                <option value="blueprint">Blueprint / Prompt Pack</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="listing-name" className="block text-sm font-semibold text-gray-300">
                Listing Name <span className="text-red-400">*</span>
              </label>
              <input
                id="listing-name"
                name="listing_name"
                type="text"
                required
                placeholder="What is your agent/server/skill/product called?"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="listing-link" className="block text-sm font-semibold text-gray-300">
                Link / Demo URL
              </label>
              <input
                id="listing-link"
                name="listing_url"
                type="url"
                placeholder="GitHub repo, demo, or landing page"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="listing-description" className="block text-sm font-semibold text-gray-300">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="listing-description"
                name="message"
                required
                rows={5}
                placeholder="Describe what it does, who it's for, how it works, and what makes it production-ready."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="listing-price" className="block text-sm font-semibold text-gray-300">
                Intended Price (USD)
              </label>
              <input
                id="listing-price"
                name="price"
                type="text"
                placeholder="e.g. $29, $49, Free"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Submit for Review
            </button>

            <p className="text-xs text-gray-600 text-center">
              We review every submission. You&apos;ll hear back within 3–5 business days.
            </p>
          </form>
        </section>

        {/* Browse marketplace */}
        <div className="text-center space-y-4 border-t border-white/10 pt-12">
          <p className="text-gray-400">Want to browse first before submitting?</p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-3 border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400 font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
          >
            Browse the Marketplace
          </Link>
        </div>

      </div>
    </div>
  );
}
