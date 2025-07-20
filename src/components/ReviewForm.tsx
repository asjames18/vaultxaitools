'use client';

import { useState } from 'react';

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface ReviewFormProps {
  toolName?: string;
  onSuccess?: () => void;
}

const avatars = ["👩‍💼", "👨‍💻", "👩‍🎨", "👨‍🔬", "👩‍💻", "👨‍💼", "👩‍🎨", "👨‍💻"];

export default function ReviewForm({ toolName = "", onSuccess }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    user: "",
    tool: toolName,
    rating: 0,
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user || !formData.tool || !formData.rating || !formData.comment) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new review object
      const newReview = {
        user: formData.user,
        avatar: selectedAvatar,
        tool: formData.tool,
        rating: formData.rating,
        comment: formData.comment,
        timeAgo: "Just now"
      };

      // Add to community highlights if the function exists
      if (typeof window !== 'undefined' && (window as any).addCommunityReview) {
        (window as any).addCommunityReview(newReview);
      }

      // Reset form
      setFormData({
        user: "",
        tool: toolName,
        rating: 0,
        comment: ""
      });
      setSelectedAvatar(avatars[0]);
      setIsSubmitted(true);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Review Submitted!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for sharing your experience. Your review has been added to our community highlights.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Share Your Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Choose your avatar
          </label>
          <div className="flex gap-3">
            {avatars.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-12 h-12 text-2xl rounded-full border-2 transition-all ${
                  selectedAvatar === avatar
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="user"
            value={formData.user}
            onChange={(e) => setFormData(prev => ({ ...prev, user: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Tool Name */}
        <div>
          <label htmlFor="tool" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            AI Tool Name
          </label>
          <input
            type="text"
            id="tool"
            value={formData.tool}
            onChange={(e) => setFormData(prev => ({ ...prev, tool: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., ChatGPT, Midjourney, etc."
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="text-2xl hover:scale-110 transition-transform"
              >
                <StarIcon
                  className={`w-8 h-8 ${
                    star <= formData.rating
                      ? 'text-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  filled={star <= formData.rating}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate'}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Share your experience with this AI tool..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Your review will appear in our community highlights and help others discover great AI tools.
      </p>
    </div>
  );
} 