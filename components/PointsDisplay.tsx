'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  level: string;
}

interface LevelConfig {
  color: string;
  bg: string;
  border: string;
  nextLevelPoints: number;
  currentLevelMinPoints: number;
  label: string;
}

const LEVEL_ORDER = ['Explorer', 'Learner', 'Builder', 'Innovator', 'Pioneer'];

const LEVEL_CONFIG: Record<string, LevelConfig> = {
  Explorer: {
    color: 'text-gray-300',
    bg: 'bg-gray-700',
    border: 'border-gray-600',
    currentLevelMinPoints: 0,
    nextLevelPoints: 100,
    label: 'Explorer',
  },
  Learner: {
    color: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/40',
    currentLevelMinPoints: 100,
    nextLevelPoints: 300,
    label: 'Learner',
  },
  Builder: {
    color: 'text-green-500',
    bg: 'bg-green-600/20',
    border: 'border-green-600/40',
    currentLevelMinPoints: 300,
    nextLevelPoints: 600,
    label: 'Builder',
  },
  Innovator: {
    color: 'text-green-400',
    bg: 'bg-green-700/20',
    border: 'border-green-700/40',
    currentLevelMinPoints: 600,
    nextLevelPoints: 1000,
    label: 'Innovator',
  },
  Pioneer: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/15',
    border: 'border-yellow-400/40',
    currentLevelMinPoints: 1000,
    nextLevelPoints: Infinity,
    label: 'Pioneer',
  },
};

export default function PointsDisplay({ points, level }: PointsDisplayProps) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG['Explorer'];
  const isMaxLevel = cfg.nextLevelPoints === Infinity;
  const currentIdx = LEVEL_ORDER.indexOf(level);
  const nextLevel = currentIdx >= 0 && currentIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currentIdx + 1] : null;

  const progressPct = isMaxLevel
    ? 100
    : Math.min(
        100,
        Math.round(
          ((points - cfg.currentLevelMinPoints) /
            (cfg.nextLevelPoints - cfg.currentLevelMinPoints)) *
            100
        )
      );

  const pointsToNext = isMaxLevel ? 0 : cfg.nextLevelPoints - points;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-green-400" />
          <span className="text-white font-semibold text-lg">Points & Level</span>
        </div>

        {/* Level badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}
        >
          {cfg.label}
        </span>
      </div>

      {/* Points value */}
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-extrabold text-white leading-none">{points.toLocaleString()}</span>
        <span className="text-gray-400 text-base">points</span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{isMaxLevel ? 'Max level reached!' : `Progress to ${nextLevel ?? ''}`}</span>
          {!isMaxLevel && (
            <span className="text-green-400 font-medium">{pointsToNext.toLocaleString()} pts to go</span>
          )}
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Level roadmap */}
      <div className="flex items-center justify-between gap-1 pt-1">
        {LEVEL_ORDER.map((lvl, i) => {
          const isCurrentOrPast = LEVEL_ORDER.indexOf(level) >= i;
          const isCurrent = lvl === level;
          return (
            <div key={lvl} className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-green-400 ring-2 ring-green-400/40 scale-125'
                    : isCurrentOrPast
                    ? 'bg-green-600'
                    : 'bg-gray-700'
                }`}
              />
              <span
                className={`text-[10px] font-medium text-center leading-none ${
                  isCurrent ? 'text-green-400' : isCurrentOrPast ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                {lvl}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
