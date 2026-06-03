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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                <CookieIcon className="h-16 w-16 text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              How we use cookies and similar technologies to enhance your experience
            </p>
            <div className="mt-8 text-sm text-green-400 font-medium">
              Last updated: June 2026
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
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-gray-800 border border-green-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Questions?
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  If you have any questions about our Cookie Policy, please contact us.
                </p>
                <p className="text-sm mb-4">
                  <a href="mailto:contact@melanatedintech.com" className="text-green-400 hover:text-green-300 underline break-all">
                    contact@melanatedintech.com
                  </a>
                </p>
                <a
                  href="/contact"
                  className="block w-full bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Overview
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-300 mb-6">
                      This Cookie Policy explains how Melanated In Tech ("we," "us," or "our") uses cookies and similar technologies when you visit our website. This policy should be read alongside our Privacy Policy, which explains how we use your personal information.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      What Are Cookies?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and more useful.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Why We Use Cookies
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li>To provide you with a better user experience</li>
                      <li>To remember your preferences and settings</li>
                      <li>To analyze how our website is used</li>
                      <li>To provide personalized content and recommendations</li>
                      <li>To ensure the security of our website</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Your Consent
                    </h3>
                    <p className="text-gray-300 mb-6">
                      By using our website, you consent to our use of cookies in accordance with this Cookie Policy. You can manage your cookie preferences at any time through your browser settings or our cookie consent manager.
                    </p>
                  </div>
                </div>
              )}

              {/* Types of Cookies Section */}
              {activeSection === 'types' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Types of Cookies We Use
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Essential Cookies
                    </h3>
                    <p className="text-gray-300 mb-4">
                      These cookies are necessary for the website to function properly. They cannot be disabled. The website cannot function without them.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li><strong className="text-green-400">Authentication cookies:</strong> Keep you signed in securely across pages</li>
                      <li><strong className="text-green-400">Session cookies:</strong> Maintain your session state while browsing</li>
                      <li><strong className="text-green-400">Security cookies:</strong> Protect against CSRF attacks and other threats</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-300 mb-4">
                      These cookies help us understand how visitors use our platform by collecting anonymized usage data. This helps us improve content and features.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li><strong className="text-green-400">Page view tracking:</strong> Which pages are visited and how often</li>
                      <li><strong className="text-green-400">Usage patterns:</strong> How users navigate through the platform</li>
                      <li><strong className="text-green-400">Performance monitoring:</strong> Page load times and error rates</li>
                      <li><strong className="text-green-400">Feature usage:</strong> Which tools and features are most used</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Preference Cookies
                    </h3>
                    <p className="text-gray-300 mb-4">
                      These cookies remember your choices and personalize your experience on our platform.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li><strong className="text-green-400">Theme preference:</strong> Your selected color scheme or display mode</li>
                      <li><strong className="text-green-400">Language preference:</strong> Your chosen display language</li>
                      <li><strong className="text-green-400">Filter settings:</strong> Your saved search filters and category preferences</li>
                      <li><strong className="text-green-400">Notification preferences:</strong> How you prefer to receive alerts</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-300 mb-6">
                      These cookies are used to deliver relevant content and may track your activity across websites. They are only set with your explicit consent.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
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
                  <h2 className="text-3xl font-bold text-white mb-6">
                    How We Use Cookies
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Keeping You Signed In
                    </h3>
                    <p className="text-gray-300 mb-6">
                      We use authentication and session cookies to keep you logged in as you move between pages on Melanated In Tech. Without these, you would be logged out every time you navigate to a new page. These cookies are essential and cannot be disabled.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Remembering Your Preferences
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Preference cookies let us remember your choices so you get a consistent experience each time you visit. This includes your display theme, saved filters, notification settings, and language preferences — so you never have to reconfigure them on each visit.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Understanding Usage
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Analytics cookies help us understand how our community uses the platform. We look at which AI tool categories are most popular, how users discover new tools, and where people spend the most time. This data is anonymized and used solely to improve the platform for everyone.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Website Security
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Security cookies protect our platform and users from fraud, abuse, and other threats. They help us detect suspicious activity and ensure that form submissions and account actions come from legitimate users.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Personalized Content
                    </h3>
                    <p className="text-gray-300 mb-6">
                      We use cookies to provide personalized tool recommendations and content based on your activity on the platform. This helps surface the most relevant AI tools and resources for your specific interests.
                    </p>
                  </div>
                </div>
              )}

              {/* Third-Party Cookies Section */}
              {activeSection === 'third-party' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Third-Party Cookies
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      What Are Third-Party Cookies?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Third-party cookies are set by services other than Melanated In Tech that we use to power parts of our platform. These providers have their own privacy policies governing how they use data.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Services We Use
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="text-lg font-semibold text-green-400 mb-2">Supabase</h4>
                        <p className="text-gray-300 text-sm">
                          We use Supabase for authentication and database services. Supabase sets cookies to manage your login session and keep your account secure. These are essential cookies required for the platform to function.
                        </p>
                      </div>

                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="text-lg font-semibold text-green-400 mb-2">Vercel</h4>
                        <p className="text-gray-300 text-sm">
                          Melanated In Tech is hosted on Vercel. Vercel may set cookies for edge network routing and analytics to ensure fast, reliable page delivery across all regions. Vercel Analytics helps us understand aggregate traffic patterns.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Managing Third-Party Cookies
                    </h3>
                    <p className="text-gray-300 mb-6">
                      You can control third-party cookies through your browser settings. However, disabling essential third-party cookies (such as Supabase authentication) will prevent you from logging in or using account features.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Third-Party Privacy Policies
                    </h3>
                    <p className="text-gray-300 mb-6">
                      We encourage you to review the privacy policies of these services directly to understand how they handle your data:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li>Supabase Privacy Policy: supabase.com/privacy</li>
                      <li>Vercel Privacy Policy: vercel.com/legal/privacy-policy</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Cookie Management Section */}
              {activeSection === 'management' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Managing Your Cookie Preferences
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Browser Settings
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Most web browsers allow you to control cookies through their settings. Here is how to manage cookies in the most common browsers:
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="text-base font-semibold text-green-400 mb-2">Google Chrome</h4>
                        <p className="text-gray-300 text-sm">
                          Go to <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Privacy and security</strong> &rarr; <strong className="text-white">Cookies and other site data</strong>. Here you can block third-party cookies, clear all cookies, or manage exceptions for specific sites.
                        </p>
                      </div>

                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="text-base font-semibold text-green-400 mb-2">Mozilla Firefox</h4>
                        <p className="text-gray-300 text-sm">
                          Go to <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Privacy &amp; Security</strong>. Under "Enhanced Tracking Protection," choose your level of cookie blocking. You can also manage individual site exceptions here.
                        </p>
                      </div>

                      <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="text-base font-semibold text-green-400 mb-2">Safari</h4>
                        <p className="text-gray-300 text-sm">
                          Go to <strong className="text-white">Preferences</strong> &rarr; <strong className="text-white">Privacy</strong>. You can block all cookies or prevent cross-site tracking. On iOS, go to <strong className="text-white">Settings</strong> &rarr; <strong className="text-white">Safari</strong> &rarr; <strong className="text-white">Privacy &amp; Security</strong>.
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      What You Can Control
                    </h3>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li>View and delete existing cookies stored by our site</li>
                      <li>Block non-essential cookies (analytics, marketing)</li>
                      <li>Set preferences for different cookie categories</li>
                      <li>Clear all cookies when you close your browser</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Opting Out of Analytics
                    </h3>
                    <p className="text-gray-300 mb-6">
                      You can opt out of analytics cookies without affecting core platform functionality. Authentication and security cookies are required for the platform to work correctly and cannot be disabled.
                    </p>

                    <div className="bg-gray-900 border border-yellow-500/30 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-yellow-400 mb-3">
                        Important Note
                      </h4>
                      <p className="text-gray-300">
                        Disabling essential cookies (such as authentication cookies) will prevent you from logging into your account or using personalized features. We recommend keeping essential cookies enabled for the full Melanated In Tech experience.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Policy Updates Section */}
              {activeSection === 'updates' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Policy Updates
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Changes to This Policy
                    </h3>
                    <p className="text-gray-300 mb-6">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      How We Notify You
                    </h3>
                    <p className="text-gray-300 mb-4">
                      When we make significant changes to this policy, we will:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      <li>Update the "Last updated" date at the top of this policy</li>
                      <li>Post a notice on our website for a reasonable period</li>
                      <li>Send an email notification to registered users for significant changes</li>
                      <li>Display a cookie banner to inform returning users of changes</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Your Continued Use
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Your continued use of our website after any changes to this Cookie Policy constitutes acceptance of those changes. If you do not agree to the changes, you should stop using our website and clear any cookies we have set.
                    </p>

                    <h3 className="text-xl font-semibold text-white mb-4">
                      Contact Us
                    </h3>
                    <p className="text-gray-300 mb-6">
                      If you have any questions about this Cookie Policy or our use of cookies, please reach out to us directly.
                    </p>

                    <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-green-400 mb-3">
                        Contact Information
                      </h4>
                      <p className="text-gray-300 mb-2">
                        Melanated In Tech — Cookie Policy inquiries:
                      </p>
                      <p className="text-gray-300 mb-4">
                        <span className="text-green-400 font-medium">Email:</span>{' '}
                        <a href="mailto:contact@melanatedintech.com" className="text-green-400 hover:text-green-300 underline">
                          contact@melanatedintech.com
                        </a>
                      </p>
                      <a
                        href="/contact"
                        className="inline-block bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
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
