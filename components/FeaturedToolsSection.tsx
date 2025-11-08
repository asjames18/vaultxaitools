import React, { memo } from 'react';
import Link from 'next/link';
import { Tool } from '@/data/tools';
import { HeartIcon, ArrowRightIcon } from '@/components/icons';

interface FeaturedToolsSectionProps {
  tools: Tool[];
  favoriteTools: string[];
  favoriteLoading: string | null;
  toggleFavorite: (toolId: string) => void;
  addToRecentlyViewed: (toolId: string) => void;
}

const FeaturedToolsSection = memo(function FeaturedToolsSection({
  tools,
  favoriteTools,
  favoriteLoading,
  toggleFavorite,
  addToRecentlyViewed
}: FeaturedToolsSectionProps) {
  const featuredTools = tools.slice(0, 6);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Featured Media Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the most popular and trending media production tools in our collection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {featuredTools.map((tool) => (
            <div
              key={tool.id}
              className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300">
                        {tool.logo || tool.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">{tool.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    disabled={favoriteLoading === tool.id}
                    className={`transition-colors ${favoriteTools.includes(tool.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ${favoriteLoading === tool.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={favoriteTools.includes(tool.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favoriteLoading === tool.id ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HeartIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${favoriteTools.includes(tool.id) ? 'fill-current' : ''}`} />
                    )}
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link
                    href={`/tool/${tool.id}`}
                    onClick={() => addToRecentlyViewed(tool.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-transform"
                  >
                    Learn More →
                  </Link>
                  {tool.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">{tool.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/AITools"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View All Tools
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
});

export default FeaturedToolsSection;

