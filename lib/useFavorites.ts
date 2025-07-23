'use client';

import { useState, useEffect, useCallback } from 'react';
import { refreshToolsData, subscribeToToolsUpdates, calculateRealTimeStats } from './database-client';
import type { Database } from './database.types';

type Tool = Database['public']['Tables']['tools']['Row'];

export interface StatsData {
  totalTools: number;
  totalReviews: number;
  totalUsers: number;
  totalCategories: number;
  avgRating: number;
  lastUpdated: string;
}

// Hook for real-time statistics
export function useRealTimeStats(initialTools: Tool[] = []) {
  const [stats, setStats] = useState<StatsData>(() => 
    calculateRealTimeStats(initialTools)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Manual refresh function
  const refreshStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const freshTools = await refreshToolsData();
      const newStats = calculateRealTimeStats(freshTools);
      setStats(newStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToToolsUpdates((payload) => {
      console.log('Tools data updated:', payload);
      // Refresh stats when data changes
      refreshStats();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshStats]);

  // Auto-refresh every 5 minutes as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshStats]);

  return {
    stats,
    isRefreshing,
    lastRefresh,
    refreshStats
  };
}

// Enhanced favorites hook with real-time updates
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem('vaultx-favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('vaultx-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  const addFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      if (!prev.includes(toolId)) {
        return [...prev, toolId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((toolId: string) => {
    setFavorites(prev => prev.filter(id => id !== toolId));
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  }, []);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favorites.length
  };
} 