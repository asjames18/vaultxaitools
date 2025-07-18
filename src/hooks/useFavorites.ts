'use client';
import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => data.favorites && setFavorites(data.favorites));
  }, []);

  const add = async (toolId: string) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId }),
    });
    setFavorites(prev => [...prev, toolId]);
  };

  const remove = async (toolId: string) => {
    await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolId }),
    });
    setFavorites(prev => prev.filter(id => id !== toolId));
  };

  const toggle = (toolId: string) =>
    favorites.includes(toolId) ? remove(toolId) : add(toolId);

  return { favorites, toggle };
} 