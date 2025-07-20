'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToolById, getReviewsByToolIdFromDB } from '@/data';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import QuickVote from '@/components/QuickVote';
import AffiliateLink from '@/components/AffiliateLink';
import SocialShare from '@/components/SocialShare';
import type { Database } from '@/lib/database.types';

type DatabaseReview = Database['public']['Tables']['reviews']['Row'];

// Simple SVG icons as fallback
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);



const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ToolDetailsClient({ toolId }: { toolId: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState<DatabaseReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [tool, setTool] = useState<any>(null);
  const [loadingTool, setLoadingTool] = useState(true);
  const [likeError, setLikeError] = useState<string | null>(null);

  // Load tool data from centralized data
  useEffect(() => {
    const loadTool = async () => {
      try {
        setLoadingTool(true);
        const toolData = await getToolById(toolId);
        setTool(toolData);
      } catch (error) {
        console.error('Error loading tool:', error);
      } finally {
        setLoadingTool(false);
      }
    };

    loadTool();
  }, [toolId]);

  // Load reviews from database
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const reviewsData = await getReviewsByToolIdFromDB(toolId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, [toolId]);

  const handleReviewSubmitted = async () => {
    // Reload reviews after a new review is submitted
    try {
      const reviewsData = await getReviewsByToolIdFromDB(toolId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error reloading reviews:', error);
    }
  };

  const handleReviewUpdated = async () => {
    // Reload reviews after a review is updated (e.g., helpful vote)
    try {
      const reviewsData = await getReviewsByToolIdFromDB(toolId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error reloading reviews:', error);
    }
  };

  const handleVoteSubmitted = async () => {
    // Reload tool data after a vote is submitted
    try {
      const toolData = await getToolById(toolId);
      setTool(toolData);
    } catch (error) {
      console.error('Error reloading tool data:', error);
    }
  };

  const handleLike = () => {
    try {
      setIsLiked(!isLiked);
      setLikeError(null);
      
      // Store like state in localStorage for persistence
      const likes = JSON.parse(localStorage.getItem('toolLikes') || '{}');
      if (!isLiked) {
        likes[toolId] = true;
      } else {
        delete likes[toolId];
      }
      localStorage.setItem('toolLikes', JSON.stringify(likes));
      
    } catch (error) {
      console.error('Error handling like:', error);
      setLikeError('Unable to save like preference. Please try again.');
      setTimeout(() => setLikeError(null), 3000);
    }
  };

  // Load like state from localStorage on component mount
  useEffect(() => {
    try {
      const likes = JSON.parse(localStorage.getItem('toolLikes') || '{}');
      setIsLiked(!!likes[toolId]);
    } catch (error) {
      console.error('Error loading like state:', error);
    }
  }, [toolId]);

  // Show loading state
  if (loadingTool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tool details...</p>
        </div>
      </div>
    );
  }

  // If tool not found, show error or redirect
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool not found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The tool you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : i < rating
            ? 'text-yellow-500 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-lg font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Tools
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-6xl shadow-lg rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                  {tool.logo}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
                    {tool.name}
                  </h1>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-1">
                      {renderStars(tool.rating)}
                      <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.rating}
                      </span>
                    </div>
                    <span className="text-lg text-gray-600 dark:text-gray-400">
                      ({tool.reviewCount} reviews)
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-3 py-1 text-sm font-semibold text-green-800 dark:text-green-200">
                      {tool.growth} growth
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {tool.description}
              </p>
              {/* Long Description/About */}
              {tool.longDescription && (
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About {tool.name}</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{tool.longDescription}</p>
                </div>
              )}
              {/* Key Features */}
              {tool.features && tool.features.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {tool.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-lg text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {tool.pros && tool.pros.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-200 mb-3">Pros</h3>
                    <ul className="space-y-2">
                      {tool.pros.map((pro: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-lg text-gray-700 dark:text-gray-200">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tool.cons && tool.cons.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-200 mb-3">Cons</h3>
                    <ul className="space-y-2">
                      {tool.cons.map((con: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0 text-center">×</div>
                          <span className="text-lg text-gray-700 dark:text-gray-200">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Alternatives */}
              {tool.alternatives && tool.alternatives.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Alternatives</h3>
                  <div className="space-y-3">
                    {tool.alternatives.map((alt: any) => (
                      <div key={alt.name} className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-2xl">{alt.logo}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{alt.name}</div>
                          <div className="flex items-center gap-1">
                            {renderStars(alt.rating)}
                            <span className="text-base text-gray-600 dark:text-gray-400 ml-2">{alt.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Tags */}
              {tool.tags && tool.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-base font-medium text-gray-800 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300 ${activeTab === 'overview' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-300 ${activeTab === 'reviews' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <QuickVote 
                    toolId={tool.id} 
                    currentRating={tool.rating} 
                    currentReviewCount={tool.reviewCount} 
                    onVoteSubmitted={handleVoteSubmitted} 
                  />
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in">
                  <ReviewForm 
                    toolName={tool.name}
                    onSuccess={handleReviewSubmitted} 
                  />
                  <ReviewList
                    reviews={reviews}
                    onReviewUpdated={handleReviewUpdated}
                  />
                </div>
              )}
            </div>
            {/* Sidebar */}
            <div className="flex flex-col gap-6 min-w-[320px] max-w-xs mx-auto lg:mx-0">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow-md mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tool.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pricing</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tool.pricing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weekly Users</span>
                    <span className="font-medium text-gray-900 dark:text-white">{tool.weeklyUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Growth</span>
                    <span className="font-medium text-green-600">{tool.growth}</span>
                  </div>
                </div>
              </div>
              <AffiliateLink
                href={tool.website}
                toolId={tool.id}
                hasAffiliate={true}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Visit Website
                <ExternalLinkIcon className="w-6 h-6" />
              </AffiliateLink>
              <button
                onClick={handleLike}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border transition-colors text-lg font-semibold shadow-sm ${
                  isLiked
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <HeartIcon className="w-6 h-6" />
                {isLiked ? 'Liked' : 'Like'}
              </button>
              {likeError && (
                <p className="text-red-500 text-center text-sm mt-2">{likeError}</p>
              )}
              <SocialShare
                url={window.location.href}
                title={`${tool.name} - AI Tool Review`}
                description={tool.description}
                hashtags={['AI', 'AITools', tool.category]}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-lg font-semibold shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 