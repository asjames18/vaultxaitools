export interface Review {
  id: string;
  toolId: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: "1",
    toolId: "chatgpt",
    user: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely amazing tool! I use it daily for work and it's incredibly helpful for brainstorming and writing.",
    helpful: 24,
    verified: true
  },
  {
    id: "2",
    toolId: "chatgpt",
    user: "Mike R.",
    rating: 4,
    date: "1 week ago",
    comment: "Great for learning new concepts. Sometimes the responses can be a bit verbose, but overall very useful.",
    helpful: 18,
    verified: true
  },
  {
    id: "3",
    toolId: "chatgpt",
    user: "Emily K.",
    rating: 5,
    date: "2 weeks ago",
    comment: "This has become an essential part of my workflow. The code generation feature is particularly helpful.",
    helpful: 31,
    verified: true
  },
  {
    id: "4",
    toolId: "midjourney",
    user: "Alex T.",
    rating: 5,
    date: "3 days ago",
    comment: "Incredible art generation! The quality and creativity of the images are mind-blowing.",
    helpful: 42,
    verified: true
  },
  {
    id: "5",
    toolId: "midjourney",
    user: "Lisa P.",
    rating: 4,
    date: "1 week ago",
    comment: "Great tool for creating concept art. The queue times can be annoying during peak hours though.",
    helpful: 15,
    verified: true
  },
  {
    id: "6",
    toolId: "github-copilot",
    user: "David L.",
    rating: 5,
    date: "4 days ago",
    comment: "Game changer for my development workflow. Saves me hours every day with intelligent code suggestions.",
    helpful: 56,
    verified: true
  },
  {
    id: "7",
    toolId: "github-copilot",
    user: "Rachel S.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Very helpful for boilerplate code and common patterns. Sometimes suggests outdated approaches.",
    helpful: 22,
    verified: true
  },
  {
    id: "8",
    toolId: "notion-ai",
    user: "Tom W.",
    rating: 4,
    date: "1 week ago",
    comment: "Perfect integration with Notion. Helps me write better content and organize my thoughts.",
    helpful: 19,
    verified: true
  },
  {
    id: "9",
    toolId: "jasper",
    user: "Maria G.",
    rating: 4,
    date: "5 days ago",
    comment: "Excellent for marketing content. The templates and brand voice features are really useful.",
    helpful: 28,
    verified: true
  },
  {
    id: "10",
    toolId: "claude",
    user: "James H.",
    rating: 5,
    date: "3 days ago",
    comment: "Best AI assistant I've used. The reasoning capabilities and safety features are outstanding.",
    helpful: 38,
    verified: true
  },
  {
    id: "11",
    toolId: "grammarly",
    user: "Anna L.",
    rating: 5,
    date: "1 week ago",
    comment: "Essential for my writing. Catches mistakes I would never notice and improves my style significantly.",
    helpful: 45,
    verified: true
  },
  {
    id: "12",
    toolId: "bard",
    user: "Carlos M.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Good for research and getting quick answers. The Google integration is really helpful.",
    helpful: 22,
    verified: true
  },
  {
    id: "13",
    toolId: "stable-diffusion",
    user: "Emma R.",
    rating: 4,
    date: "5 days ago",
    comment: "Amazing for creative projects. The open-source nature means endless possibilities.",
    helpful: 31,
    verified: true
  }
];

// Helper functions for working with reviews
export const getReviewsByToolId = (toolId: string): Review[] => {
  return reviews.filter(review => review.toolId === toolId);
};

export const getAverageRating = (toolId: string): number => {
  const toolReviews = getReviewsByToolId(toolId);
  if (toolReviews.length === 0) return 0;
  
  const totalRating = toolReviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / toolReviews.length) * 10) / 10;
};

export const getReviewCount = (toolId: string): number => {
  return getReviewsByToolId(toolId).length;
}; 