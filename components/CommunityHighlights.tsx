'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StarIcon, MessageCircle, UsersIcon, HeartIcon } from 'lucide-react';

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
    comment: "Found the perfect video editing tool for our church's media production. Game changer!",
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
    comment: "Finally, a platform that actually curates quality media tools for ministries instead of just listing everything.",
    timeAgo: "3 days ago"
  },
  {
    id: 4,
    username: "David R.",
    rating: 5,
    comment: "The community reviews are so helpful. I trust this platform for all my ministry media tool decisions.",
    timeAgo: "1 week ago"
  },
  {
    id: 5,
    username: "Lisa T.",
    rating: 5,
    comment: "The expert guidance has been invaluable for our church's live streaming setup. Perfect for ministry needs.",
    timeAgo: "1 week ago"
  }
];

export default function CommunityHighlights({ 
  toolsCount = 0, 
  categoriesCount = 0, 
  expertSelectedPercentage = 100, 
  qualityFocused = true 
}: CommunityHighlightsProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);

  // Create dynamic community stats based on props
  const communityStats = [
    { 
      label: "Curated Tools", 
      value: toolsCount > 0 ? toolsCount.toString() : "—", 
      icon: StarIcon, 
      color: "yellow" 
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
      color: "blue" 
    },
    { 
      label: "Quality Focused", 
      value: qualityFocused ? "✓" : "—", 
      icon: HeartIcon, 
      color: "red" 
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
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Platform Highlights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover hand-picked AI tools curated for quality and real-world effectiveness
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Hand-picked quality tools</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Curated</span>
                </div>
              </div>
              <Link
                href="/AITools"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center block"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>

          {/* Community Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Community Reviews
            </h3>
            
            {/* Featured Review */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {reviews[currentReviewIndex].username.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
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
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {reviews.filter(review => review.rating === 5).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">5-Star</div>
              </div>
            </div>

            {/* Add Review Button */}
            <button
              onClick={() => {
                // This could open a review form modal
                console.log('Add review clicked');
              }}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* Community Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Community Driven
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Real user reviews and ratings help you make informed decisions
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Quality Curation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Expert-vetted tools that meet our high standards for effectiveness
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Active Discussion
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Join conversations about AI tools and share your experiences
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 