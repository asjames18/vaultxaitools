'use client';

import { useState } from 'react';
import { updateToolRatingInDB } from '@/data';

interface QuickVoteProps {
  toolId: string;
  currentRating: number;
  currentReviewCount: number;
  onVoteSubmitted: () => void;
}

const ThumbsUpIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const ThumbsDownIcon = ({ className, filled }: { className?: string; filled: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
  </svg>
);

export default function QuickVote({ 
  toolId, 
  currentRating, 
  currentReviewCount, 
  onVoteSubmitted 
}: QuickVoteProps) {
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (vote: 'up' | 'down') => {
    if (voted || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Calculate new rating based on vote
      // Up vote adds 1 to rating, down vote subtracts 1
      const voteValue = vote === 'up' ? 1 : -1;
      const newRating = Math.max(0, Math.min(5, currentRating + voteValue));
      const newReviewCount = currentReviewCount + 1;
      
      await updateToolRatingInDB(toolId, Math.round(newRating * 10) / 10, newReviewCount);
      
      setVoted(vote);
      onVoteSubmitted();
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Quick Vote
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
        Rate this tool with a quick thumbs up or down
      </p>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleVote('up')}
          disabled={voted !== null || isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            voted === 'up'
              ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
              : voted === 'down'
              ? 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <ThumbsUpIcon 
            className={`w-4 h-4 ${voted === 'up' ? 'text-green-600 dark:text-green-400' : ''}`}
            filled={voted === 'up'}
          />
          {isSubmitting && voted === 'up' ? 'Voting...' : 'Good'}
        </button>
        
        <button
          onClick={() => handleVote('down')}
          disabled={voted !== null || isSubmitting}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            voted === 'down'
              ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
              : voted === 'up'
              ? 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <ThumbsDownIcon 
            className={`w-4 h-4 ${voted === 'down' ? 'text-red-600 dark:text-red-400' : ''}`}
            filled={voted === 'down'}
          />
          {isSubmitting && voted === 'down' ? 'Voting...' : 'Bad'}
        </button>
      </div>
      
      {voted && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-3 text-center">
          Thanks for your vote!
        </p>
      )}
    </div>
  );
} 