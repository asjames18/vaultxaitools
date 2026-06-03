'use client';

import React, { useState } from 'react';
import { Trophy, Star, Heart, MessageSquare, Users, Target, Zap, Award, Crown, Gem, Lock } from 'lucide-react';

export interface Achievement {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: 'engagement' | 'content' | 'social' | 'milestone' | 'special';
  points_reward: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'first-review': Star,
  'review-master': Trophy,
  'helpful-reviewer': Heart,
  'community-contributor': Users,
  'tool-explorer': Target,
  'power-user': Zap,
  'veteran': Crown,
  'diamond': Gem,
  'engagement-champion': Award,
  'content-creator': MessageSquare,
};

const SIZE_CONFIG = {
  sm: {
    container: 'w-16 h-16',
    iconWrapper: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-xs',
    points: 'text-[10px]',
  },
  md: {
    container: 'w-24 h-24',
    iconWrapper: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-sm',
    points: 'text-xs',
  },
  lg: {
    container: 'w-32 h-32',
    iconWrapper: 'w-16 h-16',
    icon: 'w-8 h-8',
    text: 'text-base',
    points: 'text-sm',
  },
};

export default function AchievementBadge({ achievement, earned = false, size = 'md' }: AchievementBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const IconComponent = ICON_MAP[achievement.slug] ?? Trophy;
  const s = SIZE_CONFIG[size];

  return (
    <div
      className="relative inline-flex flex-col items-center gap-1 cursor-pointer group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Badge circle */}
      <div
        className={`${s.container} rounded-full flex items-center justify-center transition-all duration-300 ${
          earned
            ? 'bg-gray-900 border-2 border-green-500 shadow-[0_0_12px_2px_rgba(74,222,128,0.45)]'
            : 'bg-gray-800 border-2 border-gray-700 opacity-50'
        }`}
      >
        <div
          className={`${s.iconWrapper} rounded-full flex items-center justify-center ${
            earned ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'
          }`}
        >
          {earned ? (
            <IconComponent className={s.icon} />
          ) : (
            <Lock className={s.icon} />
          )}
        </div>
      </div>

      {/* Name */}
      <span className={`${s.text} font-medium text-center leading-tight max-w-[7rem] ${earned ? 'text-white' : 'text-gray-500'}`}>
        {achievement.name}
      </span>

      {/* Points */}
      <span className={`${s.points} font-semibold ${earned ? 'text-green-400' : 'text-gray-600'}`}>
        {achievement.points_reward} pts
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl pointer-events-none">
          <p className="text-white text-xs font-semibold mb-1">{achievement.name}</p>
          <p className="text-gray-400 text-xs leading-snug">{achievement.description}</p>
          <div className="mt-2 flex items-center gap-1">
            <Star className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs">{achievement.points_reward} points</span>
          </div>
          {!earned && (
            <p className="text-gray-500 text-xs mt-1 italic">Not yet earned</p>
          )}
        </div>
      )}
    </div>
  );
}
