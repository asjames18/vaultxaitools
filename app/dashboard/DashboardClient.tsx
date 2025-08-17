'use client';

import { useState, useEffect } from 'react';

type RecentItem = { id: string; type: 'favorite' | 'review'; label: string; tool?: string; when: string };

interface DashboardProps {
  userName: string;
  userEmail: string;
  memberSince: string;
  stats: { toolsExplored: number; reviewsWritten: number; favoritesCount: number };
  recent: RecentItem[];
  favorites: Array<{ id: string; name: string }>; // minimal for now
}

export default function DashboardClient({ userName, userEmail, memberSince, stats, recent, favorites }: DashboardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState({ display_name: userName, organization: '', bio: '', newsletterOptIn: false });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-gray-600 dark:text-gray-300">Your personal AI tools dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tools Explored</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.toolsExplored}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Reviews Written</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reviewsWritten}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoritesCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No favorites yet.</div>
                ) : (
                  favorites.map((f) => (
                    <div key={f.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="font-medium text-gray-900 dark:text-white">{f.name || f.id}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
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
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Organization</div>
                      <input 
                        value={profile.organization} 
                        onChange={(e) => setProfile((p) => ({ ...p, organization: e.target.value }))} 
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Your organization (optional)"
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bio</div>
                      <textarea 
                        value={profile.bio} 
                        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} 
                        rows={3} 
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" 
                        placeholder="Tell us about yourself (optional)"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={profile.newsletterOptIn} 
                        onChange={(e) => setProfile((p) => ({ ...p, newsletterOptIn: e.target.checked }))} 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                      className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      a.download = 'vaultx-export.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Export error:', error);
                      alert('Failed to export data. Please try again.');
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
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


