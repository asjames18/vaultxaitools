'use client';

import { useState, useRef, useEffect } from 'react';

interface AccessibleRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  'aria-label'?: string;
  className?: string;
}

export default function AccessibleRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  'aria-label': ariaLabel = 'Tool rating',
  className = ""
}: AccessibleRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [focusedRating, setFocusedRating] = useState<number | null>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const currentRating = hoveredRating || rating;

  const handleKeyDown = (event: React.KeyboardEvent, starIndex: number) => {
    if (!interactive) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        const nextRating = Math.min(starIndex + 2, maxRating);
        setFocusedRating(nextRating);
        if (onRatingChange) onRatingChange(nextRating);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        const prevRating = Math.max(starIndex, 1);
        setFocusedRating(prevRating);
        if (onRatingChange) onRatingChange(prevRating);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (onRatingChange) onRatingChange(starIndex + 1);
        break;
    }
  };

  const handleStarClick = (starIndex: number) => {
    if (!interactive) return;
    if (onRatingChange) onRatingChange(starIndex + 1);
  };

  const handleStarHover = (starIndex: number) => {
    if (!interactive) return;
    setHoveredRating(starIndex + 1);
  };

  const handleStarLeave = () => {
    if (!interactive) return;
    setHoveredRating(null);
  };

  const handleStarFocus = (starIndex: number) => {
    if (!interactive) return;
    setFocusedRating(starIndex + 1);
  };

  const handleStarBlur = () => {
    if (!interactive) return;
    setFocusedRating(null);
  };

  const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );

  return (
    <div
      ref={ratingRef}
      className={`flex items-center gap-1 ${className}`}
      role={interactive ? "radiogroup" : undefined}
      aria-label={ariaLabel}
      aria-valuenow={rating}
      aria-valuemin={1}
      aria-valuemax={maxRating}
      aria-valuetext={`${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;
        const isHalfFilled = !isFilled && starValue - 0.5 <= currentRating;
        
        const starElement = (
          <StarIcon
            className={`${sizeClasses[size]} transition-colors ${
              isFilled
                ? 'text-yellow-500 fill-current'
                : isHalfFilled
                ? 'text-yellow-500 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        );

        if (interactive) {
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={starValue === rating}
              aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
              className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm p-0.5"
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              onMouseLeave={handleStarLeave}
              onFocus={() => handleStarFocus(index)}
              onBlur={handleStarBlur}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={focusedRating === starValue ? 0 : -1}
            >
              {starElement}
            </button>
          );
        }

        return (
          <span
            key={index}
            className="inline-block"
            aria-hidden="true"
          >
            {starElement}
          </span>
        );
      })}
      
      {interactive && (
        <span className="sr-only">
          Use arrow keys to navigate and space or enter to select rating
        </span>
      )}
    </div>
  );
} 