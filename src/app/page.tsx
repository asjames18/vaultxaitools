"use client";

import Link from "next/link";
import { useState } from "react";

// Curated list of popular AI tools
const popularTools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Advanced language model for conversation and text generation",
    category: "Language",
    website: "https://chat.openai.com"
  },
  {
    id: 2,
    name: "Midjourney",
    description: "AI-powered image generation from text descriptions",
    category: "Design",
    website: "https://midjourney.com"
  },
  {
    id: 3,
    name: "GitHub Copilot",
    description: "AI pair programmer that helps write code faster",
    category: "Development",
    website: "https://github.com/features/copilot"
  },
  {
    id: 4,
    name: "Notion AI",
    description: "Writing assistant integrated into Notion workspace",
    category: "Productivity",
    website: "https://notion.so"
  },
  {
    id: 5,
    name: "Jasper",
    description: "AI content creation platform for marketing and writing",
    category: "Marketing",
    website: "https://jasper.ai"
  },
  {
    id: 6,
    name: "DALL-E",
    description: "AI system that creates realistic images from text",
    category: "Design",
    website: "https://openai.com/dall-e-2"
  },
  {
    id: 7,
    name: "Grammarly",
    description: "AI-powered writing assistant for grammar and style",
    category: "Writing",
    website: "https://grammarly.com"
  },
  {
    id: 8,
    name: "Canva AI",
    description: "AI design tools integrated into Canva platform",
    category: "Design",
    website: "https://canva.com"
  },
  {
    id: 9,
    name: "Copy.ai",
    description: "AI copywriting tool for marketing content",
    category: "Marketing",
    website: "https://copy.ai"
  },
  {
    id: 10,
    name: "Stable Diffusion",
    description: "Open-source image generation model",
    category: "Design",
    website: "https://stability.ai"
  },
  {
    id: 11,
    name: "CodeWhisperer",
    description: "Amazon's AI code generator for developers",
    category: "Development",
    website: "https://aws.amazon.com/codewhisperer"
  },
  {
    id: 12,
    name: "Runway",
    description: "AI-powered video editing and generation platform",
    category: "Media",
    website: "https://runwayml.com"
  }
];

const categories = ["All", "Language", "Design", "Development", "Productivity", "Marketing", "Writing", "Media"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = popularTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-white dark:bg-gray-50">
      {/* Minimal Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white text-center mb-2">
            VaultX AI Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Discover the best AI tools for your workflow
          </p>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-white dark:text-gray-900 placeholder-gray-500"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-200 text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-900 mb-1">
                    {tool.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-50 text-blue-700 dark:text-blue-700 text-xs font-medium rounded-full">
                    {tool.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-600 text-sm mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Action Button */}
              <div className="flex gap-3">
                <Link
                  href={`/tool/${tool.id}`}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  View Details
                </Link>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-gray-300 dark:border-gray-300 text-gray-700 dark:text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors text-center"
                >
                  Visit Site
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-900 mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-600">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <nav className="flex justify-center space-x-8 mb-4">
            <Link href="/categories" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-600 transition-colors">
              Categories
            </Link>
            <Link href="/trending" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-600 transition-colors">
              Trending
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-600 transition-colors">
              About
            </Link>
          </nav>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © 2024 VaultX AI Tools. Curated with ❤️
          </p>
        </div>
      </footer>
    </main>
  );
}
