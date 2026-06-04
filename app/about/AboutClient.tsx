"use client";

import Link from "next/link";

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About Melanated In Tech
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our mission is to educate, empower, and inspire people to use technology as a tool for growth, opportunity, creativity, and impact.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The technology landscape is constantly evolving, with new AI tools, automation platforms, and development frameworks emerging regularly. Our mission is to curate, categorize, and showcase quality tech resources, making it easier for learners, builders, and entrepreneurs to find the right tools for their specific goals.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We believe that technology should be accessible to everyone, regardless of technical background or budget. That&apos;s why we provide practical guides, curated tool comparisons, and beginner-friendly resources to help you make informed decisions and start building real skills today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">
                    40+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    AI Tools & Resources
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    Growing
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Community
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 dark:text-green-400 mb-2">
                    10+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Categories
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Why Choose Melanated In Tech?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Curated selection of quality AI tools
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Detailed information and comparisons
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Organized by categories and use cases
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Regular updates and new discoveries
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Easy-to-use search and filtering
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our curated collection of AI tools organized by categories and use cases.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Compare
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Read detailed information, compare features, and see tool specifications to make informed decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Implement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get started with the AI tools that best fit your needs and start creating amazing things.
              </p>
            </div>
          </div>
        </div>

        {/* About Melanated In Tech Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            About Melanated In Tech
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Melanated In Tech is a curated platform dedicated to helping users discover and understand AI tools. We focus on providing accurate, up-to-date information about AI applications across various domains including language processing, image generation, development tools, and productivity solutions.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Our platform is designed to be a reliable resource for students, career changers, creators, and entrepreneurs who want to leverage AI technology. We continuously update our database with new tools and maintain quality standards to ensure you find the right AI solution for your needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600 dark:text-green-400">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Curated Quality
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Hand-picked AI tools with verified information and accurate details
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600 dark:text-green-400">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Easy Discovery
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Powerful search and filtering to find exactly what you need
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600 dark:text-green-400">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Always Updated
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Regular updates with new tools and current information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you. Reach out to us and help us improve the platform for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:contact@melanatedintech.com"
              className="bg-green-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-400 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/AITools"
              className="bg-green-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-green-400 transition-colors"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}