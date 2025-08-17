'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchTools } from '@/data';
import { getToolById, getReviewsByToolIdFromDB } from '@/data';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
// Ratings removed for now
import AffiliateLink from '@/components/AffiliateLink';
import DemoMedia from '@/components/DemoMedia';
import AlternativesSection from '@/components/AlternativesSection';
import type { Database } from '@/lib/database.types';
import { useFavorites } from '@/lib/useFavorites';

type DatabaseReview = Database['public']['Tables']['reviews']['Row'];

// Star icon and ratings removed

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

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface ToolDetailsClientProps {
  toolId: string;
  fallbackAlternatives?: { name: string; logo?: string; reason?: string }[];
}

export default function ToolDetailsClient({ toolId, fallbackAlternatives = [] }: ToolDetailsClientProps) {
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('overview');
  const [reviews, setReviews] = useState<DatabaseReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [tool, setTool] = useState<any>(null);
  const [loadingTool, setLoadingTool] = useState(true);
  // Add state for share feedback
  const [shareCopied, setShareCopied] = useState(false);

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

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reload reviews after successful submission
      const reviewsData = await getReviewsByToolIdFromDB(toolId);
      setReviews(reviewsData);
      
      // Switch back to overview tab
      setActiveTab('overview');
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const handleReviewVote = async (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    // TODO: Implement review voting API
    console.log('Vote:', voteType, 'for review:', reviewId);
  };

  const handleReviewReport = async (reviewId: string) => {
    // TODO: Implement review reporting API
    console.log('Report review:', reviewId);
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

  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const getDefaultAlternatives = (t: any) => {
    const cat = String(t?.category || '').toLowerCase();
    if (cat === 'language' || cat === 'writing') {
      return [
        { name: 'ChatGPT', logo: '🤖' },
        { name: 'Claude', logo: '🧠' },
        { name: 'Perplexity', logo: '🔍' },
      ];
    }
    if (cat === 'design' || cat === 'image' || cat === 'video') {
      return [
        { name: 'Midjourney', logo: '🎨' },
        { name: 'DALL-E', logo: '🖼️' },
        { name: 'Stable Diffusion', logo: '🎭' },
      ];
    }
    if (cat === 'development') {
      return [
        { name: 'GitHub Copilot', logo: '💻' },
        { name: 'Cursor', logo: '⌨️' },
        { name: 'Tabnine', logo: '🔧' },
      ];
    }
    if (cat === 'productivity') {
      return [
        { name: 'Notion AI', logo: '📝' },
        { name: 'Grammarly', logo: '✍️' },
        { name: 'Otter.ai', logo: '🎤' },
      ];
    }
    if (cat === 'marketing') {
      return [
        { name: 'Jasper', logo: '✍️' },
        { name: 'Copy.ai', logo: '📄' },
        { name: 'Surfer SEO', logo: '🏄' },
      ];
    }
    return [
      { name: 'ChatGPT', logo: '🤖' },
      { name: 'Claude', logo: '🧠' },
      { name: 'Perplexity', logo: '🔍' },
    ];
  };

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

  // Ratings removed

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/AITools"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-lg font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Tools
            </Link>
          </div>
          {/* Sticky sub‑nav */}
          <nav className="sticky top-16 z-20 overflow-x-auto whitespace-nowrap border-b border-gray-200/60 dark:border-gray-700/60 mb-8 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
            {[
              ['overview','Overview'],
              ['gallery','Gallery'],
              ['about','About'],
              ['features','Features'],
              ['alternatives','Alternatives']
            ].map(([id,label]) => (
              <a key={id} href={`#${id}`} className="mx-2 inline-block rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-6xl shadow-lg rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-4">
                  {tool.logo}
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    {tool.name}
                  </h1>
                  {/* Quick facts */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm text-gray-800 dark:text-gray-200">{tool.category}</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm text-gray-800 dark:text-gray-200">{tool.pricing}</span>
                    {(tool.tags || []).slice(0,3).map((t:string)=> (
                      <span key={t} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm text-gray-800 dark:text-gray-200">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p id="overview" className="scroll-mt-24 text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {tool.description}
              </p>
              {/* Gallery */}
              {tool.screenshots && tool.screenshots.length > 0 && (
                <section id="gallery" className="scroll-mt-24 mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Gallery</h3>
                  <div className="relative -mx-1 flex gap-3 overflow-x-auto pb-2">
                    {tool.screenshots.map((src: string, i: number) => (
                      <div key={i} className="shrink-0 w-[280px] sm:w-[360px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {/* Using next/image when available; fallback to img */}
                        <Image src={src} alt={`${tool.name} screenshot ${i+1}`} width={720} height={405} className="h-auto w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {/* About */}
              {tool.longDescription && (
                <section id="about" className="scroll-mt-24 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">About {tool.name}</h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{tool.longDescription}</p>
                </section>
              )}
              {/* Use-cases removed per request */}
              {/* Key Features */}
              {tool.features && tool.features.length > 0 && (
                <section id="features" className="scroll-mt-24 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 mb-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {tool.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-lg text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              
              {/* Demo Media Section */}
              <DemoMedia 
                demo_images={tool.demo_images}
                demo_videos={tool.demo_videos}
                demo_gallery={tool.demo_gallery}
                toolName={tool.name}
              />

              {/* Quick start removed per request */}

              {/* Integrations removed per request */}

              {/* FAQ removed per request */}
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
              {/* Enhanced Alternatives Section */}
              {(() => {
                const alts = (tool?.alternatives || []).filter((a: any) => a && a.name) as any[];
                const finalAlts = alts.length > 0 ? alts : getDefaultAlternatives(tool);
                return finalAlts && finalAlts.length > 0 ? (
                  <AlternativesSection
                    alternatives={finalAlts}
                    currentToolName={tool.name}
                    currentToolCategory={tool.category}
                  />
                ) : null;
              })()}
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
              {/* <div className="flex gap-4 mb-8">
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
              </div> */}
              {/* Tab Content */}
              {activeTab === 'overview' && (<div className="animate-fade-in" />)}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in">
                  <ReviewForm 
                    toolId={tool.id}
                    toolName={tool.name}
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setActiveTab('overview')}
                  />
                  <ReviewList
                    reviews={reviews}
                    onVoteHelpful={handleReviewVote}
                    onReport={handleReviewReport}
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
                  {/* Additional facts if present */}
                  {tool.platforms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                      <span className="font-medium text-gray-900 dark:text-white">{Array.isArray(tool.platforms) ? tool.platforms.join(', ') : tool.platforms}</span>
                    </div>
                  )}
                </div>
              </div>
              <AffiliateLink
                href={tool.website}
                toolId={tool.id}
                hasAffiliate={true}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  try { window.dispatchEvent(new CustomEvent('vaultx-outbound', { detail: { toolId: tool.id, href: tool.website } })); } catch {}
                }}
              >
                Visit Website
                <ExternalLinkIcon className="w-6 h-6" />
              </AffiliateLink>
              <button
                onClick={() => {
                  if (isFavorite(tool.id)) {
                    removeFavorite(tool.id);
                  } else {
                    addFavorite(tool.id);
                  }
                }}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border transition-colors text-lg font-semibold shadow-sm ${
                  isFavorite(tool.id)
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <HeartIcon className="w-6 h-6" />
                {isFavorite(tool.id) ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 1500);
                }}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 text-lg font-semibold shadow-sm"
              >
                <ShareIcon className="w-6 h-6" />
                {shareCopied ? (
                  <>
                    Copied!
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  </>
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 