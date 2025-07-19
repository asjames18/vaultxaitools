'use client';

import Link from 'next/link';
import { Tool } from '@/data';
import AffiliateLink from './AffiliateLink';
import AccessibleRating from './AccessibleRating';
import QuickVoteCard from './QuickVoteCard';

interface SearchResultsProps {
  tools: Tool[];
}

export default function SearchResults({ tools }: SearchResultsProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tools found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
          {/* Tool Image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl text-gray-400 dark:text-gray-500">
                {tool.logo}
              </div>
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {tool.category}
              </span>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <AccessibleRating rating={tool.rating} size="sm" aria-label={`${tool.name} rating: ${tool.rating} out of 5 stars`} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {tool.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {tool.description}
            </p>

            {/* Tool Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>👥 {tool.weeklyUsers.toLocaleString()} users/week</span>
              <span>📈 {tool.growth}</span>
            </div>

            {/* Pricing and Quick Vote */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {tool.pricing}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {tool.reviewCount} reviews
                </span>
              </div>
              <QuickVoteCard
                toolId={tool.id}
                currentRating={tool.rating}
                currentReviewCount={tool.reviewCount}
                compact={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <AffiliateLink
                href={tool.website}
                toolId={tool.id}
                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Visit Tool
              </AffiliateLink>
              <Link
                href={`/tool/${tool.id}`}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Learn more about ${tool.name}`}
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 