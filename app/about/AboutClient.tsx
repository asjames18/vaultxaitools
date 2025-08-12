"use client";

import Link from "next/link";

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About VaultX AI Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We&apos;re on a mission to democratize access to AI tools and help creators, developers, and businesses discover the perfect AI solutions for their needs.
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
                The AI landscape is evolving rapidly, with new tools emerging every day. Our mission is to curate, categorize, and showcase the best AI tools available, making it easy for everyone to find the right solution for their specific needs.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We believe that AI should be accessible to everyone, regardless of their technical background. That&apos;s why we provide detailed reviews, comparisons, and insights to help you make informed decisions about which AI tools to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    AI Tools Curated
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    50K+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Monthly Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    15+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    AI Tools
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Why Choose VaultX?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Curated selection of the best AI tools
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Detailed reviews and comparisons
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Real-time trending data
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  User ratings and feedback
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✓</span>
                  Regular updates and new discoveries
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
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Discover
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our curated collection of AI tools across different categories and use cases.
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
                Read detailed reviews, compare features, and see real user ratings to make informed decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
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

        {/* Team Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600 dark:text-gray-400">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Antonio James
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-2">Founder & CEO</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI enthusiast with 10+ years in tech. Passionate about making AI accessible to everyone.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600 dark:text-gray-400">👩‍🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Rasheena James
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-2">Head of Curation</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Expert in discovering and evaluating AI tools. Ensures quality and relevance of our recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-gray-600 dark:text-gray-400">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dewayne Brady
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-2">Lead Marketer & Tester</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Lead marketer and tester focused on data-driven growth and flawless AI product experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you. Reach out to us and let&apos;s build the future of AI together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:contact@vaultxaitools.com"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 