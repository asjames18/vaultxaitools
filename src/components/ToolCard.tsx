'use client';
import React from 'react';
import Link from 'next/link';
import { Tool } from '../data/tools';
import { useFavorites } from '@/lib/useFavorites';
import { Heart } from 'lucide-react';
import QuickVoteCard from './QuickVoteCard';

export default function ToolCard({ tool }: { tool: Tool }) {
  const { isFavorite, addFavorite, removeFavorite, loading } = useFavorites();
  const fav = isFavorite(tool.id);

  const handleClick = () => {
    if (fav) {
      removeFavorite(tool.id);
    } else {
      addFavorite(tool.id);
    }
  };

  return (
    <div className="relative border rounded-lg p-4 shadow hover:shadow-lg transition">
      <button
        onClick={handleClick}
        className="absolute top-2 right-2"
        aria-label={fav ? 'Unfavorite' : 'Favorite'}
        disabled={loading}
      >
        <Heart
          className={fav ? 'text-red-500' : ''}
          fill={fav ? 'currentColor' : 'none'}
        />
      </button>

      <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600 mb-1">{tool.description}</p>
      <p className="text-sm text-gray-500 italic mb-4">
        {tool.category} • {tool.pricing}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <Link href={`/tool/${tool.id}`} className="text-blue-600 hover:underline">
          Learn More →
        </Link>
        <QuickVoteCard
          toolId={tool.id}
          currentRating={tool.rating}
          currentReviewCount={tool.reviewCount}
          compact={true}
        />
      </div>
    </div>
  );
} 