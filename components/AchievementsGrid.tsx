'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import AchievementBadge, { Achievement } from './AchievementBadge';

interface AchievementsGridProps {
  earned: Achievement[];
  all: Achievement[];
}

export default function AchievementsGrid({ earned, all }: AchievementsGridProps) {
  const earnedSlugs = new Set(earned.map((a) => a.slug));
  const locked = all.filter((a) => !earnedSlugs.has(a.slug));
  const total = all.length;
  const earnedCount = earned.length;
  const progressPct = total > 0 ? Math.round((earnedCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Achievement Progress</span>
          </div>
          <span className="text-green-400 font-bold text-lg">{earnedCount}/{total}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">{progressPct}% complete</p>
      </div>

      {/* Earned section */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-green-400">Earned</span>
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-medium px-2 py-0.5 rounded-full">
            {earnedCount}
          </span>
        </h3>

        {earnedCount === 0 ? (
          <p className="text-gray-500 text-sm italic">No achievements earned yet. Start exploring!</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {earned.map((achievement) => (
              <AchievementBadge key={achievement.slug} achievement={achievement} earned size="md" />
            ))}
          </div>
        )}
      </div>

      {/* Locked section */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-gray-400">Locked</span>
            <span className="bg-gray-700 text-gray-400 border border-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {locked.length}
            </span>
          </h3>
          <div className="flex flex-wrap gap-6">
            {locked.map((achievement) => (
              <AchievementBadge key={achievement.slug} achievement={achievement} earned={false} size="md" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
