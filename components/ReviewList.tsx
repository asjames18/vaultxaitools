'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Calendar, Award, Flag } from 'lucide-react';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  use_case: string;
  experience_level: 'beginner' | 'intermediate' | 'expert';
  verified_user: boolean;
  helpful_count: number;
  created_at: string;
}

interface ReviewListProps {
  reviews: Review[];
  onVoteHelpful?: (reviewId: string, voteType: 'helpful' | 'not_helpful') => void;
  onReport?: (reviewId: string) => void;
}

export default function ReviewList({ reviews, onVoteHelpful, onReport }: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [userVotes, setUserVotes] = useState<Map<string, 'helpful' | 'not_helpful'>>(new Map());

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleVote = (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    if (userVotes.get(reviewId) === voteType) {
      // Remove vote if clicking the same button
      setUserVotes(prev => {
        const newVotes = new Map(prev);
        newVotes.delete(reviewId);
        return newVotes;
      });
    } else {
      // Add or change vote
      setUserVotes(prev => new Map(prev).set(reviewId, voteType));
    }
    
    if (onVoteHelpful) {
      onVoteHelpful(reviewId, voteType);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'expert': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
        <div className="text-white/50 text-lg mb-2">No reviews yet</div>
        <div className="text-white/40 text-sm">Be the first to share your experience!</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const userVote = userVotes.get(review.id);
        
        return (
          <div
            key={review.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{review.user_name}</span>
                    {review.verified_user && (
                      <Award className="w-4 h-4 text-blue-400" title="Verified User" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="w-3 h-3" />
                    {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              
              {/* Experience Level Badge */}
              <span className={`px-3 py-1 rounded-full text-xs border ${getExperienceLevelColor(review.experience_level)}`}>
                {getExperienceLevelLabel(review.experience_level)}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/70 text-sm">{review.rating}/5</span>
            </div>

            {/* Review Title */}
            <h4 className="text-lg font-semibold text-white mb-3">{review.title}</h4>

            {/* Review Content */}
            <div className="text-white/80 leading-relaxed mb-4">
              {isExpanded ? (
                <div>
                  <p className="mb-4">{review.content}</p>
                  
                  {/* Use Case */}
                  {review.use_case && (
                    <div className="mb-4 p-3 bg-white/10 rounded-lg">
                      <div className="text-white/60 text-sm mb-1">Use Case:</div>
                      <div className="text-white/90">{review.use_case}</div>
                    </div>
                  )}
                  
                  {/* Pros */}
                  {review.pros && review.pros.length > 0 && (
                    <div className="mb-4">
                      <div className="text-green-400 text-sm font-medium mb-2">What they liked:</div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, index) => (
                          <li key={index} className="flex items-center gap-2 text-white/80">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Cons */}
                  {review.cons && review.cons.length > 0 && (
                    <div className="mb-4">
                      <div className="text-red-400 text-sm font-medium mb-2">Areas for improvement:</div>
                      <ul className="space-y-1">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex items-center gap-2 text-white/80">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="line-clamp-3">{review.content}</p>
              )}
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleReviewExpansion(review.id)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium mb-4 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>

            {/* Review Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-4">
                {/* Helpful Vote */}
                <button
                  onClick={() => handleVote(review.id, 'helpful')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    userVote === 'helpful'
                      ? 'bg-green-500/30 text-green-200 border border-green-500/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Helpful</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {review.helpful_count + (userVote === 'helpful' ? 1 : 0)}
                  </span>
                </button>

                {/* Not Helpful Vote */}
                <button
                  onClick={() => handleVote(review.id, 'not_helpful')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    userVote === 'not_helpful'
                      ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span className="text-sm">Not helpful</span>
                </button>
              </div>

              {/* Report Button */}
              <button
                onClick={() => onReport?.(review.id)}
                className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white/70 hover:bg-white/10 rounded-lg transition-colors"
                title="Report inappropriate content"
              >
                <Flag className="w-4 h-4" />
                <span className="text-sm">Report</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
} 