"use client";

import Link from "next/link";
import { useState } from "react";

// Mock data for categories and tools
const categories = [
  {
    name: "Development",
    description: "AI-powered development tools and utilities",
    toolCount: 12,
    color: "bg-blue-500"
  },
  {
    name: "Design",
    description: "Creative design and visual content tools",
    toolCount: 8,
    color: "bg-purple-500"
  },
  {
    name: "Analytics",
    description: "Data analysis and business intelligence tools",
    toolCount: 6,
    color: "bg-green-500"
  },
  {
    name: "Writing",
    description: "Content creation and writing assistance",
    toolCount: 10,
    color: "bg-yellow-500"
  },
  {
    name: "Media",
    description: "Video, audio, and multimedia tools",
    toolCount: 7,
    color: "bg-red-500"
  },
  {
    name: "Communication",
    description: "Chatbots and communication tools",
    toolCount: 5,
    color: "bg-indigo-500"
  }
];

const toolsByCategory = {
  "Development": [
    { id: 1, name: "AI Code Assistant", rating: 4.8, description: "Advanced code completion and debugging" },
    { id: 2, name: "GitHub Copilot", rating: 4.7, description: "AI pair programming assistant" },
    { id: 3, name: "Code Review AI", rating: 4.6, description: "Automated code review and suggestions" }
  ],
  "Design": [
    { id: 4, name: "Image Generator Pro", rating: 4.6, description: "Create stunning images from text" },
    { id: 5, name: "UI Design Assistant", rating: 4.5, description: "AI-powered UI/UX design tools" },
    { id: 6, name: "Logo Creator AI", rating: 4.4, description: "Generate professional logos instantly" }
  ],
  "Analytics": [
    { id: 7, name: "Data Analyzer AI", rating: 4.9, description: "Intelligent data analysis" },
    { id: 8, name: "Business Intelligence", rating: 4.7, description: "AI-driven business insights" },
    { id: 9, name: "Predictive Analytics", rating: 4.6, description: "Forecast trends and patterns" }
  ],
  "Writing": [
    { id: 10, name: "Content Writer", rating: 4.7, description: "AI-powered content creation" },
    { id: 11, name: "Grammar Checker Pro", rating: 4.8, description: "Advanced grammar and style checking" },
    { id: 12, name: "Blog Post Generator", rating: 4.5, description: "Generate engaging blog content" }
  ],
  "Media": [
    { id: 13, name: "Video Editor AI", rating: 4.5, description: "Automated video editing" },
    { id: 14, name: "Audio Enhancement", rating: 4.4, description: "AI-powered audio processing" },
    { id: 15, name: "Thumbnail Generator", rating: 4.3, description: "Create eye-catching thumbnails" }
  ],
  "Communication": [
    { id: 16, name: "Chatbot Builder", rating: 4.4, description: "Create intelligent chatbots" },
    { id: 17, name: "Email Assistant", rating: 4.6, description: "AI-powered email composition" },
    { id: 18, name: "Translation Pro", rating: 4.5, description: "Real-time language translation" }
  ]
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
              <Link href="/categories" className="text-blue-600 dark:text-blue-400 font-medium">
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Browse AI tools organized by category to find exactly what you need
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
              className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-left ${
                selectedCategory === category.name
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mr-4`}>
                  <span className="text-white font-bold text-lg">
                    {category.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.toolCount} tools
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {/* Tools for Selected Category */}
        {selectedCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCategory} Tools
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsByCategory[selectedCategory as keyof typeof toolsByCategory]?.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tool/${tool.id}`}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {tool.name}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                        {tool.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 