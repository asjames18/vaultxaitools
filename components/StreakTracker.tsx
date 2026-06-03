'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface StreakTrackerProps {
  streakCount: number;
  lastActiveDate: string | null;
}

function getMotivationalMessage(streak: number): string {
  if (streak === 0) return 'Start your streak!';
  if (streak <= 2) return 'Getting started!';
  if (streak <= 6) return 'Building momentum!';
  return 'On fire!';
}

function getStreakColor(streak: number): string {
  if (streak === 0) return 'text-gray-400';
  if (streak <= 2) return 'text-green-400';
  if (streak <= 6) return 'text-green-500';
  return 'text-green-400';
}

export default function StreakTracker({ streakCount, lastActiveDate }: StreakTrackerProps) {
  const message = getMotivationalMessage(streakCount);
  const streakColor = getStreakColor(streakCount);
  const isActive = streakCount > 0;

  const formattedDate = lastActiveDate
    ? new Date(lastActiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div
      className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-5 transition-all duration-300 ${
        isActive
          ? 'border-green-500/40 shadow-[0_0_16px_2px_rgba(74,222,128,0.12)]'
          : 'border-gray-800'
      }`}
    >
      {/* Flame / icon */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full text-3xl select-none transition-all duration-300 ${
          isActive ? 'bg-green-500/15' : 'bg-gray-800'
        }`}
      >
        {streakCount >= 7 ? '🔥' : streakCount >= 3 ? '🌱' : streakCount >= 1 ? '✨' : '💤'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-extrabold leading-none ${streakColor}`}>
            {streakCount}
          </span>
          <span className="text-gray-400 text-sm font-medium">
            {streakCount === 1 ? 'day' : 'days'}
          </span>
        </div>
        <p className={`text-sm font-semibold mt-0.5 ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
          {message}
        </p>
        {formattedDate && (
          <div className="flex items-center gap-1 mt-1.5 text-gray-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>Last active {formattedDate}</span>
          </div>
        )}
      </div>

      {/* Streak label */}
      <div className="flex-shrink-0 text-right">
        <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">Current<br />Streak</p>
      </div>
    </div>
  );
}
