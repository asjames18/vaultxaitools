import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (mounted) {
        setUserId(data?.user?.id || null);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Fetch favorites for the user
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', userId);
    if (error) {
      setFavorites([]);
    } else {
      setFavorites(data.map((fav: any) => fav.tool_id));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Add a tool to favorites
  const addFavorite = async (toolId: string) => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, tool_id: toolId });
    if (!error) {
      setFavorites((prev) => [...prev, toolId]);
    }
    setLoading(false);
  };

  // Remove a tool from favorites
  const removeFavorite = async (toolId: string) => {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('tool_id', toolId);
    if (!error) {
      setFavorites((prev) => prev.filter((id) => id !== toolId));
    }
    setLoading(false);
  };

  // Check if a tool is a favorite
  const isFavorite = (toolId: string) => favorites.includes(toolId);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: fetchFavorites,
    userId,
  };
} 