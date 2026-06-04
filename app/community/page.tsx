import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Connect with builders deploying AI agents, automation systems, and MCP servers. Share what you built, get feedback, find collaborators.',
};

const spotlights = [
  {
    name: 'Marcus W.',
    role: 'Agency Automation Lead',
    built: 'AI Research Agent',
    result: 'Cut manual research time 60% — deployed in under 2 hours.',
    avatar: '👨‍💻',
    tags: ['agents', 'research', 'automation'],
  },
  {
    name: 'Aisha J.',
    role: 'Entrepreneur & Creator',
    built: 'Automated Client Pipeline',
    result: 'Generated $1.2K MRR in month 1 using prompt packs + MCP templates.',
    avatar: '👩‍🚀',
    tags: ['products', 'mcp-servers', 'revenue'],
  },
  {
    name: 'DeShawn C.',
    role: 'Educator & Tech Instructor',
    built: 'Live Agent Teaching Tool',
    result: 'Students deploy real agents in the same session using the MIT marketplace.',
    avatar: '🎓',
    tags: ['education', 'agents', 'deployment'],
  },
];

const channels = [
  { name: 'Agent Builders', description: 'Share agents, get feedback, find collab partners.', count: '200+ members', icon: '🤖' },
  { name: 'MCP Developers', description: 'Building and integrating MCP servers. Swap notes.', count: '80+ members', icon: '🔌' },
  { name: 'Automation Business', description: 'Turning agent systems into revenue. War stories welcome.', count: '150+ members', icon: '💰' },
  { name: 'Beginners & Learners', description: 'Just starting out. No question is too basic here.', count: '300+ members', icon: '🌱' },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
            Builder Community
          </span>
          <h1 className="text-5xl font-black leading-tight">
            Connect. Build.<br />Show Your Work.
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            A community of builders deploying AI agents, automating workflows, and turning agent systems into real revenue. You&apos;re not alone in this.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/creators"
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-white">
              Share What You Built
            </Link>
            <Link href="/marketplace"
              className="px-6 py-3 border border-white/20 hover:border-green-500/50 text-gray-300 hover:text-green-400 font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-green-500">
              Browse the Marketplace
            </Link>
          </div>
        </div>

        {/* Builder spotlights */}
        <section>
          <div className="mb-8">
            <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-2">Builder Spotlights</p>
            <h2 className="text-2xl font-bold">What the Community Is Building</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlights.map(builder => (
              <div key={builder.name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl">
                    {builder.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{builder.name}</p>
                    <p className="text-xs text-gray-500">{builder.role}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-1">Built</p>
                  <p className="font-bold text-white">{builder.built}</p>
                </div>
                <p className="text-gray-400 text-sm">{builder.result}</p>
                <div className="flex flex-wrap gap-1.5">
                  {builder.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-600 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community channels */}
        <section>
          <div className="mb-8">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-2">Channels</p>
            <h2 className="text-2xl font-bold">Find Your People</h2>
            <p className="text-gray-400 mt-2">Our community is organized by what you&apos;re building. Jump into the channel that fits.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map(ch => (
              <div key={ch.name}
                className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500/30 transition-all">
                <div className="text-3xl flex-shrink-0">{ch.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-white">{ch.name}</p>
                    <span className="text-xs text-gray-500">{ch.count}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{ch.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Share your automation */}
        <section id="share" className="scroll-mt-20">
          <div className="mb-8">
            <p className="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-2">Share</p>
            <h2 className="text-2xl font-bold">Show What You Built</h2>
            <p className="text-gray-400 mt-2">Submit your automation, agent, or project. We feature community builds weekly.</p>
          </div>

          <form
            action="/api/contact"
            method="POST"
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <input type="hidden" name="source" value="community-share" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="share-name" className="block text-sm font-semibold text-gray-300">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input id="share-name" name="name" type="text" required placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="share-email" className="block text-sm font-semibold text-gray-300">
                  Email <span className="text-red-400">*</span>
                </label>
                <input id="share-email" name="email" type="email" required placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="share-project" className="block text-sm font-semibold text-gray-300">
                What did you build? <span className="text-red-400">*</span>
              </label>
              <input id="share-project" name="project_name" type="text" required
                placeholder="Name of your agent, automation, or system"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label htmlFor="share-url" className="block text-sm font-semibold text-gray-300">Link / Demo URL</label>
              <input id="share-url" name="project_url" type="url" placeholder="GitHub, demo, or video link"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <label htmlFor="share-description" className="block text-sm font-semibold text-gray-300">
                Tell us about it <span className="text-red-400">*</span>
              </label>
              <textarea id="share-description" name="message" required rows={4}
                placeholder="What does it do? What MIT tools did you use? What was the result?"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none" />
            </div>

            <button type="submit"
              className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Submit Your Build
            </button>
            <p className="text-xs text-gray-600 text-center">Featured builds get highlighted in the weekly builder digest.</p>
          </form>
        </section>

        {/* Bottom nav */}
        <div className="text-center border-t border-white/10 pt-12 space-y-4">
          <p className="text-gray-400">Ready to build something?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/agents" className="px-5 py-2.5 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">Browse Agents</Link>
            <Link href="/mcp-servers" className="px-5 py-2.5 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">MCP Servers</Link>
            <Link href="/products" className="px-5 py-2.5 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">Shop Products</Link>
            <Link href="/creators" className="px-5 py-2.5 border border-white/10 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-sm transition-colors focus-visible:outline-2 focus-visible:outline-green-500">Creator Program</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
