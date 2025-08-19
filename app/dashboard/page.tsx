'use client'

import { useEffect, useState } from 'react';
import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  const [data, setData] = useState<{
    userName: string;
    userEmail: string;
    memberSince: string;
    stats: { toolsExplored: number; reviewsWritten: number; favoritesCount: number };
    recent: Array<{ id: string; type: string; label: string; tool: string; when: string }>;
    favorites: Array<string | { id: string; name: string; logo?: string; description?: string; category?: string }>;
  }>({
    userName: 'Loading...',
    userEmail: '',
    memberSince: new Date().toISOString(),
    stats: { toolsExplored: 0, reviewsWritten: 0, favoritesCount: 0 },
    recent: [],
    favorites: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Dynamically import Supabase client to avoid webpack issues
        const { createClient } = await import('@/lib/supabase');
        const supabase = createClient();
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User is authenticated, load their data
          // Always use the new API endpoint that returns tool names
          let favorites = [];
          try {
            const response = await fetch('/api/favorites', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              favorites = data.favorites || [];
              console.log('✅ Dashboard: Loaded favorites from API:', favorites);
            } else {
              console.log('❌ Dashboard: API error, status:', response.status);
              // Don't fall back to old method - just show empty
              favorites = [];
            }
          } catch (error) {
            console.error('❌ Dashboard: Error fetching favorites from API:', error);
            favorites = [];
          }

          // Get reviews
          let reviews = null;
          const { data: reviewsById, error: reviewsByIdError } = await supabase
            .from('reviews')
            .select('id, tool_id, created_at')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(5);

          if (reviewsByIdError) {
            // Try with user_name as fallback
            const userName = session.user.email?.split('@')[0] || session.user.email;
            const { data: reviewsByName } = await supabase
              .from('reviews')
              .select('id, tool_id, created_at')
              .eq('user_name', userName)
              .order('created_at', { ascending: false })
              .limit(5);
            reviews = reviewsByName;
          } else {
            reviews = reviewsById;
          }

          const recent = (reviews || []).map((r) => ({ 
            id: r.id, 
            type: 'review', 
            label: 'Wrote a review', 
            tool: r.tool_id, 
            when: new Date(r.created_at).toLocaleDateString() 
          }));

          const stats = { 
            toolsExplored: Array.isArray(favorites) ? favorites.length : 0, 
            reviewsWritten: recent.length, 
            favoritesCount: Array.isArray(favorites) ? favorites.length : 0
          };

          setData({
            userName: session.user.email?.split('@')[0] || 'User',
            userEmail: session.user.email || '',
            memberSince: session.user.created_at || new Date().toISOString(),
            stats,
            recent,
            favorites,
          });
        } else {
          // No session, show guest data
          setData({
            userName: 'Guest',
            userEmail: '',
            memberSince: new Date().toISOString(),
            stats: { toolsExplored: 0, reviewsWritten: 0, favoritesCount: 0 },
            recent: [],
            favorites: [],
          });
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setData({
          userName: 'User',
          userEmail: '',
          memberSince: new Date().toISOString(),
          stats: { toolsExplored: 0, reviewsWritten: 0, favoritesCount: 0 },
          recent: [],
          favorites: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                        <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardClient
      userName={data.userName}
      userEmail={data.userEmail}
      memberSince={data.memberSince}
      stats={data.stats}
      recent={data.recent}
      favorites={data.favorites}
    />
  );
} 