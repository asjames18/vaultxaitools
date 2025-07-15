'use client';

import { useState } from 'react';
import { addReviewToDB, updateToolRatingInDB } from '@/data';
import type { Database } from '@/lib/database.types';
import AccessibleRating from './AccessibleRating';

type DatabaseReviewInsert = Database['public']['Tables']['reviews']['Insert'];

interface ReviewFormProps {
  toolId: string;
  currentRating: number;
  currentReviewCount: number;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ 
  toolId, 
  currentRating, 
  currentReviewCount, 
  onReviewSubmitted 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add the review
      const reviewData: DatabaseReviewInsert = {
        tool_id: toolId,
        user_name: userName.trim(),
        rating,
        comment: comment.trim(),
        helpful: 0,
        verified: false,
        date: new Date().toISOString()
      };

      await addReviewToDB(reviewData);

      // Update tool rating
      const newReviewCount = currentReviewCount + 1;
      const newRating = ((currentRating * currentReviewCount) + rating) / newReviewCount;
      
      await updateToolRatingInDB(toolId, Math.round(newRating * 10) / 10, newReviewCount);

      setSuccess(true);
      setRating(0);
      setComment('');
      setUserName('');
      
      // Call the callback to refresh reviews
      onReviewSubmitted();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div 
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Review submitted successfully!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Name */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white focus:outline-none"
            placeholder="Enter your name"
            maxLength={50}
            required
            aria-describedby={error && error.includes('name') ? 'error-message' : undefined}
          />
        </div>

        {/* Rating */}
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating *
          </legend>
          <div className="flex items-center gap-3">
            <AccessibleRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="lg"
              aria-label="Select your rating for this tool"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {rating ? `${rating} out of 5` : 'Select rating'}
            </span>
          </div>
        </fieldset>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Review Comment *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none focus:outline-none"
            placeholder="Share your experience with this tool..."
            maxLength={1000}
            required
            aria-describedby={error && error.includes('comment') ? 'error-message' : undefined}
          />
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            id="error-message"
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
} 