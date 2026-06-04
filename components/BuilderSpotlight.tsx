'use client';

import Link from 'next/link';

interface Builder {
  name: string;
  role: string;
  built: string;
  result: string;
  avatar: string;
  href: string;
}

const builders: Builder[] = [
  {
    name: 'Marcus W.',
    role: 'Agency Automation Lead',
    built: 'AI Research Agent',
    result: 'Cut manual research time 60% — deployed in under 2 hours using the MIT marketplace.',
    avatar: '👨‍💻',
    href: '/agents',
  },
  {
    name: 'Aisha J.',
    role: 'Entrepreneur & Creator',
    built: 'Automated Client Pipeline',
    result: 'Generated $1.2K MRR in the first month using MIT prompt packs and MCP server templates.',
    avatar: '👩‍🚀',
    href: '/products',
  },
  {
    name: 'DeShawn C.',
    role: 'Educator & Tech Instructor',
    built: 'Live Agent Teaching Tool',
    result: 'Uses the MIT agent marketplace to show students real deployed agents they can fork and extend.',
    avatar: '🎓',
    href: '/marketplace',
  },
];

export default function BuilderSpotlight() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400 rounded-full border border-green-500/30 mb-4">
            Community Builders
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Builders Are Making
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real people deploying real automation systems. This is what building with MIT looks like.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {builders.map((builder) => (
            <div
              key={builder.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-green-500/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl">
                  {builder.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{builder.name}</p>
                  <p className="text-xs text-gray-500">{builder.role}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-green-400 font-semibold uppercase tracking-widest">Built</p>
                <p className="font-bold text-white">{builder.built}</p>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">{builder.result}</p>

              <Link
                href={builder.href}
                className="inline-block text-xs text-green-400 hover:text-green-300 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
              >
                See similar →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/creators"
            className="inline-block px-6 py-3 border border-green-500 text-green-400 hover:bg-green-500/10 font-bold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-green-500"
          >
            Share What You Built →
          </Link>
        </div>
      </div>
    </section>
  );
}
