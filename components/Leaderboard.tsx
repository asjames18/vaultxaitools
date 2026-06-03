'use client';

import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardUser {
  display_name: string;
  avatar_url?: string | null;
  points: number;
  level: string;
  rank: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserRank?: number;
}

const LEVEL_BADGE: Record<string, string> = {
  Explorer: 'bg-gray-700 text-gray-300 border-gray-600',
  Learner: 'bg-green-500/20 text-green-400 border-green-500/40',
  Builder: 'bg-green-600/20 text-green-500 border-green-600/40',
  Innovator: 'bg-green-700/20 text-green-400 border-green-700/40',
  Pioneer: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/40',
};

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-gray-500 text-sm font-bold w-5 text-center">{rank}</span>;
}

function RankRowStyle(rank: number, isCurrentUser: boolean): string {
  if (isCurrentUser) return 'bg-green-500/10 border border-green-500/30';
  if (rank === 1) return 'bg-yellow-400/5 border border-yellow-400/20';
  if (rank === 2) return 'bg-gray-300/5 border border-gray-300/15';
  if (rank === 3) return 'bg-amber-600/5 border border-amber-600/15';
  return 'bg-gray-900 border border-gray-800';
}

function Avatar({ name, url }: { name: string; url?: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-gray-800"
      />
    );
  }
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
      <span className="text-gray-300 text-xs font-bold">{initials}</span>
    </div>
  );
}

export default function Leaderboard({ users, currentUserRank }: LeaderboardProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold text-lg">Leaderboard</h3>
      </div>

      {users.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No leaderboard data yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const isCurrentUser = currentUserRank !== undefined && user.rank === currentUserRank;
            const badgeClass = LEVEL_BADGE[user.level] ?? LEVEL_BADGE['Explorer'];

            return (
              <div
                key={`${user.rank}-${user.display_name}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${RankRowStyle(
                  user.rank,
                  isCurrentUser
                )}`}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-6 flex justify-center">
                  <RankIcon rank={user.rank} />
                </div>

                {/* Avatar */}
                <Avatar name={user.display_name} url={user.avatar_url} />

                {/* Name + level */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isCurrentUser ? 'text-green-400' : 'text-white'
                      }`}
                    >
                      {user.display_name}
                      {isCurrentUser && (
                        <span className="ml-1 text-green-500 text-xs font-normal">(you)</span>
                      )}
                    </span>
                  </div>
                  <span
                    className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-0.5 ${badgeClass}`}
                  >
                    {user.level}
                  </span>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <span className={`text-sm font-bold ${isCurrentUser ? 'text-green-400' : 'text-white'}`}>
                    {user.points.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-xs block">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
