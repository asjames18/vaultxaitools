"use client";

import Link from "next/link";
import { useState } from "react";

// Mock data for trending tools
const trendingTools = [
  {
    id: 1,
    name: "AI Code Assistant",
    description: "Advanced code completion and debugging with AI",
    category: "Development",
    rating: 4.8,
    growth: "+45%",
    weeklyUsers: 15420,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "Image Generator Pro",
    description: "Create stunning images from text descriptions",
    category: "Design",
    rating: 4.6,
    growth: "+32%",
    weeklyUsers: 12850,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "Data Analyzer AI",
    description: "Intelligent data analysis and visualization",
    category: "Analytics",
    rating: 4.9,
    growth: "+67%",
    weeklyUsers: 8920,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 4,
    name: "Content Writer",
    description: "AI-powered content creation and editing",
    category: "Writing",
    rating: 4.7,
    growth: "+28%",
    weeklyUsers: 11230,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 5,
    name: "Video Editor AI",
    description: "Automated video editing and enhancement",
    category: "Media",
    rating: 4.5,
    growth: "+89%",
    weeklyUsers: 6750,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 6,
    name: "Chatbot Builder",
    description: "Create intelligent conversational agents",
    category: "Communication",
    rating: 4.4,
    growth: "+23%",
    weeklyUsers: 5430,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 7,
    name: "AI Translator",
    description: "Real-time language translation with context",
    category: "Communication",
    rating: 4.6,
    growth: "+156%",
    weeklyUsers: 2340,
    trend: "up",
    image: "/api/placeholder/300/200"
  },
  {
    id: 8,
    name: "Voice Cloner",
    description: "AI-powered voice synthesis and cloning",
    category: "Media",
    rating: 4.3,
    growth: "+78%",
    weeklyUsers: 4560,
    trend: "up",
    image: "/api/placeholder/300/200"
  }
];

const trendingCategories = [
  {
    name: "Development",
    growth: "+45%",
    toolCount: 12,
    color: "bg-blue-500"
  },
  {
    name: "Design",
    growth: "+32%",
    toolCount: 8,
    color: "bg-purple-500"
  },
  {
    name: "Analytics",
    growth: "+67%",
    toolCount: 6,
    color: "bg-green-500"
  },
  {
    name: "Media",
    growth: "+89%",
    toolCount: 7,
    color: "bg-red-500"
  }
];

export default function TrendingClient() {
  const [timeFilter, setTimeFilter] = useState("week");

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              VaultX AI Tools
            </h1>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Home
              </Link>
              <Link href="/categories" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Categories
              </Link>
              <Link href="/trending" className="text-blue-600 dark:text-blue-400 font-medium">
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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trending AI Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Discover the fastest-growing AI tools this week
              </p>
            </div>
            
            {/* Time Filter */}
            <div className="mt-4 sm:mt-0">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                {["day", "week", "month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                      timeFilter === filter
                        ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Trending Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                    {category.name.charAt(0)}
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    {category.growth}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {category.toolCount} tools
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Tools */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Trending Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {tool.name}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      {tool.growth}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      {tool.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {tool.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 