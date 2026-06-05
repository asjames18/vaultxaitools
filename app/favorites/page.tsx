'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import ToolCard from '@/components/ToolCard';
import { Tool } from '@/lib/types/tool';
import { Heart, Loader2 } from 'lucide-react';

export default function FavoritesPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        setAuthenticated(true);

        const { data: favRows } = await supabase
          .from('favorites')
          .select('tool_id')
          .eq('user_id', user.id);

        if (!favRows || favRows.length === 0) {
          setLoading(false);
          return;
        }

        const ids = favRows.map((r: any) => r.tool_id);
        const { data: toolRows } = await supabase
          .from('tools')
          .select('*')
          .in('id', ids);

        if (toolRows) {
          setTools(toolRows.map((t: any): Tool => ({
            id: t.id,
            name: t.name,
            logo: t.logo || '🔧',
            description: t.description,
            category: t.category,
            rating: t.rating || 0,
            reviewCount: t.review_count || 0,
            weeklyUsers: t.weekly_users || 0,
            growth: t.growth || '0%',
            website: t.website || '',
            pricing: t.pricing || 'Unknown',
            createdAt: t.created_at,
            updatedAt: t.updated_at,
          })));
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your bookmarked AI tools and discoveries
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        )}

        {!loading && authenticated === false && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sign in to see your favorites</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create an account to save and track your favorite AI tools.</p>
            <Link href="/sign-in" className="inline-flex items-center px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
              Sign In
            </Link>
          </div>
        )}

        {!loading && authenticated && tools.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Favorites Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Tap the ♥ heart on any tool to save it here.
            </p>
            <Link href="/AITools" className="inline-flex items-center px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-colors">
              Explore AI Tools
            </Link>
          </div>
        )}

        {!loading && tools.length > 0 && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{tools.length} saved tool{tools.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
