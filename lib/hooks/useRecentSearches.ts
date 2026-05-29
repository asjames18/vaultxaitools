'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadRecentSearches, saveRecentSearch } from '@/lib/search/search-utils';

export function useRecentSearches(storageKey = 'vaultx-recent-searches') {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(loadRecentSearches(storageKey));
  }, [storageKey]);

  const rememberSearch = useCallback(
    (query: string) => {
      setRecentSearches(saveRecentSearch(query, storageKey));
    },
    [storageKey]
  );

  return { recentSearches, rememberSearch };
}
