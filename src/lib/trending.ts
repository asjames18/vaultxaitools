import type { Tool } from '@/data/tools';

export interface TrendingScore {
  tool: Tool;
  score: number;
  factors: {
    rating: number;
    reviews: number;
    users: number;
    growth: number;
    recency: number;
  };
}

export interface TrendingCategory {
  name: string;
  growth: string;
  toolCount: number;
  color: string;
  icon: string;
  totalScore: number;
}

/**
 * Calculate trending score for a tool based on multiple factors
 */
export function calculateTrendingScore(tool: Tool): TrendingScore {
  // Parse growth rate (remove % and convert to number)
  const growthRate = parseFloat(tool.growth.replace('%', ''));
  
  // Rating factor (0-5 scale, weighted at 25%)
  const ratingWeight = 0.25;
  const ratingScore = (tool.rating / 5) * ratingWeight;
  
  // Review count factor (normalized, weighted at 20%)
  const reviewWeight = 0.20;
  const reviewScore = Math.min(tool.reviewCount / 100, 1) * reviewWeight;
  
  // User engagement factor (normalized, weighted at 25%)
  const userWeight = 0.25;
  const userScore = Math.min(tool.weeklyUsers / 10000, 1) * userWeight;
  
  // Growth factor (normalized, weighted at 20%)
  const growthWeight = 0.20;
  const growthScore = Math.max(growthRate / 100, 0) * growthWeight;
  
  // Recency factor (if tool has recent activity, weighted at 10%)
  const recencyWeight = 0.10;
  const recencyScore = recencyWeight; // Simplified for now, could be based on last update date
  
  const totalScore = ratingScore + reviewScore + userScore + growthScore + recencyScore;
  
  return {
    tool,
    score: totalScore,
    factors: {
      rating: ratingScore,
      reviews: reviewScore,
      users: userScore,
      growth: growthScore,
      recency: recencyScore
    }
  };
}

/**
 * Get trending tools sorted by score
 */
export function getTrendingTools(tools: Tool[], limit: number = 12): Tool[] {
  return tools
    .map(tool => calculateTrendingScore(tool))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);
}

/**
 * Get trending categories with aggregated stats
 */
export function getTrendingCategories(tools: Tool[]): TrendingCategory[] {
  const categoryStats = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = {
        count: 0,
        totalRating: 0,
        totalUsers: 0,
        totalGrowth: 0,
        totalScore: 0
      };
    }
    
    const trendingScore = calculateTrendingScore(tool);
    
    acc[tool.category].count++;
    acc[tool.category].totalRating += tool.rating;
    acc[tool.category].totalUsers += tool.weeklyUsers;
    acc[tool.category].totalGrowth += parseFloat(tool.growth.replace('%', ''));
    acc[tool.category].totalScore += trendingScore.score;
    
    return acc;
  }, {} as Record<string, { count: number; totalRating: number; totalUsers: number; totalGrowth: number; totalScore: number }>);

  const categoryColors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600", 
    "from-green-500 to-green-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600"
  ];

  const categoryIcons = ["🚀", "🎨", "📊", "✍️", "🎬", "💬", "🔧", "🎯"];

  return Object.entries(categoryStats)
    .map(([name, stats], index) => ({
      name,
      growth: `+${Math.round(stats.totalGrowth / stats.count)}%`,
      toolCount: stats.count,
      color: categoryColors[index % categoryColors.length],
      icon: categoryIcons[index % categoryIcons.length],
      totalScore: stats.totalScore
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 8);
}

/**
 * Get trending insights for display
 */
export function getTrendingInsights(tools: Tool[]) {
  const trendingScores = tools.map(tool => calculateTrendingScore(tool));
  
  const mostPopular = trendingScores
    .sort((a, b) => b.tool.weeklyUsers - a.tool.weeklyUsers)[0]?.tool;
    
  const fastestGrowing = trendingScores
    .sort((a, b) => parseFloat(b.tool.growth.replace('%', '')) - parseFloat(a.tool.growth.replace('%', '')))[0]?.tool;
    
  const highestRated = trendingScores
    .sort((a, b) => b.tool.rating - a.tool.rating)[0]?.tool;
    
  const mostReviewed = trendingScores
    .sort((a, b) => b.tool.reviewCount - a.tool.reviewCount)[0]?.tool;

  return {
    mostPopular,
    fastestGrowing,
    highestRated,
    mostReviewed
  };
}

/**
 * Get trending badge based on position
 */
export function getTrendingBadge(index: number) {
  if (index === 0) return { text: "🔥 Hot", color: "bg-red-500 text-white" };
  if (index === 1) return { text: "⚡ Rising", color: "bg-orange-500 text-white" };
  if (index === 2) return { text: "📈 Trending", color: "bg-green-500 text-white" };
  if (index < 6) return { text: "⭐ Popular", color: "bg-blue-500 text-white" };
  return { text: "💫 Trending", color: "bg-purple-500 text-white" };
}

/**
 * Calculate time-based trending (for future use with real-time data)
 */
export function getTimeBasedTrending(tools: Tool[], timeFilter: 'day' | 'week' | 'month' = 'week') {
  if (timeFilter === 'day') {
    // Sort by highest growth today
    return tools
      .slice()
      .sort((a, b) => parseFloat(b.growth.replace('%', '')) - parseFloat(a.growth.replace('%', '')));
  }
  if (timeFilter === 'month') {
    // Sort by most reviews (simulate monthly engagement)
    return tools
      .slice()
      .sort((a, b) => b.reviewCount - a.reviewCount);
  }
  // Default: trending score (week)
  return tools
    .map(tool => calculateTrendingScore(tool))
    .sort((a, b) => b.score - a.score)
    .map(item => item.tool);
} 