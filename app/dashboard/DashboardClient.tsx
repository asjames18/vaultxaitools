'use client';

import { useState, useEffect } from 'react';
import PointsDisplay from '@/components/PointsDisplay';
import StreakTracker from '@/components/StreakTracker';
import AchievementsGrid from '@/components/AchievementsGrid';
import RecommendedTools from '@/components/RecommendedTools';

type RecentItem = { id: string; type: 'favorite' | 'review'; label: string; tool?: string; when: string };

interface DashboardProps {
  userName: string;
  userEmail: string;
  memberSince: string;
  stats: { toolsExplored: number; reviewsWritten: number; favoritesCount: number };
  recent: Array<{ id: string; type: string; label: string; tool?: string; when: string }>;
  favorites: Array<string | { id: string; name: string; logo?: string; description?: string; category?: string }>;
}

export default function DashboardClient({ userName, userEmail, memberSince, stats, recent, favorites }: DashboardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({ display_name: userName, organization: '', bio: '', newsletterOptIn: false });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [clientFavorites, setClientFavorites] = useState<Array<string | { id: string; name: string; logo?: string; description?: string; category?: string }>>(favorites);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [gamification, setGamification] = useState<{
    points: number;
    level: string;
    rank: number;
    streakCount: number;
    lastActiveDate: string | null;
  } | null>(null);
  const [achievements, setAchievements] = useState<{ earned: any[]; all: any[] }>({ earned: [], all: [] });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [gamificationLoading, setGamificationLoading] = useState(true);

  // Load client favorites
  const loadClientFavorites = async () => {
    setFavoritesLoading(true);
    
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setFavoritesLoading(false);
        return;
      }

      const response = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.favorites && Array.isArray(data.favorites)) {
          setClientFavorites(data.favorites);
        } else {
          setClientFavorites([]);
        }
      } else {
        setClientFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setClientFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Remove test favorites functionality - no longer needed
  // const createTestFavorites = async () => { ... } - REMOVED

  const loadGamification = async () => {
    setGamificationLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const headers = { Authorization: `Bearer ${session.access_token}` };

      // Fire daily streak + points for login
      await fetch('/api/user/streak', { method: 'POST', headers });
      await fetch('/api/user/points', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'daily_login' })
      });

      // Parallel fetch gamification data
      const [pointsRes, streakRes, achievementsRes, recsRes] = await Promise.all([
        fetch('/api/user/points', { headers }),
        fetch('/api/user/streak', { headers }),
        fetch('/api/user/achievements', { headers }),
        fetch('/api/user/recommendations', { headers }),
      ]);

      if (pointsRes.ok && streakRes.ok) {
        const [pointsData, streakData] = await Promise.all([pointsRes.json(), streakRes.json()]);
        setGamification({
          points: pointsData.points ?? 0,
          level: pointsData.level ?? 'Explorer',
          rank: pointsData.rank ?? 0,
          streakCount: streakData.streak_count ?? 0,
          lastActiveDate: streakData.last_active_date ?? null,
        });
      }
      if (achievementsRes.ok) {
        const data = await achievementsRes.json();
        setAchievements({ earned: data.earned ?? [], all: data.all ?? [] });
      }
      if (recsRes.ok) {
        const data = await recsRes.json();
        setRecommendations(data.recommendations ?? []);
      }
    } catch (e) {
      console.error('Gamification load error', e);
    } finally {
      setGamificationLoading(false);
    }
  };







  // Load existing profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        
        // Get the session token for API calls
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          console.log('No session token available');
          return;
        }



        // Sync Supabase session cookies for server-side APIs (fallback if header is stripped)
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            })
          });
        } catch {}
        
        // Load client favorites
        loadClientFavorites();
        loadGamification();
        const response = await fetch('/api/user/export', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'X-Supabase-Authorization': `Bearer ${session.access_token}`,
            'X-Refresh-Token': session.refresh_token ?? ''
          },
          credentials: 'include'
        });
        
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.profile) {
            setProfile({
              display_name: data.profile.display_name || userName,
              organization: data.profile.organization || '',
              bio: data.profile.bio || '',
              newsletterOptIn: data.profile.newsletter_opt_in || false
            });
          }
          
          // Don't override favorites from the export API - we're already loading them from /api/favorites
          // if (data.favorites && Array.isArray(data.favorites)) {
          //   console.log('🔍 Dashboard: Setting favorites from export API:', data.favorites);
          //   const favoriteIds = data.favorites.map((fav: any) => fav.tool_id);
          //   console.log('🔍 Dashboard: Mapped favorite IDs:', favoriteIds);
          //   setClientFavorites(favoriteIds);
          // } else {
          //   console.log('🔍 Dashboard: No favorites in export API response or invalid format:', data.favorites);
          // }
        } else {
          console.log('Failed to load profile:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Keep default values
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [userName]);

  const handleSaveProfile = async () => {
    setSubmitting(true);
    setProfileSaved(false);
    try {
      // Get the session token for API calls
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Authentication required. Please sign in again.');
        return;
      }

      // Ensure cookies are set for server-side validation as a fallback
      try {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          })
        });
      } catch {}
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'X-Supabase-Authorization': `Bearer ${session.access_token}`,
          'X-Refresh-Token': session.refresh_token ?? ''
        },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      
      if (response.ok) {
        setProfileSaved(true);
        // Broadcast profile update to refresh UI (e.g., Navigation)
        try {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('profile-updated'));
          }
        } catch {}
        setTimeout(() => setProfileSaved(false), 3000); // Clear success message after 3 seconds
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || newEmail === userEmail) {
      setEmailMessage('Enter a new email address.');
      return;
    }
    setEmailSubmitting(true);
    setEmailMessage(null);
    try {
      const { createClient } = await import('@/lib/supabase');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setEmailMessage('Authentication required. Please sign in again.');
        return;
      }
      const { data, error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        setEmailMessage(error.message || 'Failed to update email');
        return;
      }
      setEmailMessage('Check your new inbox to confirm the change.');
    } catch (err: any) {
      setEmailMessage('Failed to update email');
    } finally {
      setEmailSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Welcome back, {userName}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-300">Your personal AI tools dashboard</p>
        </div>

        {/* Gamification Progress Banner */}
        {gamification && !gamificationLoading && (
          <div className="mb-8 bg-gradient-to-r from-green-900/40 to-green-800/20 border border-green-700/40 rounded-2xl p-5 flex flex-wrap items-center gap-6">
            {/* Streak */}
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>🔥</span>
              <div>
                <div className="text-2xl font-bold text-green-400">{gamification.streakCount} day{gamification.streakCount !== 1 ? 's' : ''}</div>
                <div className="text-xs text-gray-400">Current streak</div>
              </div>
            </div>
            <div className="w-px h-10 bg-green-700/40 hidden sm:block" />
            {/* Level */}
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>⭐</span>
              <div>
                <div className="text-2xl font-bold text-green-400">{gamification.level}</div>
                <div className="text-xs text-gray-400">Your level</div>
              </div>
            </div>
            <div className="w-px h-10 bg-green-700/40 hidden sm:block" />
            {/* Points */}
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>🏆</span>
              <div>
                <div className="text-2xl font-bold text-green-400">{gamification.points.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total points</div>
              </div>
            </div>
            {/* Next milestone nudge */}
            <div className="ml-auto text-right hidden md:block">
              <div className="text-xs text-gray-400 mb-1">Keep going!</div>
              <div className="text-sm text-green-400 font-medium">
                {stats.reviewsWritten === 0
                  ? 'Write your first review to earn 10 pts →'
                  : stats.favoritesCount < 5
                  ? `Save ${5 - stats.favoritesCount} more tools for Curator badge →`
                  : "You're crushing it! 🎉"}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tools Explored</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.toolsExplored}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Reviews Written</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reviewsWritten}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{clientFavorites.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{gamification?.points ?? '—'}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 border-t-4 border-t-green-500">
            <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{gamification ? `${gamification.streakCount}d` : '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Tools */}
            {recommendations.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">Recommended For You</h2>
                  <p className="text-sm text-gray-400 mt-1">Based on your activity and favorites</p>
                </div>
                <div className="p-6">
                  <RecommendedTools tools={recommendations} />
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recent.length === 0 ? (
                  <div className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">No activity yet. Start by adding a favorite or writing a review.</div>
                ) : (
                  recent.map((item) => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-3">
                      <span className="text-lg" aria-hidden>{item.type === 'favorite' ? '❤️' : '✍️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                        {item.tool && <p className="text-xs text-gray-500 dark:text-gray-400">Tool: {item.tool}</p>}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.when}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Favorites</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click on any tool to view its details and manage your preferences
                </p>
              </div>
              <div className="p-6">
                {favoritesLoading ? (
                  <div className="text-gray-500 dark:text-gray-400">Loading favorites...</div>
                ) : clientFavorites.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No favorites yet. Start exploring AI tools and add them to your favorites!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientFavorites.map((favorite) => {
                      // Handle both old format (string) and new format (object)
                      const toolId = typeof favorite === 'string' ? favorite : favorite.id;
                      const toolName = typeof favorite === 'string' 
                        ? favorite.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                        : favorite.name || 'Unknown Tool';
                      const toolLogo = typeof favorite === 'string' ? '🔧' : (favorite.logo || '🔧');
                      const toolDescription = typeof favorite === 'string' ? '' : (favorite.description || '');
                      const toolCategory = typeof favorite === 'string' ? '' : (favorite.category || '');
                      
                      return (
                        <div key={toolId} className="group relative">
                          {/* Clickable card area */}
                          <a 
                            href={`/tool/${toolId}`}
                            className="block p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-green-400 dark:hover:border-green-400 transition-all duration-200 cursor-pointer group-hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{toolLogo}</div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                                  {toolName}
                                </div>
                                {toolCategory && (
                                  <div className="text-xs text-green-400 dark:text-green-400 bg-green-900/30 dark:bg-green-900/30 px-2 py-1 rounded-full inline-block mt-1">
                                    {toolCategory}
                                  </div>
                                )}
                                {toolDescription && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {toolDescription}
                                  </div>
                                )}
                              </div>
                              {/* Arrow indicator */}
                              <div className="text-gray-400 group-hover:text-green-400 transition-colors">
                                →
                              </div>
                            </div>
                          </a>
                          
                          {/* Remove button - positioned absolutely to avoid interfering with click */}
                          <button
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (confirm('Remove this tool from favorites?')) {
                                try {
                                  const { createClient } = await import('@/lib/supabase');
                                  const supabase = createClient();
                                  const { data: { session } } = await supabase.auth.getSession();
                                  
                                  if (!session?.access_token) {
                                    alert('Authentication required. Please sign in again.');
                                    return;
                                  }

                                  const response = await fetch('/api/favorites', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${session.access_token}`
                                    },
                                    body: JSON.stringify({ toolId, action: 'remove' })
                                  });

                                  if (response.ok) {
                                    // Remove from local state
                                    setClientFavorites(prev => prev.filter(fav => {
                                      const favId = typeof fav === 'string' ? fav : fav.id;
                                      return favId !== toolId;
                                    }));
                                  } else {
                                    alert('Failed to remove favorite. Please try again.');
                                  }
                                } catch (error) {
                                  console.error('Error removing favorite:', error);
                                  alert('Failed to remove favorite. Please try again.');
                                }
                              }
                            }}
                            className="absolute top-2 right-2 p-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Remove from favorites"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* Purchased Products */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Your Purchases</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Products and blueprints you&apos;ve bought</p>
                </div>
                <a href="/products" className="text-xs text-green-400 hover:text-green-300 transition-colors">Browse more →</a>
              </div>
              <div className="p-6 text-center space-y-4">
                <div className="text-4xl">📦</div>
                <p className="text-gray-400 text-sm">Your purchased products and order history are available via your confirmation email.</p>
                <a href="/products"
                  className="inline-block px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg text-sm transition-colors">
                  Shop Products
                </a>
              </div>
            </div>

            {/* Referral card */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-white">Refer a Builder</h2>
                <p className="text-sm text-gray-400 mt-0.5">Share the MIT marketplace with your network</p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-400 text-sm">Know someone who should be building with AI agents? Send them your link.</p>
                <div className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-400 font-mono break-all select-all">
                  melanatedintech.com/marketplace
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a href="https://twitter.com/intent/tweet?text=Check%20out%20the%20MIT%20Marketplace%20for%20AI%20agents%20%26%20automation%20tools%20%E2%80%94%20melanatedintech.com/marketplace"
                    target="_blank" rel="noopener noreferrer"
                    className="text-center py-2 border border-gray-700 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-xs font-semibold transition-colors">
                    Share on X
                  </a>
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://melanatedintech.com/marketplace"
                    target="_blank" rel="noopener noreferrer"
                    className="text-center py-2 border border-gray-700 hover:border-green-500/50 text-gray-400 hover:text-green-400 rounded-lg text-xs font-semibold transition-colors">
                    Share on LinkedIn
                  </a>
                </div>
                <a href="/creators"
                  className="block text-center text-xs text-green-400 hover:text-green-300 transition-colors">
                  Want to earn? Join the creator program →
                </a>
              </div>
            </div>

          </div>
          </div>

          {/* Sidebar: lg:col-span-1 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Points + Streak */}
            {gamification && !gamificationLoading && (
              <div className="space-y-4">
                <PointsDisplay points={gamification.points} level={gamification.level} />
                <StreakTracker streakCount={gamification.streakCount} lastActiveDate={gamification.lastActiveDate} />
              </div>
            )}

            {/* Achievements */}
            {!gamificationLoading && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-lg font-semibold text-white">Achievements</h2>
                </div>
                <div className="p-6">
                  <AchievementsGrid earned={achievements.earned} all={achievements.all} />
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Profile</h2>
              </div>
              <div className="p-6 space-y-3">
                {profileLoading ? (
                  <div className="space-y-3">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                      <input 
                        value={profile.display_name} 
                        onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))} 
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Organization</div>
                      <input 
                        value={profile.organization} 
                        onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))} 
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Your organization (optional)"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bio</div>
                      <textarea 
                        value={profile.bio} 
                        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} 
                        rows={3} 
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Tell us about yourself (optional)"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={profile.newsletterOptIn} 
                        onChange={(e) => setProfile((p) => ({ ...p, newsletterOptIn: e.target.checked }))} 
                        className="rounded border-gray-300 text-green-500 focus:ring-green-400"
                      />
                      Receive the monthly AI Starter tips
                    </label>
                    {profileSaved && (
                      <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                        ✅ Profile updated successfully!
                      </div>
                    )}
                    <button
                      disabled={submitting}
                      onClick={handleSaveProfile}
                      className="mt-2 w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-black hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving…' : 'Save Profile'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Account</h2>
              </div>
              <div className="p-6 space-y-3">
                <a href="/reset-password" className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">Change Password</a>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Change Email</div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-green-400 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                  {emailMessage && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">{emailMessage}</div>
                  )}
                  <button
                    disabled={emailSubmitting}
                    onClick={handleChangeEmail}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {emailSubmitting ? 'Updating…' : 'Update Email'}
                  </button>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm('Export your data (favorites & reviews) as JSON?')) return;
                    try {
                      // Get the session token for API calls
                      const { createClient } = await import('@/lib/supabase');
                      const supabase = createClient();
                      const { data: { session } } = await supabase.auth.getSession();
                      
                      if (!session?.access_token) {
                        alert('Authentication required. Please sign in again.');
                        return;
                      }
                      
                      const res = await fetch('/api/user/export', {
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`
                        }
                      });
                      
                      if (!res.ok) {
                        alert('Failed to export data. Please try again.');
                        return;
                      }
                      
                      const json = await res.json();
                      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'mit-export.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Export error:', error);
                      alert('Failed to export data. Please try again.');
                    }
                  }}
                  className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 transition-colors"
                >
                  Export My Data (JSON)
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Delete your account? This cannot be undone.')) return;
                    const res = await fetch('/api/user/account', { method: 'DELETE' });
                    if (res.ok) {
                      alert('Account deleted. You will be signed out.');
                      window.location.href = '/';
                    } else {
                      alert('Failed to delete. Please contact support.');
                    }
                  }}
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


