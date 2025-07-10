"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Enhanced mock data for tool details
const toolData = {
  1: {
    id: 1,
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced language model for conversation and text generation",
    longDescription: "ChatGPT is a powerful AI language model developed by OpenAI that can engage in human-like conversations, answer questions, write content, and assist with various tasks. It's trained on a diverse range of internet text and can understand context, generate creative content, and provide helpful responses across multiple domains.",
    category: "Language",
    rating: 4.8,
    reviewCount: 1247,
    price: "Free",
    pricing: {
      free: "Basic access with GPT-3.5",
      plus: "$20/month - GPT-4 access",
      enterprise: "Custom pricing for businesses"
    },
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
    website: "https://chat.openai.com",
    github: null,
    tags: ["AI", "Language", "Conversation", "OpenAI"],
    screenshots: [
      "/api/placeholder/800/450",
      "/api/placeholder/800/450",
      "/api/placeholder/800/450"
    ],
    videoUrl: "https://www.youtube.com/embed/example",
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "2024-01-15",
        comment: "ChatGPT has revolutionized how I write content. The quality and speed are incredible!"
      },
      {
        id: 2,
        user: "Mike R.",
        rating: 4,
        date: "2024-01-10",
        comment: "Great for brainstorming and initial drafts. Sometimes needs fact-checking though."
      },
      {
        id: 3,
        user: "Alex K.",
        rating: 5,
        date: "2024-01-08",
        comment: "Use it daily for coding help and debugging. Saves me hours of work."
      },
      {
        id: 4,
        user: "Emma L.",
        rating: 4,
        date: "2024-01-05",
        comment: "Excellent for creative writing and idea generation. Very intuitive interface."
      }
    ]
  },
  2: {
    id: 2,
    name: "Midjourney",
    logo: "🎨",
    description: "AI-powered image generation from text descriptions",
    longDescription: "Midjourney is a cutting-edge AI art generation platform that creates stunning, high-quality images from text prompts. It's particularly known for its artistic style and ability to generate beautiful, detailed artwork. Users can create everything from photorealistic images to fantastical artwork with simple text descriptions.",
    category: "Design",
    rating: 4.6,
    reviewCount: 892,
    price: "$10/month",
    pricing: {
      basic: "$10/month - 200 images",
      standard: "$30/month - Unlimited images",
      pro: "$60/month - Priority access"
    },
    features: [
      "Text-to-image generation",
      "High-resolution output",
      "Multiple art styles",
      "Discord integration",
      "Community features",
      "Commercial usage rights",
      "Style customization",
      "Batch processing"
    ],
    pros: [
      "Exceptional artistic quality",
      "Unique artistic style",
      "Active community",
      "Regular updates"
    ],
    cons: [
      "Discord-only interface",
      "Limited free trial",
      "Queue times during peak hours",
      "Learning curve for prompts"
    ],
    website: "https://midjourney.com",
    github: null,
    tags: ["AI", "Design", "Image Generation", "Art"],
    screenshots: [
      "/api/placeholder/800/450",
      "/api/placeholder/800/450",
      "/api/placeholder/800/450"
    ],
    videoUrl: "https://www.youtube.com/embed/example2",
    reviews: [
      {
        id: 1,
        user: "David P.",
        rating: 5,
        date: "2024-01-12",
        comment: "The quality of generated images is absolutely stunning. Worth every penny!"
      },
      {
        id: 2,
        user: "Lisa W.",
        rating: 4,
        date: "2024-01-09",
        comment: "Great for concept art and creative projects. Discord interface takes getting used to."
      },
      {
        id: 3,
        user: "Tom H.",
        rating: 5,
        date: "2024-01-07",
        comment: "Perfect for creating unique artwork. The community is very helpful too."
      }
    ]
  },
  3: {
    id: 3,
    name: "GitHub Copilot",
    logo: "💻",
    description: "AI pair programmer that helps write code faster",
    longDescription: "GitHub Copilot is an AI-powered code completion tool that acts as your programming partner. It suggests whole lines or blocks of code as you type, helping you write code faster and with fewer errors. It's trained on billions of lines of public code and can work with most programming languages.",
    category: "Development",
    rating: 4.7,
    reviewCount: 2156,
    price: "$10/month",
    pricing: {
      individual: "$10/month - Personal use",
      business: "$19/month - Business features",
      education: "Free for students"
    },
    features: [
      "Real-time code suggestions",
      "Multi-language support",
      "IDE integration",
      "GitHub integration",
      "Code explanation",
      "Test generation",
      "Documentation help",
      "Security scanning"
    ],
    pros: [
      "Significantly speeds up coding",
      "Excellent IDE integration",
      "Supports many languages",
      "Learns from your style"
    ],
    cons: [
      "Can suggest incorrect code",
      "Requires internet connection",
      "Privacy concerns",
      "Learning curve"
    ],
    website: "https://github.com/features/copilot",
    github: "https://github.com/github/copilot",
    tags: ["AI", "Development", "Code", "GitHub"],
    screenshots: [
      "/api/placeholder/800/450",
      "/api/placeholder/800/450",
      "/api/placeholder/800/450"
    ],
    videoUrl: "https://www.youtube.com/embed/example3",
    reviews: [
      {
        id: 1,
        user: "Chris D.",
        rating: 5,
        date: "2024-01-14",
        comment: "Game changer for productivity. Saves me hours every day!"
      },
      {
        id: 2,
        user: "Anna S.",
        rating: 4,
        date: "2024-01-11",
        comment: "Great for boilerplate code and common patterns. Sometimes needs review."
      },
      {
        id: 3,
        user: "Ryan M.",
        rating: 5,
        date: "2024-01-08",
        comment: "Perfect integration with VS Code. Makes coding much more enjoyable."
      }
    ]
  }
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ToolDetails() {
  const params = useParams();
  const toolId = parseInt(params.id as string);
  const tool = toolData[toolId as keyof typeof toolData];
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(0);

  if (!tool) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Not Found
          </h1>
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              VaultX AI Tools
            </Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
              <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Categories
              </Link>
              <Link href="/trending" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Trending
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400">
                Categories
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/categories?category=${tool.category}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                {tool.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{tool.name}</li>
          </ol>
        </nav>

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{tool.logo}</div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {tool.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                      {tool.category}
                    </span>
                    <div className="flex items-center">
                      <StarRating rating={tool.rating} />
                      <span className="text-gray-600 dark:text-gray-300 ml-2">
                        {tool.rating} ({tool.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                {tool.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Official Website
                </a>
                {tool.github && (
                  <a
                    href={tool.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Pricing
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.price}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {('free' in tool.pricing ? tool.pricing.free : 
                    'basic' in tool.pricing ? tool.pricing.basic : 
                    'individual' in tool.pricing ? tool.pricing.individual : 
                    Object.values(tool.pricing)[0] as string)}
                </p>
                <button className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots/Video Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Screenshots & Overview
          </h2>
          
          {/* Main Image/Video */}
          <div className="mb-6">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-lg">
                {activeTab === "video" ? "Video Player" : `Screenshot ${activeImage + 1}`}
              </span>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("screenshots")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "screenshots"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Screenshots
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Video Overview
            </button>
          </div>

          {activeTab === "screenshots" && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              {tool.screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 transition-colors ${
                    activeImage === index
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    Screenshot {index + 1}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-8">
              {["overview", "features", "pricing", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {tool.longDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Pros
                    </h4>
                    <ul className="space-y-2">
                      {tool.pros.map((pro, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-gray-600 dark:text-gray-300">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Cons
                    </h4>
                    <ul className="space-y-2">
                      {tool.cons.map((con, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-1">✗</span>
                          <span className="text-gray-600 dark:text-gray-300">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-blue-500 mr-3">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pricing" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Pricing Plans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(tool.pricing).map(([plan, description]) => (
                    <div key={plan} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                        {plan}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  User Reviews
                </h3>
                <div className="space-y-6">
                  {tool.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {review.user}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 