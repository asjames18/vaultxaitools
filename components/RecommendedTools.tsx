'use client';

import React from 'react';
import { Star, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface RecommendedTool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  logo?: string;
  reason: string;
}

interface RecommendedToolsProps {
  tools: RecommendedTool[];
}

function ToolCard({ tool }: { tool: RecommendedTool }) {
  return (
    <div className="flex-shrink-0 w-64 bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 hover:border-green-500/40 transition-all duration-200 hover:shadow-[0_0_12px_2px_rgba(74,222,128,0.08)]">
      {/* Logo + name */}
      <div className="flex items-center gap-3">
        {tool.logo && /^https?:\/\/|^\//.test(tool.logo) ? (
          <img
            src={tool.logo}
            alt={tool.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-800"
          />
        ) : tool.logo ? (
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 text-xl">
            {tool.logo}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-green-400" />
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-white font-semibold text-sm truncate">{tool.name}</h4>
          <span className="inline-block bg-gray-800 border border-gray-700 text-gray-300 text-[10px] font-medium px-1.5 py-0.5 rounded-full truncate max-w-full">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-xs leading-snug line-clamp-2 flex-1">{tool.description}</p>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-green-400 fill-green-400" />
        <span className="text-green-400 text-xs font-semibold">{tool.rating.toFixed(1)}</span>
        <span className="text-gray-600 text-xs">/ 5.0</span>
      </div>

      {/* Reason chip */}
      <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
        <Sparkles className="w-3 h-3 text-green-400 flex-shrink-0" />
        <span className="text-green-400 text-[11px] font-medium truncate">{tool.reason}</span>
      </div>

      {/* CTA */}
      <Link
        href={`/tool/${tool.id}`}
        className="flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-400 text-black text-xs font-bold py-2 rounded-lg transition-colors duration-200"
      >
        View Tool
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
}

export default function RecommendedTools({ tools }: RecommendedToolsProps) {
  if (tools.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <h4 className="text-white font-semibold mb-1">No recommendations yet</h4>
        <p className="text-gray-500 text-sm">
          Explore and favorite some tools to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold text-lg">Recommended for You</h3>
        <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-medium px-2 py-0.5 rounded-full">
          {tools.length}
        </span>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
