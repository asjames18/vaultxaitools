import { calculateTrendingScore } from '../trending';
import type { Tool } from '@/data/tools';

const oldTool: Tool = { 
  id: '1',
  name: 'Old Tool',
  logo: '🔧',
  description: 'An old tool',
  category: 'Productivity',
  rating: 3.5,
  reviewCount: 10,
  weeklyUsers: 1000,
  growth: '5%',
  website: 'https://example.com',
  pricing: 'Free'
};

const newTool: Tool = { 
  id: '2',
  name: 'New Tool',
  logo: '🚀',
  description: 'A new tool',
  category: 'Productivity',
  rating: 4.5,
  reviewCount: 50,
  weeklyUsers: 5000,
  growth: '25%',
  website: 'https://example.com',
  pricing: 'Freemium'
};

test('new tool scores higher than old tool', () => {
  const newScore = calculateTrendingScore(newTool).score;
  const oldScore = calculateTrendingScore(oldTool).score;
  expect(newScore).toBeGreaterThan(oldScore);
}); 