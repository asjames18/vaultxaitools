'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/lib/useFavorites';
import { HeartIcon, StarIcon, GlobeAltIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { Tool } from '@/data';

interface ToolDetailsClientProps {
  tool: Tool;
}

export default function ToolDetailsClient({ tool }: ToolDetailsClientProps) {
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    setIsFavoriteState(isFavorite(tool.id));
  }, [isFavorite, tool.id]);

  const handleToggleFavorite = async () => {
    await toggleFavorite(tool.id);
    setIsFavoriteState(!isFavoriteState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/AITools"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Tools
          </Link>
        </div>

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tool Icon and Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-600 dark:text-gray-300">
                {tool.logo || tool.name.charAt(0)}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  
                  {/* Category and Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                      <TagIcon className="w-4 h-4" />
                      {tool.category}
                    </span>
                    {tool.tags && tool.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Favorite Button */}
                <button
                  onClick={handleToggleFavorite}
                  disabled={loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                    isFavoriteState
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                      : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HeartIcon className={`w-5 h-5 ${isFavoriteState ? 'fill-current' : ''}`} />
                  )}
                  {isFavoriteState ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rating and Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rating & Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <StarIcon className="w-6 h-6 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tool.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.reviewCount} reviews
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.weeklyUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weekly users</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {tool.growth}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Growth</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.pricing}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pricing</p>
                </div>
              </div>
            </div>

            {/* Long Description */}
            {tool.longDescription && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {tool.longDescription}
                </p>
              </div>
            )}

            {/* Features */}
            {tool.features && tool.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros and Cons */}
            {(tool.pros || tool.cons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Pros</h2>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {tool.cons && tool.cons.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Cons</h2>
                    <ul className="space-y-2">
                      {tool.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Website Link */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Get Started</h3>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <GlobeAltIcon className="w-5 h-5" />
                Visit Website
              </a>
            </div>

            {/* Alternatives */}
            {tool.alternatives && tool.alternatives.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alternatives</h3>
                <div className="space-y-2">
                  {tool.alternatives.slice(0, 5).map((alternative, index) => (
                    <div
                      key={index}
                      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center text-sm font-semibold">
                          {alternative?.logo || (alternative?.name ? alternative.name.charAt(0) : '?')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{alternative?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Rating: {alternative?.rating || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 