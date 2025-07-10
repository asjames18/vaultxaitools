'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simple SVG icons as fallback
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const categories = [
  {
    name: "Language",
    icon: "💬",
    description: "AI tools for text generation, translation, and language processing",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    popularTools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
  },
  {
    name: "Design",
    icon: "🎨",
    description: "AI-powered design tools for graphics, UI/UX, and creative work",
    count: 38,
    color: "from-purple-500 to-pink-500",
    popularTools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
  },
  {
    name: "Development",
    icon: "💻",
    description: "AI tools for coding, debugging, and software development",
    count: 52,
    color: "from-green-500 to-emerald-500",
    popularTools: ["GitHub Copilot", "Cursor", "Tabnine", "CodeWhisperer"]
  },
  {
    name: "Productivity",
    icon: "⚡",
    description: "AI assistants and tools to boost your productivity",
    count: 29,
    color: "from-yellow-500 to-orange-500",
    popularTools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
  },
  {
    name: "Marketing",
    icon: "📈",
    description: "AI tools for marketing, advertising, and business growth",
    count: 31,
    color: "from-red-500 to-rose-500",
    popularTools: ["Jasper", "Copy.ai", "Surfer SEO", "Phrasee"]
  },
  {
    name: "Writing",
    icon: "✍️",
    description: "AI writing assistants and content creation tools",
    count: 27,
    color: "from-indigo-500 to-blue-500",
    popularTools: ["Grammarly", "Hemingway", "ProWritingAid", "Wordtune"]
  },
  {
    name: "Video",
    icon: "🎬",
    description: "AI tools for video creation, editing, and generation",
    count: 23,
    color: "from-pink-500 to-purple-500",
    popularTools: ["Runway", "Synthesia", "Lumen5", "Pictory"]
  },
  {
    name: "Audio",
    icon: "🎵",
    description: "AI tools for audio processing, music generation, and voice synthesis",
    count: 19,
    color: "from-teal-500 to-cyan-500",
    popularTools: ["Mubert", "Amper Music", "Descript", "Synthesia"]
  },
  {
    name: "Data",
    icon: "📊",
    description: "AI tools for data analysis, visualization, and insights",
    count: 34,
    color: "from-gray-500 to-slate-500",
    popularTools: ["Tableau", "Power BI", "Looker", "Metabase"]
  }
];

const allTools = [
  {
    id: 1,
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced language model for conversation and text generation",
    category: "Language",
    rating: 4.8,
    reviewCount: 1247,
    weeklyUsers: 15420,
    growth: "+45%"
  },
  {
    id: 2,
    name: "Midjourney",
    logo: "🎨",
    description: "AI-powered image generation from text descriptions",
    category: "Design",
    rating: 4.6,
    reviewCount: 892,
    weeklyUsers: 12850,
    growth: "+32%"
  },
  {
    id: 3,
    name: "GitHub Copilot",
    logo: "💻",
    description: "AI pair programmer that helps write code faster",
    category: "Development",
    rating: 4.7,
    reviewCount: 1563,
    weeklyUsers: 8920,
    growth: "+67%"
  },
  {
    id: 4,
    name: "Notion AI",
    logo: "📝",
    description: "Writing assistant integrated into Notion workspace",
    category: "Productivity",
    rating: 4.5,
    reviewCount: 734,
    weeklyUsers: 11230,
    growth: "+28%"
  },
  {
    id: 5,
    name: "Jasper",
    logo: "✍️",
    description: "AI content creation platform for marketing and writing",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 567,
    weeklyUsers: 8750,
    growth: "+41%"
  },
  {
    id: 6,
    name: "DALL-E",
    logo: "🖼️",
    description: "AI system that creates realistic images from text descriptions",
    category: "Design",
    rating: 4.6,
    reviewCount: 445,
    weeklyUsers: 6540,
    growth: "+38%"
  },
  {
    id: 7,
    name: "Claude",
    logo: "🧠",
    description: "Advanced AI assistant with strong reasoning capabilities",
    category: "Language",
    rating: 4.7,
    reviewCount: 678,
    weeklyUsers: 9870,
    growth: "+52%"
  },
  {
    id: 8,
    name: "Cursor",
    logo: "⌨️",
    description: "AI-powered code editor with intelligent autocomplete",
    category: "Development",
    rating: 4.5,
    reviewCount: 423,
    weeklyUsers: 5430,
    growth: "+89%"
  }
];

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'users':
        return b.weeklyUsers - a.weeklyUsers;
      case 'growth':
        return parseFloat(b.growth) - parseFloat(a.growth);
      default:
        return b.weeklyUsers - a.weeklyUsers; // popular
    }
  });

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AI Tool Categories
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Explore AI tools organized by category. Find the perfect tool for your specific needs.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white text-center">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {category.count} tools
                    </span>
                    <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span className="font-medium">Explore</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Popular Tools Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Popular:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.popularTools.slice(0, 3).map((tool, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                All AI Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {filteredTools.length} tools found
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="users">Most Users</option>
                <option value="growth">Fastest Growing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => (
              <div key={tool.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{tool.logo}</div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {renderStars(tool.rating)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{tool.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({tool.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {tool.category}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {tool.growth} growth
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.weeklyUsers.toLocaleString()} weekly users
                    </div>
                    <Link
                      href={`/tool/${tool.id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors group-hover:shadow-md"
                    >
                      View Details
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedTools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No tools found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 