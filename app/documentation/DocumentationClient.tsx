'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon, UserIcon, CogIcon, ChatBubbleLeftRightIcon, StarIcon, MagnifyingGlassIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function DocumentationClient() {
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpenIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Welcome to VaultX AI Tools</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              VaultX AI Tools is your comprehensive directory for discovering, reviewing, and sharing the best AI tools and applications. 
              Whether you're a developer, business professional, or AI enthusiast, our platform helps you find the perfect AI solutions.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Key Features</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Tool Discovery:</strong> Browse thousands of AI tools across various categories</li>
              <li><strong>User Reviews:</strong> Read authentic reviews from real users</li>
              <li><strong>Trending Tools:</strong> Discover what's popular in the AI community</li>
              <li><strong>Tool Submissions:</strong> Submit your own AI tools to the directory</li>
              <li><strong>Advanced Search:</strong> Find tools based on specific criteria</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Quick Navigation</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Browse Tools</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Explore our AI tools directory</div>
              </Link>
              <Link href="/categories" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Categories</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Browse tools by category</div>
              </Link>

              <Link href="/submit-tool" className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Submit Tool</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Add your AI tool</div>
              </Link>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'browsing-tools',
      title: 'Browsing Tools',
      icon: MagnifyingGlassIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Find AI Tools</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Discover AI tools that match your needs using our powerful search and filtering system.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Search Features</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Keyword Search:</strong> Search by tool name, description, or features</li>
              <li><strong>Category Filter:</strong> Filter tools by specific categories (e.g., Text Generation, Image Creation)</li>
              <li><strong>Price Filter:</strong> Find free, freemium, or paid tools</li>
              <li><strong>Rating Filter:</strong> Browse tools by user ratings</li>
              <li><strong>Sort Options:</strong> Sort by newest, most popular, highest rated, or alphabetical</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tool Cards Information</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Tool Name:</strong> The name of the AI tool</div>
                <div><strong>Description:</strong> Brief overview of what the tool does</div>
                <div><strong>Category:</strong> The primary category the tool belongs to</div>
                <div><strong>Rating:</strong> Average user rating (1-5 stars)</div>
                <div><strong>Review Count:</strong> Number of user reviews</div>
                <div><strong>Price:</strong> Free, Freemium, or Paid</div>
                <div><strong>Tags:</strong> Relevant keywords and features</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tool Details Page</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Click on any tool card to view detailed information including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Comprehensive description and features</li>
              <li>Pricing information and plans</li>
              <li>User reviews and ratings</li>
              <li>Official website link</li>
              <li>Related tools and alternatives</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'submitting-tools',
      title: 'Submitting Tools',
      icon: DocumentTextIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Submit Your AI Tool</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Share your AI tool with our community by submitting it to our directory. Follow these steps to ensure your submission is approved quickly.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Submission Requirements</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Tool Name:</strong> Clear, descriptive name for your AI tool</li>
              <li><strong>Description:</strong> Detailed explanation of what your tool does and its key features</li>
              <li><strong>Category:</strong> Select the most appropriate category for your tool</li>
              <li><strong>Website URL:</strong> Direct link to your tool's official website</li>
              <li><strong>Pricing Information:</strong> Clear pricing structure (Free, Freemium, or Paid)</li>
              <li><strong>Tags:</strong> Relevant keywords to help users find your tool</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Submission Process</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Fill Out the Form</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Complete all required fields with accurate information</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Review Process</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Our team will review your submission within 24-48 hours</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Approval & Publication</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Once approved, your tool will be live on our platform</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tips for Successful Submission</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Provide clear, accurate descriptions</li>
              <li>Use relevant tags to improve discoverability</li>
              <li>Ensure your website is functional and accessible</li>
              <li>Include comprehensive feature lists</li>
              <li>Be transparent about pricing and limitations</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Ready to Submit?</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  <Link href="/submit-tool" className="underline hover:no-underline">
                    Click here to submit your AI tool
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'writing-reviews',
      title: 'Writing Reviews',
      icon: StarIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Write Helpful Reviews</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Share your experience with AI tools to help other users make informed decisions. Your reviews are valuable to our community.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Review Guidelines</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Be Honest:</strong> Share your genuine experience, both positive and negative</li>
              <li><strong>Be Specific:</strong> Include details about features, performance, and use cases</li>
              <li><strong>Be Constructive:</strong> Provide helpful feedback that can benefit other users</li>
              <li><strong>Be Respectful:</strong> Avoid personal attacks or inappropriate language</li>
              <li><strong>Be Recent:</strong> Review tools you've used recently for accurate feedback</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">What to Include in Your Review</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Rating (1-5 stars)</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Overall experience</li>
                  <li>• Ease of use</li>
                  <li>• Feature quality</li>
                  <li>• Value for money</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Written Review</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Your use case</li>
                  <li>• Pros and cons</li>
                  <li>• Performance insights</li>
                  <li>• Recommendations</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">How to Submit a Review</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Navigate to Tool Page</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Go to the tool you want to review</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Click "Write Review"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Find the review section and click the review button</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Submit Your Review</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Rate the tool and write your detailed review</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <StarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-900 dark:text-green-100">Review Guidelines</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Remember to be honest, specific, and constructive in your reviews to help the community make better decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: UserIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Managing Your Account</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Create and manage your VaultX AI Tools account to unlock additional features and personalize your experience.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Account Benefits</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Save Favorites:</strong> Bookmark tools you're interested in</li>
              <li><strong>Write Reviews:</strong> Share your experiences with AI tools</li>
              <li><strong>Submit Tools:</strong> Add your own AI tools to the directory</li>
              <li><strong>Personalized Recommendations:</strong> Get tool suggestions based on your interests</li>
              <li><strong>Review History:</strong> Track your past reviews and ratings</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Creating an Account</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Click "Sign Up"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Located in the top navigation bar</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Choose Sign-up Method</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Email/password or OAuth providers (Google, GitHub)</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Complete Profile</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Add your name and preferences</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Account Settings</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Profile Information:</strong> Update your name, email, and bio</div>
                <div><strong>Preferences:</strong> Set your preferred categories and interests</div>
                <div><strong>Privacy Settings:</strong> Control who can see your reviews and activity</div>
                <div><strong>Notification Settings:</strong> Manage email and in-app notifications</div>
                <div><strong>Password Management:</strong> Change your password or enable 2FA</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Security Best Practices</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication if available</li>
              <li>Keep your email address up to date</li>
              <li>Log out from shared devices</li>
              <li>Report suspicious activity immediately</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'admin-features',
      title: 'Admin Features',
      icon: CogIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Administrator Guide</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Learn about the administrative features available to help manage the VaultX AI Tools platform.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Admin Dashboard</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Access the admin dashboard to manage various aspects of the platform:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>User Management:</strong> View, edit, and manage user accounts</li>
              <li><strong>Tool Management:</strong> Approve, edit, or remove submitted tools</li>
              <li><strong>Category Management:</strong> Create and manage tool categories</li>
              <li><strong>Review Management:</strong> Moderate user reviews and ratings</li>
              <li><strong>Blog Management:</strong> Create and manage blog content</li>
              <li><strong>Contact Management:</strong> View and respond to user inquiries</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tool Approval Process</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Review Submission</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Check tool information for accuracy and completeness</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Verify Tool</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Test the tool's website and functionality</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Approve or Reject</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Make decision and notify submitter if needed</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Content Moderation</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Review Moderation:</strong> Monitor and moderate user reviews for inappropriate content</li>
              <li><strong>Spam Prevention:</strong> Identify and remove spam submissions</li>
              <li><strong>Quality Control:</strong> Ensure all content meets platform standards</li>
              <li><strong>User Reports:</strong> Handle reports of inappropriate content or behavior</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Analytics and Insights</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Platform Usage:</strong> Track user engagement and tool views</div>
                <div><strong>Popular Tools:</strong> Identify trending and popular AI tools</div>
                <div><strong>User Behavior:</strong> Analyze search patterns and user preferences</div>
                <div><strong>Submission Trends:</strong> Monitor tool submission rates and quality</div>
                <div><strong>Review Analytics:</strong> Track review activity and sentiment</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CogIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100">Admin Access</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Admin features are only available to users with administrator privileges. Contact support if you need admin access.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact-support',
      title: 'Contact & Support',
      icon: ChatBubbleLeftRightIcon,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Help and Support</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need help with VaultX AI Tools? We're here to assist you with any questions or issues you may have.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Contact Methods</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Contact Form</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Use our contact form for general inquiries, bug reports, or feature requests.
                </p>
                <Link href="/contact" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contact Us
                </Link>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Email Support</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Send us an email for technical support or urgent issues.
                </p>
                <a href="mailto:support@vaultxaitools.com" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Email Support
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Common Issues & Solutions</h4>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Tool Submission Not Approved</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  If your tool submission wasn't approved, check that:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>All required fields are completed</li>
                  <li>The tool website is functional and accessible</li>
                  <li>The description is clear and accurate</li>
                  <li>The tool fits within our AI tools category</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Account Access Issues</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Having trouble accessing your account?
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Try resetting your password</li>
                  <li>Check your email for verification links</li>
                  <li>Clear browser cache and cookies</li>
                  <li>Contact support if issues persist</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Review Not Appearing</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  If your review isn't showing up:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Ensure you're logged into your account</li>
                  <li>Check that the review was submitted successfully</li>
                  <li>Reviews may take a few minutes to appear</li>
                  <li>Contact support if the issue continues</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Response Times</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <div><strong>General Inquiries:</strong> 24-48 hours</div>
                <div><strong>Technical Support:</strong> 12-24 hours</div>
                <div><strong>Bug Reports:</strong> 24-72 hours</div>
                <div><strong>Feature Requests:</strong> 1-2 weeks</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Before Contacting Support</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Check this documentation for answers to common questions</li>
              <li>Search the platform for similar issues or questions</li>
              <li>Try refreshing the page or clearing your browser cache</li>
              <li>Provide specific details about your issue when contacting support</li>
              <li>Include screenshots or error messages if applicable</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Documentation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Learn how to use VaultX AI Tools platform effectively. From browsing tools to submitting your own, we've got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      activeSection === section.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <section.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              {sections.find(section => section.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 