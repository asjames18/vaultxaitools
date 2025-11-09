import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      try {
        // Safely create Supabase client
        const supabase = createClient();
        if (!supabase) {
          if (mounted) {
            setUserId(null);
            setLoading(false);
          }
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUserId(session?.user?.id || null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          setUserId(null);
          setLoading(false);
        }
      }
    };
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      getUser();
    } else {
      setLoading(false);
    }
    
    return () => { mounted = false; };
  }, []);

  // Fetch favorites for the user using the API
  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Get current session token
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.error('Failed to fetch favorites:', response.status);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Add a tool to favorites using the API
  const addFavorite = async (toolId: string) => {
    if (!userId) return;
    
    // Optimistic update
    setFavorites((prev) => [...prev, toolId]);
    
    try {
      // Get current session token
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No session token available');
      }
      
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ toolId, action: 'add' })
      });

      if (response.ok) {
        const data = await response.json();
        // Revalidate to ensure consistency
        await fetchFavorites();
      } else {
        // Rollback on failure
        setFavorites((prev) => prev.filter(id => id !== toolId));
        const errorData = await response.json();
        console.error('Failed to add favorite:', errorData);
        throw new Error(errorData.error || 'Failed to add favorite');
      }
    } catch (error) {
      // Rollback on failure
      setFavorites((prev) => prev.filter(id => id !== toolId));
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  // Remove a tool from favorites using the API
  const removeFavorite = async (toolId: string) => {
    if (!userId) return;
    
    // Optimistic update
    setFavorites((prev) => prev.filter(id => id !== toolId));
    
    try {
      // Get current session token
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No session token available');
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
        const data = await response.json();
        // Revalidate to ensure consistency
        await fetchFavorites();
      } else {
        // Rollback on failure
        setFavorites((prev) => [...prev, toolId]);
        const errorData = await response.json();
        console.error('Failed to remove favorite:', errorData);
        throw new Error(errorData.error || 'Failed to remove favorite');
      }
    } catch (error) {
      // Rollback on failure
      setFavorites((prev) => [...prev, toolId]);
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  // Toggle favorite (add if not liked, remove if liked)
  const toggleFavorite = async (toolId: string) => {
    if (isFavorite(toolId)) {
      await removeFavorite(toolId);
    } else {
      await addFavorite(toolId);
    }
  };

  // Check if a tool is in favorites
  const isFavorite = useCallback((toolId: string) => {
    // Handle both old format (array of strings) and new format (array of objects)
    if (favorites.length > 0 && typeof favorites[0] === 'string') {
      // Old format: array of strings
      return (favorites as string[]).includes(toolId);
    } else {
      // New format: array of objects with id property
      return (favorites as any[]).some(fav => fav.id === toolId);
    }
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refresh: fetchFavorites,
    userId,
  };
} 