import { Metadata } from 'next';
import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import { createClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'Dashboard - VaultX AI Tools',
  description: 'Your personalized AI tools dashboard with favorites, activity, and recommendations',
};

async function getData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      userName: 'Guest',
      userEmail: '',
      memberSince: new Date().toISOString(),
      stats: { toolsExplored: 0, reviewsWritten: 0, favoritesCount: 0 },
      recent: [],
      favorites: [],
    };
  }

  try {
    // Try to get favorites - this should work with user_id
    const { data: favs, error: favsError } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', user.id);

    if (favsError) {
      console.log('Error fetching favorites:', favsError.message);
    }

    // Try to get reviews - the table uses user_name instead of user_id
    // First try with user_id (in case it's been updated)
    let reviews = null;
    let reviewsError = null;
    
    const { data: reviewsById, error: reviewsByIdError } = await supabase
      .from('reviews')
      .select('id, tool_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (reviewsByIdError) {
      // If that fails, try with user_name (current table structure)
      const userName = user.email?.split('@')[0] || user.email;
      const { data: reviewsByName, error: reviewsByNameError } = await supabase
        .from('reviews')
        .select('id, tool_id, created_at')
        .eq('user_name', userName)
        .order('created_at', { ascending: false })
        .limit(5);

      reviews = reviewsByName;
      reviewsError = reviewsByNameError;
    } else {
      reviews = reviewsById;
      reviewsError = reviewsByIdError;
    }

    if (reviewsError) {
      console.log('Error fetching reviews:', reviewsError.message);
    }

    const favorites = (favs || []).map((f) => ({ id: f.tool_id, name: f.tool_id }));
    const recent = (reviews || []).map((r) => ({ 
      id: r.id, 
      type: 'review' as const, 
      label: 'Wrote a review', 
      tool: r.tool_id, 
      when: new Date(r.created_at).toLocaleDateString() 
    }));

    return {
      userName: user.email?.split('@')[0] || 'User',
      userEmail: user.email || '',
      memberSince: user.created_at || new Date().toISOString(),
      stats: { 
        toolsExplored: favorites.length, 
        reviewsWritten: recent.length, 
        favoritesCount: favorites.length 
      },
      recent,
      favorites,
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    
    // Return safe fallback data
    return {
      userName: user.email?.split('@')[0] || 'User',
      userEmail: user.email || '',
      memberSince: user.created_at || new Date().toISOString(),
      stats: { toolsExplored: 0, reviewsWritten: 0, favoritesCount: 0 },
      recent: [],
      favorites: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getData();
  return (
    <Suspense fallback={
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
    }>
      <DashboardClient
        userName={data.userName}
        userEmail={data.userEmail}
        memberSince={data.memberSince}
        stats={data.stats}
        recent={data.recent as any}
        favorites={data.favorites as any}
      />
    </Suspense>
  );
} 