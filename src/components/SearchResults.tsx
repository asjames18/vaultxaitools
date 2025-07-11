'use client';

import Link from 'next/link';
import { Tool } from '@/data';

// Icons
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

interface SearchResultsProps {
  tools: Tool[];
  showStats?: boolean;
  className?: string;
}

export default function SearchResults({ tools, showStats = true, className = "" }: SearchResultsProps) {
  if (tools.length === 0) {
    return (
      <div className={`text-center py-12 no-results ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No tools found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results Stats */}
      {showStats && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Search Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {tools.length} tools found
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {Math.round(tools.reduce((sum, tool) => sum + tool.rating, 0) / tools.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {tools.reduce((sum, tool) => sum + tool.weeklyUsers, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link
            key={tool.id}
            href={`/tool/${tool.id}`}
            className="group search-result-card"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tool.logo}</div>
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {tool.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({tool.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {tool.category}
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {tool.growth} growth
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{tool.weeklyUsers.toLocaleString()} users/week</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span className="text-sm font-medium">View Details</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 