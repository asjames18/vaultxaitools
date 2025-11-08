'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, TrendingUp, Users, ExternalLink, Share2, Bookmark } from 'lucide-react';
import { Tool } from '@/data/tools';
import OptimizedImage from './OptimizedImage';

interface MobileToolCardProps {
  tool: Tool;
  onFavoriteToggle?: (toolId: string) => void;
  isFavorite?: boolean;
  onShare?: (tool: Tool) => void;
  onBookmark?: (tool: Tool) => void;
  showActions?: boolean;
}

export default function MobileToolCard({
  tool,
  onFavoriteToggle,
  isFavorite = false,
  onShare,
  onBookmark,
  showActions = true
}: MobileToolCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(tool.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(tool);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(tool);
  };

  const formatUserCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md active:scale-[0.98]">
      {/* Header with Image and Actions */}
      <div className="relative">
        {/* Tool Image */}
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
          {tool.logo ? (
            <OptimizedImage
              src={tool.logo}
              alt={`${tool.name} logo`}
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                {tool.name.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorite
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 mx-auto ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareClick}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              aria-label="Share tool"
            >
              <Share2 className="w-5 h-5 mx-auto" />
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 rounded-full backdrop-blur-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
              aria-label="Bookmark tool"
            >
              <Bookmark className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tool Name and Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2">
              {tool.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${getRatingColor(tool.rating)} fill-current`} />
                  <span className={`text-sm font-medium ${getRatingColor(tool.rating)}`}>
                    {tool.rating}
                  </span>
                  {tool.reviewCount > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({tool.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${
            showFullDescription ? '' : 'line-clamp-2'
          }`}>
            {tool.description}
          </p>
          {tool.description.length > 120 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2 hover:underline"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-sm">
          {tool.weeklyUsers > 0 && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{formatUserCount(tool.weeklyUsers)} users</span>
            </div>
          )}
          {tool.growth && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>{tool.growth}</span>
            </div>
          )}
          <div className="text-gray-600 dark:text-gray-400">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              tool.pricing === 'Free' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : tool.pricing === 'Freemium'
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
            }`}>
              {tool.pricing}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/tool/${tool.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 active:scale-[0.98]"
          >
            View Details
          </Link>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200 active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Visit</span>
          </a>
        </div>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {tool.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
              {tool.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                  +{tool.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
