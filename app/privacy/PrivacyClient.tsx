'use client';

import { useState } from 'react';

// Simple SVG icons to avoid import issues
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const DocumentTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: ShieldCheckIcon },
    { id: 'collection', title: 'Data Collection', icon: EyeIcon },
    { id: 'usage', title: 'Data Usage', icon: CogIcon },
    { id: 'sharing', title: 'Data Sharing', icon: UserIcon },
    { id: 'security', title: 'Data Security', icon: LockClosedIcon },
    { id: 'rights', title: 'Your Rights', icon: DocumentTextIcon },
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
              <ShieldCheckIcon className="h-16 w-16 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              How we collect, use, and protect your personal information
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
                  If you have any questions about this Privacy Policy, please contact us.
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
                      At VaultX AI Tools, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Scope
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      This Privacy Policy applies to all users of VaultX AI Tools, including visitors to our website, registered users, and administrators. By using our services, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Information We Collect
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Personal information (name, email address)</li>
                      <li>Account credentials and authentication data</li>
                      <li>Usage data and analytics</li>
                      <li>Communication preferences</li>
                      <li>Technical information about your device and browser</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      How We Use Your Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Provide and maintain our services</li>
                      <li>Process your requests and transactions</li>
                      <li>Send you important updates and notifications</li>
                      <li>Improve our website and user experience</li>
                      <li>Ensure security and prevent fraud</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Collection Section */}
              {activeSection === 'collection' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Collection
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Information You Provide
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Account Information:</strong> When you create an account, we collect your email address and any additional information you choose to provide.</li>
                      <li><strong>Profile Information:</strong> You may choose to provide additional information such as your name, profile picture, or bio.</li>
                      <li><strong>Content:</strong> When you submit tools, write reviews, or post comments, we collect and store this content.</li>
                      <li><strong>Communications:</strong> When you contact us or participate in our support system, we collect your messages and contact information.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Automatically Collected Information
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Log Data:</strong> We automatically collect information about your use of our services, including IP address, browser type, pages visited, and time spent on pages.</li>
                      <li><strong>Device Information:</strong> We collect information about your device, including device type, operating system, and browser version.</li>
                      <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to enhance your experience and collect usage data.</li>
                      <li><strong>Analytics:</strong> We use third-party analytics services to understand how users interact with our website.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may receive information about you from third-party services, such as authentication providers (Google, GitHub) when you choose to sign in using these services.
                    </p>
                  </div>
                </div>
              )}

              {/* Data Usage Section */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Usage
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Primary Uses
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Service Provision:</strong> To provide, maintain, and improve our AI tools discovery platform.</li>
                      <li><strong>User Experience:</strong> To personalize your experience and provide relevant content and recommendations.</li>
                      <li><strong>Communication:</strong> To send you important updates, notifications, and respond to your inquiries.</li>
                      <li><strong>Security:</strong> To protect against fraud, abuse, and security threats.</li>
                      <li><strong>Analytics:</strong> To understand usage patterns and improve our services.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Legal Basis for Processing
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Consent:</strong> When you explicitly agree to the processing of your data.</li>
                      <li><strong>Contract:</strong> To fulfill our obligations under our terms of service.</li>
                      <li><strong>Legitimate Interest:</strong> To improve our services and ensure security.</li>
                      <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Data Retention
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. We may retain certain information for longer periods to comply with legal obligations, resolve disputes, and enforce our agreements.
                    </p>
                  </div>
                </div>
              )}

              {/* Data Sharing Section */}
              {activeSection === 'sharing' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Sharing
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      We Do Not Sell Your Data
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      VaultX AI Tools does not sell, rent, or trade your personal information to third parties for their marketing purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Service Providers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you. These providers are contractually obligated to protect your information and use it only for specified purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Legal Requirements
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Business Transfers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you of any such change in ownership or control of your personal information.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Public Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Information you choose to make public, such as reviews, comments, or profile information, may be visible to other users and the general public.
                    </p>
                  </div>
                </div>
              )}

              {/* Data Security Section */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Security
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Security Measures
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Encryption:</strong> We use industry-standard encryption to protect your data in transit and at rest.</li>
                      <li><strong>Access Controls:</strong> We implement strict access controls to ensure only authorized personnel can access your information.</li>
                      <li><strong>Regular Security Audits:</strong> We conduct regular security assessments and updates to protect against vulnerabilities.</li>
                      <li><strong>Secure Infrastructure:</strong> Our services are hosted on secure, reliable cloud infrastructure with multiple layers of protection.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Data Breach Response
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      In the unlikely event of a data breach, we will promptly investigate and take appropriate action to mitigate any potential harm. We will notify affected users and relevant authorities as required by law.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Role in Security
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Keep your account credentials secure and confidential</li>
                      <li>Use strong, unique passwords</li>
                      <li>Enable two-factor authentication when available</li>
                      <li>Log out of your account when using shared devices</li>
                      <li>Report any suspicious activity immediately</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Your Rights Section */}
              {activeSection === 'rights' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Rights
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Access and Portability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to access the personal information we hold about you and request a copy of your data in a portable format.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Correction and Updates
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You can update or correct your personal information through your account settings or by contacting us directly.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Deletion
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You may request the deletion of your personal information, subject to certain legal and contractual obligations.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Restriction and Objection
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to restrict or object to certain processing of your personal information.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Withdrawal of Consent
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Where we rely on your consent for processing, you may withdraw that consent at any time.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Exercising Your Rights
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      To exercise any of these rights, please contact us using the information provided below. We will respond to your request within a reasonable timeframe and may ask for additional information to verify your identity.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Contact Information
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        For privacy-related inquiries or to exercise your rights:
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