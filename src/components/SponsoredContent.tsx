"use client";

import { useState } from 'react';
import Link from 'next/link';
import AffiliateLink from './AffiliateLink';
import type { Tool } from '@/data/tools';
import { getSponsoredBadgeStyle } from '@/lib/affiliate';

interface SponsoredContentProps {
  tools: Tool[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
  className?: string;
  showDisclosure?: boolean;
}

export default function SponsoredContent({
  tools,
  title = "Sponsored Tools",
  subtitle = "Tools that help support VaultX",
  maxItems = 3,
  className = "",
  showDisclosure = true
}: SponsoredContentProps) {
  const [showFullDisclosure, setShowFullDisclosure] = useState(false);
  const sponsoredBadge = getSponsoredBadgeStyle();
  
  const displayTools = tools.slice(0, maxItems);

  if (displayTools.length === 0) return null;

  return (
    <section className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {sponsoredBadge.icon} {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          </div>
          
          {/* Disclosure Toggle */}
          {showDisclosure && (
            <button
              onClick={() => setShowFullDisclosure(!showFullDisclosure)}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
            >
              {showFullDisclosure ? 'Hide' : 'Show'} Disclosure
            </button>
          )}
        </div>

        {/* Full Disclosure */}
        {showDisclosure && showFullDisclosure && (
          <div className="mb-6 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Sponsored Content Disclosure
            </h4>
            <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
              This section contains sponsored content. Tools featured here have paid for placement to help support VaultX AI Tools. 
              We maintain editorial independence and only feature tools we believe provide value to our users. 
              Sponsored placement does not guarantee positive reviews or recommendations.
            </p>
          </div>
        )}

        {/* Sponsored Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              {/* Sponsored Badge */}
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${sponsoredBadge.className} shadow-sm`}>
                {sponsoredBadge.icon} {sponsoredBadge.text}
              </div>

              <div className="p-4">
                {/* Tool Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{tool.logo}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {tool.category}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {tool.description}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {tool.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.weeklyUsers.toLocaleString()} users
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <AffiliateLink
                    href={tool.website}
                    toolId={tool.id}
                    isSponsored={true}
                    hasAffiliate={true}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                  >
                    Visit Site
                  </AffiliateLink>
                  
                  <Link
                    href={`/tool/${tool.id}`}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Disclosure */}
        {showDisclosure && (
          <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              💎 Sponsored content helps support VaultX AI Tools. We maintain editorial independence.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Compact sponsored content for sidebars
export function CompactSponsoredContent({
  tools,
  maxItems = 2,
  className = ""
}: {
  tools: Tool[];
  maxItems?: number;
  className?: string;
}) {
  const sponsoredBadge = getSponsoredBadgeStyle();
  const displayTools = tools.slice(0, maxItems);

  if (displayTools.length === 0) return null;

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 ${className}`}>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-1">
          {sponsoredBadge.icon} Sponsored
        </h4>
        
        <div className="space-y-3">
          {displayTools.map((tool) => (
            <div key={tool.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">{tool.logo}</div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {tool.name}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    ⭐ {tool.rating}
                  </p>
                </div>
              </div>
              
              <AffiliateLink
                href={tool.website}
                toolId={tool.id}
                isSponsored={true}
                hasAffiliate={true}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 px-2 rounded transition-colors text-center block"
              >
                Visit Site
              </AffiliateLink>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
          💎 Sponsored content
        </p>
      </div>
    </div>
  );
} 