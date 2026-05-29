import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  buildQuerySuggestions,
  loadRecentSearches,
  saveRecentSearch,
} from '../search/search-utils';

describe('search-utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('builds query suffix suggestions', () => {
    const suggestions = buildQuerySuggestions('Canva', 3);
    expect(suggestions.length).toBeLessThanOrEqual(3);
    expect(suggestions[0]).toContain('Canva');
  });

  it('stores and loads recent searches', () => {
    saveRecentSearch('OBS Studio', 'test-recent');
    saveRecentSearch('Canva', 'test-recent');

    const recent = loadRecentSearches('test-recent');
    expect(recent[0]).toBe('Canva');
    expect(recent[1]).toBe('OBS Studio');
  });
});
