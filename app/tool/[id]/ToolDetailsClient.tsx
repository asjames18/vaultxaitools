'use client';

import { useFavorites } from '@/lib/useFavorites';

interface ToolDetailsClientProps {
  toolId: string;
}

export default function ToolDetailsClient({ toolId }: ToolDetailsClientProps) {
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tool Details
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Tool ID: {toolId}
            </p>
          </div>

          {/* Favorites Status */}
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-purple-800">
              <strong>Favorites Status:</strong> {loading ? 'Loading...' : `${favorites.length} favorites`}
            </p>
            <p className="text-sm text-purple-800">
              <strong>Is Favorite:</strong> {isFavorite(toolId) ? '❤️ Yes' : '🤍 No'}
            </p>
            {/* Show favorite tool names */}
            {favorites.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-purple-700 font-semibold">Your Favorites:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {favorites.map((fav: any) => (
                    <span 
                      key={fav.id || fav} 
                      className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                    >
                      {fav.name || fav}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Like Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => toggleFavorite(toolId)}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFavorite(toolId)
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-lg'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? 'Loading...' : isFavorite(toolId) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 