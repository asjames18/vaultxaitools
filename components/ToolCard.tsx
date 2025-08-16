'use client';
import React from 'react';
import Link from 'next/link';
import { Tool } from '../data/tools';
import { useFavorites } from '@/lib/useFavorites';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TrustBadge } from './TrustBadges';
// Ratings removed for now

export default function ToolCard({ tool }: { tool: Tool }) {
  const { isFavorite, addFavorite, removeFavorite, loading } = useFavorites();
  const fav = isFavorite(tool.id);
  const [compareSet, setCompareSet] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('compare-tools');
    setCompareSet(raw ? JSON.parse(raw) : []);
  }, []);

  const toggleCompare = () => {
    const raw = localStorage.getItem('compare-tools');
    const current: string[] = raw ? JSON.parse(raw) : [];
    let next: string[];
    if (current.includes(tool.id)) {
      next = current.filter((id) => id !== tool.id);
    } else {
      next = current.length >= 3 ? [...current.slice(1), tool.id] : [...current, tool.id];
    }
    localStorage.setItem('compare-tools', JSON.stringify(next));
    setCompareSet(next);
  };

  const handleClick = () => {
    if (fav) {
      removeFavorite(tool.id);
    } else {
      addFavorite(tool.id);
    }
  };

  // Determine trust badges based on tool properties
  const getTrustBadges = () => {
    const badges = [];
    
    if (tool.rating >= 4.5) {
      badges.push('top-rated');
    }
    if (tool.rating >= 4.0) {
      badges.push('expert-tested');
    }
    if (tool.reviewCount > 100) {
      badges.push('community-favorite');
    }
    if (tool.weeklyUsers > 10000) {
      badges.push('editors-pick');
    }
    
    return badges;
  };

  const trustBadges = getTrustBadges();

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

      {/* Trust Badges */}
      {trustBadges.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {trustBadges.map((badgeType) => (
            <TrustBadge 
              key={badgeType} 
              type={badgeType as any} 
              toolName={tool.name} 
            />
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
      <p className="text-gray-600 mb-1">{tool.description}</p>
      <p className="text-sm text-gray-500 italic mb-4">
        {tool.category} • {tool.pricing}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <Link href={`/tool/${tool.id}`} className="text-blue-600 hover:underline">
          Learn More →
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleCompare}
            className={`text-sm px-2 py-1 border rounded ${compareSet.includes(tool.id) ? 'bg-blue-600 text-white' : ''}`}
            aria-pressed={compareSet.includes(tool.id)}
            aria-label={compareSet.includes(tool.id) ? 'Remove from compare' : 'Add to compare'}
          >
            {compareSet.includes(tool.id) ? 'Compared' : 'Compare'}
          </button>
          {/* rating widget removed */}
        </div>
      </div>
    </div>
  );
} 