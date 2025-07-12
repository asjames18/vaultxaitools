'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { categories, getToolsFromDB, getPopularTools } from '@/data';
import { getTrendingTools, getTrendingBadge } from '@/lib/trending';
import { getSponsoredTools } from '@/lib/affiliate';
import SearchAndFilter from '@/components/SearchAndFilter';
import SearchResults from '@/components/SearchResults';
import SponsoredContent from '@/components/SponsoredContent';
import EmailSignupForm from '@/components/EmailSignupForm';
import type { Tool } from '@/data';

// Simple SVG icons as fallback
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CompareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function Home() {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [sponsoredTools, setSponsoredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tools from database on component mount
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const tools = await getToolsFromDB();
        setAllTools(tools);
        
        // Get popular tools for initial display
        const popularTools = tools
          .sort((a, b) => b.weeklyUsers - a.weeklyUsers)
          .slice(0, 6);
        setFilteredTools(popularTools);

        // Get trending tools using utility function
        const trendingToolsData = getTrendingTools(tools, 6);
        setTrendingTools(trendingToolsData);

        // Get sponsored tools (mock data for now)
        const mockSponsoredSlots = [
          {
            id: '1',
            toolId: tools[0]?.id || '',
            position: 'top' as const,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            priority: 1,
            budget: 1000,
            impressions: 0,
            clicks: 0
          }
        ];
        
        const sponsoredToolsData = getSponsoredTools('top', mockSponsoredSlots, tools);
        setSponsoredTools(sponsoredToolsData);
      } catch (error) {
        console.error('Error loading tools:', error);
        setFilteredTools([]);
        setTrendingTools([]);
        setSponsoredTools([]);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  const handleResultsChange = useCallback((tools: Tool[]) => {
    setFilteredTools(tools);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 animate-fade-in shadow-sm">
              <SparklesIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Discover the latest AI tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-slide-up">
              VaultX AI Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.
            </p>

            {/* Enhanced Value Proposition */}
            <div className="mb-12 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Hand-picked quality tools</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Real user reviews & ratings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  <span>Always up-to-date</span>
                </div>
              </div>
            </div>

            {/* Enhanced CTA */}
            <div className="max-w-2xl mx-auto mb-12 animate-scale-in">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <SparklesIcon className="w-5 h-5" />
                  Explore All AI Tools
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/trending"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
                >
                  <FireIcon className="w-5 h-5 text-orange-500" />
                  See Trending Tools
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{allTools.length}+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How VaultX Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect AI tool in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Discover</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our curated collection of AI tools across all categories, from productivity to creativity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                <CompareIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Compare</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Read detailed reviews, compare features, and see real user ratings to make informed decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl">
                <RocketIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Master</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get started with your chosen tool and join our community of AI enthusiasts and professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Email Signup Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <SparklesIcon className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Stay Updated</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Miss the Next Big AI Tool
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get weekly updates on the latest AI tools, exclusive reviews, and insider tips delivered to your inbox.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <EmailSignupForm />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Loved by AI Enthusiasts
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our community says about discovering AI tools with VaultX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "VaultX helped me discover tools that increased my productivity by 300%. The reviews are spot-on and the community is incredibly helpful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah Mitchell</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Product Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "As a developer, I was overwhelmed by the number of AI tools out there. VaultX's curated approach saved me hours of research."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  DJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">David Johnson</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Full-Stack Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "The trending section is my go-to for discovering new AI tools. I've found several game-changers for my creative workflow."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                  AL
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Alex Lee</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Creative Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsored Content Section */}
      {sponsoredTools.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SponsoredContent
              tools={sponsoredTools}
              title="Featured Tools"
              subtitle="Tools that help support VaultX"
              maxItems={3}
              showDisclosure={true}
            />
          </div>
        </section>
      )}

      {/* Trending Tools Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                🔥 Trending Now
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The hottest AI tools based on user interactions, ratings, and growth
              </p>
            </div>
            
            <div className="mt-6 md:mt-0">
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg"
              >
                <FireIcon className="w-4 h-4" />
                View All Trending
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool, index) => {
              const badge = getTrendingBadge(index);
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group relative"
                >
                  {/* Trending Badge */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                    {badge.text}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{tool.logo}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tool.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {renderStars(tool.rating)}
                        <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                          {tool.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span className="text-sm font-medium text-green-600">{tool.growth}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.weeklyUsers.toLocaleString()} weekly users
                      </span>
                      <Link
                        href={`/tool/${tool.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Explore by Category</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find the perfect AI tool for your specific needs across different domains
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {allTools.filter(tool => tool.category === category.name).length} tools
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Popular AI Tools</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover the most trending and highly-rated AI tools
              </p>
            </div>
            
            {/* Search Link */}
            <div className="mt-6 md:mt-0">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all duration-200"
              >
                Advanced Search
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Search and Filter for Popular Tools */}
          <div className="mb-8">
            <SearchAndFilter
              tools={allTools}
              categories={categories}
              onResultsChange={handleResultsChange}
              showAdvancedFilters={false}
            />
          </div>

          <SearchResults tools={filteredTools} showStats={false} />
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already leveraging the power of AI to transform their workflows and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <SparklesIcon className="w-5 h-5" />
              Start Exploring
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white hover:text-blue-600"
            >
              <FireIcon className="w-5 h-5" />
              View Trending
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
