'use client';

import { useState } from 'react';
import Link from 'next/link';

// Simple SVG icons as fallback
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const categories = [
  {
    name: "Language",
    icon: "💬",
    description: "AI tools for text generation, translation, and language processing",
    toolCount: 45,
    avgRating: 4.6,
    totalReviews: 2847,
    color: "from-blue-500 to-cyan-500",
    popularTools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
  },
  {
    name: "Design",
    icon: "🎨",
    description: "AI-powered design tools for graphics, images, and visual content",
    toolCount: 38,
    avgRating: 4.4,
    totalReviews: 2156,
    color: "from-purple-500 to-pink-500",
    popularTools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
  },
  {
    name: "Development",
    icon: "💻",
    description: "AI coding assistants and development tools for programmers",
    toolCount: 52,
    avgRating: 4.7,
    totalReviews: 3892,
    color: "from-green-500 to-emerald-500",
    popularTools: ["GitHub Copilot", "CodeWhisperer", "Tabnine", "Replit"]
  },
  {
    name: "Productivity",
    icon: "⚡",
    description: "AI tools to boost productivity and streamline workflows",
    toolCount: 29,
    avgRating: 4.5,
    totalReviews: 1678,
    color: "from-yellow-500 to-orange-500",
    popularTools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
  },
  {
    name: "Marketing",
    icon: "📈",
    description: "AI marketing tools for content creation and campaign optimization",
    toolCount: 31,
    avgRating: 4.3,
    totalReviews: 1432,
    color: "from-red-500 to-rose-500",
    popularTools: ["Jasper", "Copy.ai", "Writesonic", "Surfer"]
  },
  {
    name: "Writing",
    icon: "✍️",
    description: "AI writing assistants for content creation and editing",
    toolCount: 27,
    avgRating: 4.4,
    totalReviews: 1892,
    color: "from-indigo-500 to-blue-500",
    popularTools: ["Grammarly", "Hemingway", "ProWritingAid", "Wordtune"]
  },
  {
    name: "Media",
    icon: "🎬",
    description: "AI tools for video, audio, and multimedia content creation",
    toolCount: 23,
    avgRating: 4.2,
    totalReviews: 987,
    color: "from-pink-500 to-rose-500",
    popularTools: ["Runway", "Synthesia", "Descript", "Lumen5"]
  },
  {
    name: "Analytics",
    icon: "📊",
    description: "AI-powered analytics and data visualization tools",
    toolCount: 19,
    avgRating: 4.6,
    totalReviews: 756,
    color: "from-teal-500 to-cyan-500",
    popularTools: ["Tableau", "Power BI", "Looker", "Metabase"]
  },
  {
    name: "Communication",
    icon: "💬",
    description: "AI communication tools for meetings, chat, and collaboration",
    toolCount: 18,
    avgRating: 4.3,
    totalReviews: 634,
    color: "from-violet-500 to-purple-500",
    popularTools: ["Zoom AI", "Slack AI", "Microsoft Teams", "Discord"]
  }
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <StarIcon
      key={i}
      className={`w-3 h-3 ${
        i < Math.floor(rating) 
          ? 'text-yellow-500 fill-current' 
          : i < rating 
          ? 'text-yellow-500 fill-current opacity-50' 
          : 'text-gray-300'
      }`}
    />
  ));
};

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Explore AI tools by category</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-slide-up">
              AI Tool Categories
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Discover the perfect AI tools organized by category. Find exactly what you need for your specific use case.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-12 animate-scale-in">
              <div className="relative">
                <SparklesIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {categories.reduce((sum, cat) => sum + cat.toolCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Tools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {categories.reduce((sum, cat) => sum + cat.totalReviews, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.5</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="text-center mb-12">
              <p className="text-lg text-muted-foreground">
                {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : 'y'} found
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="card hover-lift h-full transition-all duration-300">
                  <div className="card-header">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <div className="text-right">
                        <div className="badge badge-secondary">
                          {category.toolCount} tools
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="card-title text-xl mb-3 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="card-content">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                                           <div className="flex items-center gap-2">
                       <div className="flex items-center gap-1">
                         {renderStars(category.avgRating)}
                       </div>
                       <div>
                         <div className="text-sm font-medium">{category.avgRating}</div>
                         <div className="text-xs text-muted-foreground">Avg Rating</div>
                       </div>
                     </div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">{category.totalReviews.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Reviews</div>
                        </div>
                      </div>
                    </div>

                    {/* Popular Tools */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                        Popular Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.popularTools.slice(0, 3).map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground"
                          >
                            {tool}
                          </span>
                        ))}
                        {category.popularTools.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-xs rounded-md text-muted-foreground">
                            +{category.popularTools.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ChartBarIcon className="w-4 h-4" />
                        View all {category.toolCount} tools
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="btn btn-primary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 text-center">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
             Can&apos;t find what you&apos;re looking for?
           </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse all tools or use our advanced search to find the perfect AI solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
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