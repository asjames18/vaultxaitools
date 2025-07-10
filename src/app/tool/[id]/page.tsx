"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock data for tool details
const toolData = {
  1: {
    id: 1,
    name: "AI Code Assistant",
    description: "Advanced code completion and debugging with AI-powered suggestions and real-time error detection.",
    longDescription: "AI Code Assistant is a revolutionary development tool that leverages artificial intelligence to enhance your coding experience. It provides intelligent code completion, real-time error detection, and automated refactoring suggestions to help you write better code faster.",
    category: "Development",
    rating: 4.8,
    reviewCount: 1247,
    price: "Free",
    pricing: {
      free: "Basic features with 100 completions/month",
      pro: "$19/month - Unlimited completions",
      enterprise: "Custom pricing for teams"
    },
    features: [
      "Intelligent code completion",
      "Real-time error detection",
      "Automated refactoring",
      "Multi-language support",
      "IDE integration",
      "Git integration",
      "Code documentation generation",
      "Performance optimization suggestions"
    ],
    pros: [
      "Excellent code completion accuracy",
      "Seamless IDE integration",
      "Fast response times",
      "Comprehensive language support"
    ],
    cons: [
      "Limited free tier",
      "Requires internet connection",
      "Learning curve for advanced features"
    ],
    website: "https://example.com",
    github: "https://github.com/example",
    tags: ["AI", "Development", "Code Completion", "IDE"]
  },
  2: {
    id: 2,
    name: "Image Generator Pro",
    description: "Create stunning images from text descriptions using advanced AI models.",
    longDescription: "Image Generator Pro transforms your text descriptions into beautiful, high-quality images using state-of-the-art AI models. Perfect for designers, marketers, and content creators who need unique visuals quickly.",
    category: "Design",
    rating: 4.6,
    reviewCount: 892,
    price: "$15/month",
    pricing: {
      starter: "$15/month - 100 images",
      pro: "$29/month - 500 images",
      enterprise: "Custom pricing"
    },
    features: [
      "Text-to-image generation",
      "Multiple art styles",
      "High-resolution output",
      "Batch processing",
      "API access",
      "Commercial usage rights",
      "Style customization",
      "Image editing tools"
    ],
    pros: [
      "High-quality image generation",
      "Wide variety of styles",
      "Fast generation times",
      "Commercial usage included"
    ],
    cons: [
      "Limited free tier",
      "Some styles require credits",
      "Occasional generation errors"
    ],
    website: "https://example.com",
    github: null,
    tags: ["AI", "Design", "Image Generation", "Creative"]
  }
};

export default function ToolDetails() {
  const params = useParams();
  const toolId = parseInt(params.id as string);
  const tool = toolData[toolId as keyof typeof toolData];
  const [activeTab, setActiveTab] = useState("overview");

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
              <div className="flex items-center mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                  {tool.category}
                </span>
                <div className="flex items-center ml-4">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-600 dark:text-gray-300 ml-1">
                    {tool.rating} ({tool.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {tool.name}
              </h1>
              
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
                  Visit Website
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
                  {('free' in tool.pricing ? tool.pricing.free : tool.pricing.starter)}
                </p>
                <button className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
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
                <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                          <span className="text-green-500 mr-2">✓</span>
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
                          <span className="text-red-500 mr-2">✗</span>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Reviews
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reviews coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 