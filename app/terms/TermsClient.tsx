'use client';

import { useState } from 'react';

// Simple SVG icons to avoid import issues
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

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ScaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: DocumentTextIcon },
    { id: 'acceptance', title: 'Acceptance', icon: UserIcon },
    { id: 'services', title: 'Services', icon: CogIcon },
    { id: 'user-conduct', title: 'User Conduct', icon: ShieldCheckIcon },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: ScaleIcon },
    { id: 'liability', title: 'Liability & Disclaimers', icon: ExclamationTriangleIcon },
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
              <DocumentTextIcon className="h-16 w-16 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Terms and conditions for using VaultX Tech platform
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
                  If you have any questions about these Terms of Service, please contact us.
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
                      These Terms of Service ("Terms") govern your use of VaultX Tech ("Service," "we," "us," or "our"), a platform for discovering and reviewing media production tools and resources for churches and ministries. By accessing or using our Service, you agree to be bound by these Terms.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Agreement to Terms
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      By accessing or using VaultX Tech, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Changes to Terms
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Contact Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you have any questions about these Terms, please contact us through our contact form or at the email address provided on our website.
                    </p>
                  </div>
                </div>
              )}

              {/* Acceptance Section */}
              {activeSection === 'acceptance' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Acceptance of Terms
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Eligibility
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You must be at least 13 years old to use this Service. If you are under 18, you must have your parent or guardian's permission to use the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Account Registration
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>You may be required to create an account to access certain features</li>
                      <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                      <li>You are responsible for all activities that occur under your account</li>
                      <li>You must provide accurate and complete information when creating your account</li>
                      <li>You may not use another person's account without their permission</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Prohibited Uses
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You may not use the Service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any applicable local, state, national, or international law or regulation.
                    </p>
                  </div>
                </div>
              )}

              {/* Services Section */}
              {activeSection === 'services' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Description of Services
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Service Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      VaultX Tech provides a platform for discovering, reviewing, and comparing media production tools and resources for churches and ministries. Our services include:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Media tools directory and search functionality</li>
                      <li>User reviews and ratings</li>
                      <li>Tool comparisons and recommendations</li>
                      <li>Blog content and educational resources</li>
                      <li>Community features and discussions</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Service Availability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We strive to maintain the Service's availability but do not guarantee uninterrupted access. We may temporarily suspend or discontinue the Service for maintenance, updates, or other reasons.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Services
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Our Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party services.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Service Modifications
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
                    </p>
                  </div>
                </div>
              )}

              {/* User Conduct Section */}
              {activeSection === 'user-conduct' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    User Conduct and Responsibilities
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Acceptable Use
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                      <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                      <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                      <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                      <li>To introduce viruses, trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Content Standards
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      When submitting content (reviews, comments, etc.), you must ensure that your content:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Is accurate and truthful</li>
                      <li>Does not violate any applicable laws or regulations</li>
                      <li>Does not infringe on the rights of others</li>
                      <li>Is not defamatory, obscene, or offensive</li>
                      <li>Does not contain spam or promotional content</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Account Security
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You are responsible for maintaining the security of your account and password. We cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                    </p>
                  </div>
                </div>
              )}

              {/* Intellectual Property Section */}
              {activeSection === 'intellectual-property' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Intellectual Property Rights
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Intellectual Property
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      The Service and its original content, features, and functionality are and will remain the exclusive property of VaultX Tech and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      By submitting content to our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in connection with the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Our Service may contain content from third parties. We do not claim ownership of such content and respect the intellectual property rights of third parties.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Copyright Infringement
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact us with the following information:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>A description of the copyrighted work that you claim has been infringed</li>
                      <li>A description of where the material is located on our Service</li>
                      <li>Your contact information</li>
                      <li>A statement that you have a good faith belief that the use is not authorized</li>
                      <li>A statement that the information is accurate and that you are authorized to act on behalf of the copyright owner</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Liability Section */}
              {activeSection === 'liability' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Liability and Disclaimers
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Disclaimer of Warranties
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, AND HEREBY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Limitation of Liability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      IN NO EVENT SHALL VAULTX TECH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Indemnification
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You agree to defend, indemnify, and hold harmless VaultX Tech from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Governing Law
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      These Terms shall be interpreted and governed by the laws of the jurisdiction in which VaultX Tech operates, without regard to its conflict of law provisions.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Severability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Contact Information
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        For questions about these Terms of Service:
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