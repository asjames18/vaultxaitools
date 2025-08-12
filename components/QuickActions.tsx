'use client';

import Link from 'next/link';

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const quickActions = [
  {
    title: "AI Consulting",
    description: "Expert AI guidance",
    icon: RocketIcon,
    href: "/consulting",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Get Started",
    description: "New to AI? Start here",
    icon: StarIcon,
    href: "/categories/getting-started",
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    title: "Top Rated",
    description: "Highest rated tools",
    icon: FireIcon,
    href: "/search?sort=rating",
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    title: "Popular",
    description: "Most used AI tools",
    icon: FireIcon,
    href: "/search?sort=popular",
    color: "red",
    gradient: "from-red-500 to-pink-500"
  },
  {
    title: "Submit Tool",
    description: "Add a new AI tool",
    icon: PlusIcon,
    href: "/submit-tool",
    color: "green",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function QuickActions() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get started quickly with these popular options
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 