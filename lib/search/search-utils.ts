const DEFAULT_STORAGE_KEY = 'mit-recent-searches';
const MAX_RECENT = 10;

export function loadRecentSearches(storageKey = DEFAULT_STORAGE_KEY): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string, storageKey = DEFAULT_STORAGE_KEY): string[] {
  if (typeof window === 'undefined' || !query.trim()) return loadRecentSearches(storageKey);

  const trimmed = query.trim();
  const updated = [trimmed, ...loadRecentSearches(storageKey).filter((item) => item !== trimmed)].slice(
    0,
    MAX_RECENT
  );

  localStorage.setItem(storageKey, JSON.stringify(updated));
  return updated;
}

export function buildQuerySuggestions(query: string, maxSuggestions = 5): string[] {
  if (!query.trim() || query.length < 2) return [];

  const suffixes = [
    'for beginners',
    'tutorial',
    'alternatives',
    'best practices',
    'examples',
    'comparison',
    'review',
    'pricing',
  ];

  return suffixes
    .map((suffix) => `${query} ${suffix}`.trim())
    .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
    .slice(0, maxSuggestions);
}
