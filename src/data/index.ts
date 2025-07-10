// Export all data structures and helper functions
export * from './tools';
export * from './reviews';

// Re-export commonly used types and functions
export type { Tool, Category } from './tools';
export type { Review } from './reviews';

// Export all helper functions from tools
export {
  getToolsByCategory,
  getPopularTools,
  getTrendingTools,
  searchTools,
  getToolById,
  getCategoryByName
} from './tools';

// Export all helper functions from reviews
export {
  getReviewsByToolId,
  getAverageRating,
  getReviewCount
} from './reviews'; 