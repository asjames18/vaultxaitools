'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  StarIcon, 
  ArrowLeftIcon, 
  ExternalLinkIcon, 
  PlayIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data - replace with API call
const tool = {
  id: 1,
  name: "ChatGPT",
  logo: "🤖",
  description: "Advanced language model for conversation and text generation",
  longDescription: "ChatGPT is a powerful AI language model developed by OpenAI that can engage in human-like conversations, answer questions, write content, and assist with various tasks. It's trained on a diverse range of internet text and can understand context, generate creative content, and provide helpful responses across multiple domains.",
  category: "Language",
  website: "https://chat.openai.com",
  github: "https://github.com/openai/chatgpt",
  rating: 4.8,
  reviewCount: 1247,
  weeklyUsers: 15420,
  growth: "+45%",
  pricing: [
    { plan: "Free", price: "Free", description: "Basic access with GPT-3.5" },
    { plan: "Plus", price: "$20/month", description: "GPT-4 access with priority" },
    { plan: "Enterprise", price: "Custom", description: "Custom pricing for businesses" }
  ],
  features: [
    "Natural language conversations",
    "Code generation and debugging",
    "Content creation and editing",
    "Translation and language learning",
    "Problem solving and analysis",
    "Creative writing assistance",
    "API access for developers",
    "Multi-language support"
  ],
  pros: [
    "Exceptional conversational abilities",
    "Wide range of use cases",
    "Regular model updates",
    "Strong community support"
  ],
  cons: [
    "Limited free tier features",
    "Occasional factual inaccuracies",
    "Requires internet connection",
    "Content moderation limitations"
  ],
  screenshots: [
    "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+1",
    "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+2",
    "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+3"
  ],
  videoUrl: "https://www.youtube.com/embed/example1",
  reviews: [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "👩‍💻",
      rating: 5,
      comment: "ChatGPT has completely transformed my workflow. The ability to generate code, debug issues, and get instant explanations has made me 10x more productive.",
      date: "2024-01-15"
    },
    {
      id: 2,
      user: "Mike Chen",
      avatar: "👨‍🎨",
      rating: 4,
      comment: "Great for brainstorming and content creation. Sometimes the responses can be a bit generic, but overall very useful for my design process.",
      date: "2024-01-10"
    },
    {
      id: 3,
      user: "Alex Rodriguez",
      avatar: "👨‍💼",
      rating: 5,
      comment: "Incredible tool for business writing and communication. Saves me hours every week on email drafting and content creation.",
      date: "2024-01-08"
    }
  ]
};

const tabs = [
  { id: 'overview', name: 'Overview', icon: PhotoIcon },
  { id: 'features', name: 'Features', icon: CheckCircleIcon },
  { id: 'pricing', name: 'Pricing', icon: CurrencyDollarIcon },
  { id: 'reviews', name: 'Reviews', icon: ChatBubbleLeftRightIcon }
];

export default function ToolDetails({ params }: { params: { id: string } }) {
  // TODO: Use params.id to fetch tool data from API
  console.log('Tool ID:', params.id);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideo, setShowVideo] = useState(false);

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
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="btn btn-ghost btn-sm flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Tools
            </Link>
            
            <div className="flex items-center gap-4">
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Visit Site
              </a>
              {tool.github && (
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tool Header */}
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="text-6xl">{tool.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{tool.name}</h1>
                    <div className="badge badge-secondary">{tool.category}</div>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      {renderStars(tool.rating)}
                      <span className="font-medium">{tool.rating}</span>
                      <span className="text-muted-foreground">({tool.reviewCount})</span>
                    </div>
                    <div className="text-muted-foreground">
                      {tool.weeklyUsers.toLocaleString()} weekly users
                    </div>
                    <div className="text-green-600 font-medium">
                      {tool.growth} growth
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Visit Website
                </a>
                <button className="btn btn-outline">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">About {tool.name}</h2>
                  </div>
                  <div className="card-content">
                    <p className="text-muted-foreground leading-relaxed">
                      {tool.longDescription}
                    </p>
                  </div>
                </div>

                {/* Screenshots/Video */}
                <div className="card">
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <h2 className="card-title">Screenshots & Demo</h2>
                      <button
                        onClick={() => setShowVideo(!showVideo)}
                        className="btn btn-outline btn-sm flex items-center gap-2"
                      >
                        {showVideo ? <PhotoIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                        {showVideo ? 'Show Screenshots' : 'Show Video'}
                      </button>
                    </div>
                  </div>
                  <div className="card-content">
                    {showVideo ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <iframe
                          src={tool.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tool.screenshots.map((screenshot, index) => (
                          <div
                            key={index}
                            className="aspect-video rounded-lg overflow-hidden bg-gray-100"
                          >
                            <img
                              src={screenshot}
                              alt={`${tool.name} screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-8">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Key Features</h2>
                  </div>
                  <div className="card-content">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        Pros
                      </h3>
                    </div>
                    <div className="card-content">
                      <ul className="space-y-2">
                        {tool.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title flex items-center gap-2">
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                        Cons
                      </h3>
                    </div>
                    <div className="card-content">
                      <ul className="space-y-2">
                        {tool.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Pricing Plans</h2>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tool.pricing.map((plan, index) => (
                      <div key={index} className="card hover-lift">
                        <div className="card-header text-center">
                          <h3 className="card-title">{plan.plan}</h3>
                          <div className="text-3xl font-bold text-primary mb-2">
                            {plan.price}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {plan.description}
                          </p>
                        </div>
                        <div className="card-footer">
                          <button className="btn btn-primary w-full">
                            Get Started
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">User Reviews</h2>
                  <button className="btn btn-primary">Write a Review</button>
                </div>
                
                <div className="space-y-6">
                  {tool.reviews.map((review) => (
                    <div key={review.id} className="card">
                      <div className="card-content">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{review.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold">{review.user}</h4>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Stats</h3>
              </div>
              <div className="card-content space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    {renderStars(tool.rating)}
                    <span className="font-medium">{tool.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium">{tool.reviewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weekly Users</span>
                  <span className="font-medium">{tool.weeklyUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Growth</span>
                  <span className="font-medium text-green-600">{tool.growth}</span>
                </div>
              </div>
            </div>

            {/* Similar Tools */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Similar Tools</h3>
              </div>
              <div className="card-content space-y-3">
                {['Claude', 'Bard', 'Perplexity'].map((name, index) => (
                  <Link
                    key={index}
                    href={`/tool/${index + 2}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="text-2xl">🤖</div>
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-muted-foreground">Language AI</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 