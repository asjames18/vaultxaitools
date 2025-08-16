'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Send, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  toolId: string;
  toolName: string;
  onSubmit: (review: ReviewData) => void;
  onCancel?: () => void;
}

interface ReviewData {
  tool_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  use_case: string;
  experience_level: 'beginner' | 'intermediate' | 'expert';
}

export default function ReviewForm({ toolId, toolName, onSubmit, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewData>({
    tool_id: toolId,
    user_name: '',
    user_email: '',
    rating: 0,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
    use_case: '',
    experience_level: 'intermediate'
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleInputChange = (field: keyof ReviewData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'pros' | 'cons', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'pros' | 'cons') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'pros' | 'cons', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.user_name.trim()) {
      newErrors.push('Name is required');
    }
    if (formData.rating === 0) {
      newErrors.push('Please select a rating');
    }
    if (!formData.title.trim()) {
      newErrors.push('Review title is required');
    }
    if (!formData.content.trim()) {
      newErrors.push('Review content is required');
    }
    if (formData.content.length < 50) {
      newErrors.push('Review content must be at least 50 characters');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter out empty pros/cons
      const cleanData = {
        ...formData,
        pros: formData.pros.filter(p => p.trim()),
        cons: formData.cons.filter(c => c.trim())
      };
      
      await onSubmit(cleanData);
      
      // Reset form
      setFormData({
        tool_id: toolId,
        user_name: '',
        user_email: '',
        rating: 0,
        title: '',
        content: '',
        pros: [''],
        cons: [''],
        use_case: '',
        experience_level: 'intermediate'
      });
      setErrors([]);
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrors(['Failed to submit review. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Send className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Write a Review</h3>
          <p className="text-white/70 text-sm">Share your experience with {toolName}</p>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 font-medium">Please fix the following errors:</span>
          </div>
          <ul className="text-red-200 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.user_name}
              onChange={(e) => handleInputChange('user_name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => handleInputChange('user_email', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">
            Overall Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl transition-colors hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-white/30'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-white/70 text-sm">
              {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            placeholder="Summarize your experience in a few words"
            required
          />
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Review Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            placeholder="Share your detailed experience with this tool. What did you like? What could be improved?"
            required
          />
          <div className="mt-2 text-right">
            <span className={`text-sm ${formData.content.length >= 50 ? 'text-green-400' : 'text-white/50'}`}>
              {formData.content.length}/50 characters minimum
            </span>
          </div>
        </div>

        {/* Pros */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">
            What did you like? <span className="text-green-400">(Pros)</span>
          </label>
          <div className="space-y-2">
            {formData.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => handleArrayChange('pros', index, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                  placeholder="Enter a positive point"
                />
                {formData.pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('pros', index)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('pros')}
              className="text-green-400 hover:text-green-300 text-sm underline"
            >
              + Add another pro
            </button>
          </div>
        </div>

        {/* Cons */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">
            What could be improved? <span className="text-red-400">(Cons)</span>
          </label>
          <div className="space-y-2">
            {formData.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => handleArrayChange('cons', index, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  placeholder="Enter an area for improvement"
                />
                {formData.cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('cons', index)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('cons')}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              + Add another con
            </button>
          </div>
        </div>

        {/* Use Case */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            How do you use this tool?
          </label>
          <textarea
            value={formData.use_case}
            onChange={(e) => handleInputChange('use_case', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            placeholder="e.g., Content creation, Code generation, Design work, etc."
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Your Experience Level
          </label>
          <select
            value={formData.experience_level}
            onChange={(e) => handleInputChange('experience_level', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          >
            <option value="beginner">Beginner - Just getting started</option>
            <option value="intermediate">Intermediate - Some experience</option>
            <option value="expert">Expert - Extensive experience</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-white/70 hover:text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 