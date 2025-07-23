import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard - VaultX AI Tools',
  description: 'Your personalized AI tools dashboard with favorites, activity, and recommendations',
};

function DashboardClient() {
  // Mock user data - in real app, this would come from database
  const user = {
    name: 'asjames18',
    email: 'asjames18@example.com',
    memberSince: '2024-01-15',
    level: 'Explorer',
    points: 1250,
    toolsExplored: 47,
    reviewsWritten: 12,
    favoritesCount: 23
  };

  const recentActivity = [
    { id: 1, action: 'Favorited ChatGPT', tool: 'ChatGPT', time: '2m ago', type: 'favorite' },
    { id: 2, action: 'Reviewed Midjourney', tool: 'Midjourney', time: '1h ago', type: 'review' },
    { id: 3, action: 'Viewed Claude', tool: 'Claude', time: '3h ago', type: 'view' },
    { id: 4, action: 'Searched for "AI writing"', tool: null, time: '5h ago', type: 'search' },
    { id: 5, action: 'Favorited GitHub Copilot', tool: 'GitHub Copilot', time: '1d ago', type: 'favorite' }
  ];

  const favoriteTools = [
    { id: 1, name: 'ChatGPT', logo: '🤖', category: 'Language', rating: 4.8, lastUsed: '2m ago' },
    { id: 2, name: 'Midjourney', logo: '🎨', category: 'Design', rating: 4.6, lastUsed: '1h ago' },
    { id: 3, name: 'GitHub Copilot', logo: '💻', category: 'Development', rating: 4.7, lastUsed: '1d ago' },
    { id: 4, name: 'Claude', logo: '🧠', category: 'Language', rating: 4.5, lastUsed: '3h ago' }
  ];

  const recommendations = [
    { id: 1, name: 'Notion AI', logo: '📝', category: 'Productivity', reason: 'Based on your interest in writing tools', rating: 4.4 },
    { id: 2, name: 'DALL-E 3', logo: '🎭', category: 'Design', reason: 'Similar to Midjourney', rating: 4.3 },
    { id: 3, name: 'Cursor', logo: '⌨️', category: 'Development', reason: 'Like GitHub Copilot', rating: 4.2 }
  ];

  const stats = [
    { label: 'Tools Explored', value: user.toolsExplored, icon: '🔍', color: 'blue' },
    { label: 'Reviews Written', value: user.reviewsWritten, icon: '✍️', color: 'green' },
    { label: 'Favorites', value: user.favoritesCount, icon: '❤️', color: 'red' },
    { label: 'Points Earned', value: user.points, icon: '⭐', color: 'yellow' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'favorite':
        return '❤️';
      case 'review':
        return '✍️';
      case 'view':
        return '👁️';
      case 'search':
        return '🔍';
      default:
        return '📝';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Explorer':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Enthusiast':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300';
      case 'Expert':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening with your AI tools
          </p>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activity & Favorites */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        {activity.tool && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Tool: {activity.tool}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Tools */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Favorite Tools</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteTools.map((tool) => (
                    <div key={tool.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="text-2xl">{tool.logo}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tool.category} • ⭐ {tool.rating}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Last used {tool.lastUsed}
                        </p>
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Recommendations */}
          <div className="space-y-8">
            {/* User Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(user.level)}`}>
                      {user.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {new Date(user.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">⭐ {user.points}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h2>
              </div>
              <div className="p-6 space-y-4">
                {recommendations.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="text-xl">{tool.logo}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {tool.reason}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        ⭐ {tool.rating}
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Try
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  🔍 Discover New Tools
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  ✍️ Write a Review
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  📊 View Analytics
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
      <DashboardClient />
    </Suspense>
  );
} 