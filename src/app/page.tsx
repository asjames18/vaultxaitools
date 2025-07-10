"use client";

import Link from "next/link";
import { useState } from "react";

// Mock data for tools
const tools = [
  {
    id: 1,
    name: "AI Code Assistant",
    description: "Advanced code completion and debugging with AI",
    category: "Development",
    rating: 4.8,
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "Image Generator Pro",
    description: "Create stunning images from text descriptions",
    category: "Design",
    rating: 4.6,
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "Data Analyzer AI",
    description: "Intelligent data analysis and visualization",
    category: "Analytics",
    rating: 4.9,
    image: "/api/placeholder/300/200"
  },
  {
    id: 4,
    name: "Content Writer",
    description: "AI-powered content creation and editing",
    category: "Writing",
    rating: 4.7,
    image: "/api/placeholder/300/200"
  },
  {
    id: 5,
    name: "Video Editor AI",
    description: "Automated video editing and enhancement",
    category: "Media",
    rating: 4.5,
    image: "/api/placeholder/300/200"
  },
  {
    id: 6,
    name: "Chatbot Builder",
    description: "Create intelligent conversational agents",
    category: "Communication",
    rating: 4.4,
    image: "/api/placeholder/300/200"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Development", "Design", "Analytics", "Writing", "Media", "Communication"];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium">
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

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Discover AI Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Explore the latest AI-powered tools to enhance your workflow
          </p>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Tool Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {tool.category}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                      {tool.rating}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tools found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
