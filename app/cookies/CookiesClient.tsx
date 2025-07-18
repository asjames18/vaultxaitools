'use client';

import { useState } from 'react';

// Simple SVG icons to avoid import issues
const CookieIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function CookiesClient() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: CookieIcon },
    { id: 'types', title: 'Types of Cookies', icon: EyeIcon },
    { id: 'usage', title: 'How We Use Cookies', icon: CogIcon },
    { id: 'third-party', title: 'Third-Party Cookies', icon: ShieldCheckIcon },
    { id: 'management', title: 'Cookie Management', icon: TrashIcon },
    { id: 'updates', title: 'Policy Updates', icon: CheckCircleIcon },
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <CookieIcon className="h-16 w-16 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              How we use cookies and similar technologies to enhance your experience
            </p>
            <div className="mt-8 text-sm text-blue-200">
              Last updated: {formatDate('2024-01-15')}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Questions?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  If you have any questions about our Cookie Policy, please contact us.
                </p>
                <a 
                  href="/contact" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Overview
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      This Cookie Policy explains how VaultX AI Tools ("we," "us," or "our") uses cookies and similar technologies when you visit our website. This policy should be read alongside our Privacy Policy, which explains how we use your personal information.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What Are Cookies?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and more useful.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Why We Use Cookies
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>To provide you with a better user experience</li>
                      <li>To remember your preferences and settings</li>
                      <li>To analyze how our website is used</li>
                      <li>To provide personalized content and recommendations</li>
                      <li>To ensure the security of our website</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Consent
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      By using our website, you consent to our use of cookies in accordance with this Cookie Policy. You can manage your cookie preferences at any time through your browser settings or our cookie consent manager.
                    </p>
                  </div>
                </div>
              )}

              {/* Types of Cookies Section */}
              {activeSection === 'types' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Types of Cookies We Use
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Essential Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions. The website cannot function properly without these cookies.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Authentication cookies to keep you logged in</li>
                      <li>Security cookies to protect against fraud</li>
                      <li>Session cookies to maintain your session</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Functional Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Language preference cookies</li>
                      <li>Theme preference cookies (light/dark mode)</li>
                      <li>Search history cookies</li>
                      <li>User interface customization cookies</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Page view tracking cookies</li>
                      <li>User behavior analysis cookies</li>
                      <li>Performance monitoring cookies</li>
                      <li>Error tracking cookies</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Advertising preference cookies</li>
                      <li>Retargeting cookies</li>
                      <li>Social media integration cookies</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* How We Use Cookies Section */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    How We Use Cookies
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Website Functionality
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We use essential cookies to ensure our website works properly and securely. These cookies enable core functionality such as user authentication, session management, and security features.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      User Experience Enhancement
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Functional cookies help us provide a better user experience by remembering your preferences, such as your language choice, theme preference, and other settings.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Analytics and Performance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Analytics cookies help us understand how our website is used, which pages are most popular, and how users navigate through our site. This information helps us improve our website and services.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Personalization
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We use cookies to provide personalized content and recommendations based on your browsing history and preferences.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Security
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Security cookies help protect our website and users from fraud, abuse, and other security threats.
                    </p>
                  </div>
                </div>
              )}

              {/* Third-Party Cookies Section */}
              {activeSection === 'third-party' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Third-Party Cookies
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What Are Third-Party Cookies?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Third-party cookies are cookies that are set by a website other than the one you are visiting. These cookies are often used for advertising and analytics purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Services We Use
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
                      <li><strong>Google Ads:</strong> To provide relevant advertising</li>
                      <li><strong>Social Media Platforms:</strong> To enable social media integration and sharing</li>
                      <li><strong>Payment Processors:</strong> To process payments securely</li>
                      <li><strong>Content Delivery Networks:</strong> To improve website performance</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Managing Third-Party Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You can control third-party cookies through your browser settings. However, disabling these cookies may affect the functionality of our website and the services we provide.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Privacy Policies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Third-party services have their own privacy policies and cookie practices. We encourage you to review their policies to understand how they use your information.
                    </p>
                  </div>
                </div>
              )}

              {/* Cookie Management Section */}
              {activeSection === 'management' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Managing Your Cookie Preferences
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Browser Settings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>View and delete existing cookies</li>
                      <li>Block cookies from being set</li>
                      <li>Set preferences for different types of cookies</li>
                      <li>Clear cookies when you close your browser</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Cookie Consent Manager
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We provide a cookie consent manager that allows you to control which types of cookies we can set on your device. You can access this through the cookie banner or settings page.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Opting Out
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You can opt out of certain types of cookies, such as analytics and marketing cookies. However, please note that opting out may affect the functionality of our website.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Mobile Devices
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you access our website on a mobile device, you may need to adjust your device settings to manage cookies. The process varies depending on your device and operating system.
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                        Important Note
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                        Disabling essential cookies may prevent our website from functioning properly. We recommend keeping essential cookies enabled for the best user experience.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Updates Section */}
              {activeSection === 'updates' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Policy Updates
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Changes to This Policy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Notification of Changes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      When we make significant changes to this policy, we will:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Update the "Last updated" date at the top of this policy</li>
                      <li>Post a notice on our website</li>
                      <li>Send an email notification to registered users (if applicable)</li>
                      <li>Display a cookie banner to inform users of changes</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Continued Use
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Your continued use of our website after any changes to this Cookie Policy constitutes acceptance of those changes. If you do not agree to the changes, you should stop using our website and delete any cookies we have set.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Us
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you have any questions about this Cookie Policy or our use of cookies, please contact us using the information provided below.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Contact Information
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        For questions about our Cookie Policy:
                      </p>
                      <a 
                        href="/contact" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 