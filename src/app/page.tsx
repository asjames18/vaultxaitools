'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simple SVG icons as fallback
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

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

const popularTools = [
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
  }
];

const categories = [
  { name: "Language", icon: "💬", count: 45, color: "from-blue-500 to-cyan-500" },
  { name: "Design", icon: "🎨", count: 38, color: "from-purple-500 to-pink-500" },
  { name: "Development", icon: "💻", count: 52, color: "from-green-500 to-emerald-500" },
  { name: "Productivity", icon: "⚡", count: 29, color: "from-yellow-500 to-orange-500" },
  { name: "Marketing", icon: "📈", count: 31, color: "from-red-500 to-rose-500" },
  { name: "Writing", icon: "✍️", count: 27, color: "from-indigo-500 to-blue-500" }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTools = popularTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Discover the latest AI tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-slide-up">
              VaultX AI Tools
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12 animate-scale-in">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">AI Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">9</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect AI tool for your specific needs across different domains
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="card hover-lift p-6 text-center transition-all duration-300">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} tools
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular AI Tools</h2>
              <p className="text-lg text-muted-foreground">
                Discover the most trending and highly-rated AI tools
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {['All', 'Language', 'Design', 'Development', 'Productivity', 'Marketing'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="card hover-lift group">
                <div className="card-header">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{tool.logo}</div>
                      <div>
                        <h3 className="card-title group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{tool.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({tool.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="badge badge-secondary mb-1">
                        {tool.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tool.growth} growth
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {tool.weeklyUsers.toLocaleString()} weekly users
                    </div>
                    <Link
                      href={`/tool/${tool.id}`}
                      className="btn btn-primary btn-sm group-hover:shadow-glow transition-all duration-200"
                    >
                      View Details
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to explore the future of AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users discovering and mastering the most powerful AI tools available today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="btn btn-primary bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Browse All Tools
            </Link>
            <Link
              href="/trending"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              See Trending
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
