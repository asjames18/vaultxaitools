'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Star, Heart, MessageSquare, Users, Target, Zap, Award, Crown, Gem } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'engagement' | 'content' | 'social' | 'milestone' | 'special';
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  reviewsWritten: number;
  toolsFavorited: number;
  commentsPosted: number;
  daysActive: number;
  toolsReviewed: number;
  helpfulVotes: number;
  profileCompleteness: number;
}

interface UserAchievementsProps {
  userId?: string;
  userStats: UserStats;
  achievements: Achievement[];
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const ACHIEVEMENT_ICONS = {
  'first-review': Star,
  'review-master': Trophy,
  'helpful-reviewer': Heart,
  'community-contributor': Users,
  'tool-explorer': Target,
  'power-user': Zap,
  'veteran': Crown,
  'diamond': Gem,
  'engagement-champion': Award,
  'content-creator': MessageSquare
};

export default function UserAchievements({ 
  userId, 
  userStats, 
  achievements, 
  onAchievementUnlocked 
}: UserAchievementsProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  // Calculate achievements based on user stats
  const calculateAchievements = (stats: UserStats): Achievement[] => {
    const baseAchievements: Achievement[] = [
      {
        id: 'first-review',
        name: 'First Steps',
        description: 'Write your first review',
        icon: 'first-review',
        category: 'engagement',
        points: 10,
        unlocked: stats.reviewsWritten > 0,
        progress: Math.min(stats.reviewsWritten, 1),
        maxProgress: 1
      },
      {
        id: 'review-master',
        name: 'Review Master',
        description: 'Write 10 reviews',
        icon: 'review-master',
        category: 'content',
        points: 50,
        unlocked: stats.reviewsWritten >= 10,
        progress: Math.min(stats.reviewsWritten, 10),
        maxProgress: 10
      },
      {
        id: 'helpful-reviewer',
        name: 'Helpful Reviewer',
        description: 'Receive 25 helpful votes',
        icon: 'helpful-reviewer',
        category: 'social',
        points: 75,
        unlocked: stats.helpfulVotes >= 25,
        progress: Math.min(stats.helpfulVotes, 25),
        maxProgress: 25
      },
      {
        id: 'community-contributor',
        name: 'Community Contributor',
        description: 'Be active for 30 days',
        icon: 'community-contributor',
        category: 'milestone',
        points: 100,
        unlocked: stats.daysActive >= 30,
        progress: Math.min(stats.daysActive, 30),
        maxProgress: 30
      },
      {
        id: 'tool-explorer',
        name: 'Tool Explorer',
        description: 'Review 5 different tools',
        icon: 'tool-explorer',
        category: 'engagement',
        points: 40,
        unlocked: stats.toolsReviewed >= 5,
        progress: Math.min(stats.toolsReviewed, 5),
        maxProgress: 5
      },
      {
        id: 'power-user',
        name: 'Power User',
        description: 'Write 50 reviews and receive 100 helpful votes',
        icon: 'power-user',
        category: 'milestone',
        points: 200,
        unlocked: stats.reviewsWritten >= 50 && stats.helpfulVotes >= 100,
        progress: Math.min(Math.min(stats.reviewsWritten / 50, stats.helpfulVotes / 100), 1),
        maxProgress: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Be active for 100 days',
        icon: 'veteran',
        category: 'milestone',
        points: 300,
        unlocked: stats.daysActive >= 100,
        progress: Math.min(stats.daysActive / 100, 1),
        maxProgress: 1
      },
      {
        id: 'diamond',
        name: 'Diamond Member',
        description: 'Complete profile and write 100 reviews',
        icon: 'diamond',
        category: 'special',
        points: 500,
        unlocked: stats.profileCompleteness >= 100 && stats.reviewsWritten >= 100,
        progress: Math.min(Math.min(stats.profileCompleteness / 100, stats.reviewsWritten / 100), 1),
        maxProgress: 1
      },
      {
        id: 'engagement-champion',
        name: 'Engagement Champion',
        description: 'Favorite 25 tools and write 25 reviews',
        icon: 'engagement-champion',
        category: 'engagement',
        points: 150,
        unlocked: stats.toolsFavorited >= 25 && stats.reviewsWritten >= 25,
        progress: Math.min(Math.min(stats.toolsFavorited / 25, stats.reviewsWritten / 25), 1),
        maxProgress: 1
      },
      {
        id: 'content-creator',
        name: 'Content Creator',
        description: 'Write 75 reviews across different categories',
        icon: 'content-creator',
        category: 'content',
        points: 250,
        unlocked: stats.reviewsWritten >= 75,
        progress: Math.min(stats.reviewsWritten / 75, 1),
        maxProgress: 1
      }
    ];

    return baseAchievements;
  };

  // Check for newly unlocked achievements
  useEffect(() => {
    const currentAchievements = calculateAchievements(userStats);
    const newlyUnlocked = currentAchievements.filter(
      achievement => achievement.unlocked && 
      !unlockedAchievements.find(u => u.id === achievement.id)
    );

    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(achievement => {
        setShowUnlockAnimation(achievement.id);
        setTimeout(() => setShowUnlockAnimation(null), 3000);
        
        if (onAchievementUnlocked) {
          onAchievementUnlocked(achievement);
        }
      });
    }

    setUnlockedAchievements(currentAchievements.filter(a => a.unlocked));
    
    const total = currentAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(total);
    
    // Calculate level (every 100 points = 1 level)
    setLevel(Math.floor(total / 100) + 1);
  }, [userStats, unlockedAchievements, onAchievementUnlocked]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'content': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'social': return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'milestone': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'special': return 'bg-pink-500/20 text-pink-600 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getProgressColor = (progress: number, maxProgress: number) => {
    const percentage = (progress / maxProgress) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Level and Points Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Level {level}</h2>
            <p className="text-blue-100">Keep contributing to level up!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalPoints}</div>
            <div className="text-blue-100 text-sm">Total Points</div>
          </div>
        </div>
        
        {/* Progress to next level */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-blue-100 mb-1">
            <span>Progress to Level {level + 1}</span>
            <span>{totalPoints % 100}/100</span>
          </div>
          <div className="w-full bg-blue-800/30 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(totalPoints % 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-white">{userStats.reviewsWritten}</div>
          <div className="text-white/70 text-sm">Reviews</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-white">{userStats.toolsFavorited}</div>
          <div className="text-white/70 text-sm">Favorites</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-white">{userStats.daysActive}</div>
          <div className="text-white/70 text-sm">Days Active</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <div className="text-2xl font-bold text-white">{userStats.helpfulVotes}</div>
          <div className="text-white/70 text-sm">Helpful Votes</div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calculateAchievements(userStats).map((achievement) => {
            const IconComponent = ACHIEVEMENT_ICONS[achievement.icon as keyof typeof ACHIEVEMENT_ICONS] || Trophy;
            const isUnlocked = achievement.unlocked;
            const progress = achievement.progress || 0;
            const maxProgress = achievement.maxProgress || 1;
            const progressPercentage = (progress / maxProgress) * 100;

            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border transition-all duration-300 ${
                  isUnlocked 
                    ? 'bg-white/20 border-white/30' 
                    : 'bg-white/5 border-white/10'
                } ${showUnlockAnimation === achievement.id ? 'animate-pulse ring-2 ring-yellow-400' : ''}`}
              >
                {/* Achievement Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isUnlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isUnlocked ? 'text-white' : 'text-white/60'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      isUnlocked ? 'text-white/70' : 'text-white/40'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {!isUnlocked && maxProgress > 1 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Progress</span>
                      <span>{progress}/{maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress, maxProgress)}`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Points and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className={isUnlocked ? 'text-white' : 'text-white/60'}>
                      {achievement.points} pts
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isUnlocked 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : getCategoryColor(achievement.category)
                  }`}>
                    {isUnlocked ? 'Unlocked' : achievement.category}
                  </div>
                </div>

                {/* Unlock Date */}
                {isUnlocked && achievement.unlockedAt && (
                  <div className="mt-2 text-xs text-white/50 text-center">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Unlock Animation */}
      {showUnlockAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full text-xl font-bold animate-bounce shadow-2xl">
            🎉 Achievement Unlocked! 🎉
          </div>
        </div>
      )}
    </div>
  );
}
