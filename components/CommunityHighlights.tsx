'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StarIcon, MessageCircle, UsersIcon, HeartIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface CommunityHighlightsProps {
  toolsCount?: number;
  categoriesCount?: number;
  expertSelectedPercentage?: number;
  qualityFocused?: boolean;
}

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    username: "Sarah M.",
    rating: 5,
    comment: "Found the perfect AI tool for my content creation workflow. Game changer!",
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    username: "Alex K.",
    rating: 5,
    comment: "The tool comparison feature saved me hours of research. Highly recommend!",
    timeAgo: "1 day ago"
  },
  {
    id: 3,
    username: "Maria L.",
    rating: 5,
    comment: "Finally, a platform that actually curates quality AI tools for builders instead of just listing everything.",
    timeAgo: "3 days ago"
  },
  {
    id: 4,
    username: "David R.",
    rating: 5,
    comment: "The community reviews are so helpful. I trust this platform for all my AI tool decisions as I level up my tech skills.",
    timeAgo: "1 week ago"
  },
  {
    id: 5,
    username: "Lisa T.",
    rating: 5,
    comment: "The expert guidance has been invaluable for setting up my automation workflows. Perfect for entrepreneurs and builders.",
    timeAgo: "1 week ago"
  }
];

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

export default function CommunityHighlights({ 
  toolsCount = 0, 
  categoriesCount = 0, 
  expertSelectedPercentage = 100, 
  qualityFocused = true 
}: CommunityHighlightsProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);
  const supabase = createClient();

  // Fetch real reviews from the database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, user_name, rating, comment, created_at')
          .order('created_at', { ascending: false })
          .limit(6);
        if (!error && data && data.length > 0) {
          setReviews(data.map((r: any) => ({
            id: r.id,
            username: r.user_name || 'Community Member',
            rating: r.rating || 5,
            comment: r.comment || '',
            timeAgo: formatTimeAgo(r.created_at),
          })));
        }
      } catch {
        // Fall back to static reviews
      }
    };
    fetchReviews();
  }, []);

  // Create dynamic community stats based on props
  const communityStats = [
    {
      label: "Curated Tools",
      value: toolsCount > 0 ? toolsCount.toString() : "—",
      icon: StarIcon,
      color: "green"
    },
    {
      label: "Categories",
      value: categoriesCount > 0 ? categoriesCount.toString() : "—",
      icon: MessageCircle,
      color: "green"
    },
    {
      label: "Expert Selected",
      value: `${expertSelectedPercentage}%`,
      icon: UsersIcon,
      color: "green"
    },
    {
      label: "Quality Focused",
      value: qualityFocused ? "✓" : "—",
      icon: HeartIcon,
      color: "green"
    }
  ];

  useEffect(() => {
    // Rotate through reviews every 5 seconds
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  // Function to add new review (can be called from external components)
  const addNewReview = (newReview: Omit<Review, 'id' | 'timeAgo'>) => {
    const reviewWithId = {
      ...newReview,
      id: Math.max(...reviews.map(r => r.id)) + 1,
      timeAgo: "Just now"
    };
    setReviews(prev => [reviewWithId, ...prev]);
  };

  // Expose the function globally for other components to use
  useEffect(() => {
    (window as any).addCommunityReview = addNewReview;
    return () => {
      delete (window as any).addCommunityReview;
    };
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Platform Highlights
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover hand-picked AI tools curated for quality and real-world effectiveness
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Stats */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>Hand-picked quality tools</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Curated</span>
                </div>
              </div>
              <Link
                href="/AITools"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center block"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>

          {/* Community Reviews */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Community Reviews
            </h3>
            
            {/* Featured Review */}
            <div className="bg-gray-700 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-semibold">
                  {reviews[currentReviewIndex].username.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {reviews[currentReviewIndex].username}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {reviews[currentReviewIndex].timeAgo}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {renderStars(reviews[currentReviewIndex].rating)}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{reviews[currentReviewIndex].comment}"
              </p>
            </div>

            {/* Review Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {reviews.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {reviews.filter(review => review.rating === 5).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">5-Star</div>
              </div>
            </div>

            {/* Add Review Button */}
            <button
              onClick={() => {
                // This could open a review form modal
                // TODO: Implement review form modal
              }}
              className="w-full mt-6 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Community Driven
            </h3>
            <p className="text-gray-400">
              Real user reviews and ratings help you make informed decisions
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Quality Curation
            </h3>
            <p className="text-gray-400">
              Expert-vetted tools that meet our high standards for effectiveness
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              Active Discussion
            </h3>
            <p className="text-gray-400">
              Join conversations about AI tools and share your experiences
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 