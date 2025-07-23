import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Favorites - VaultX AI Tools',
  description: 'Your favorite AI tools and bookmarks',
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites ❤️
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your bookmarked AI tools and discoveries
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring AI tools and add them to your favorites to see them here.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 