'use client';

import { useState } from 'react';

// Simple SVG icons to avoid import issues
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

export default function GdprClient() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: ShieldCheckIcon },
    { id: 'rights', title: 'Your Rights', icon: UserIcon },
    { id: 'data-collection', title: 'Data Collection', icon: DocumentIcon },
    { id: 'data-processing', title: 'Data Processing', icon: EyeIcon },
    { id: 'data-retention', title: 'Data Retention', icon: TrashIcon },
    { id: 'compliance', title: 'Compliance', icon: CheckCircleIcon },
    { id: 'breaches', title: 'Data Breaches', icon: ExclamationTriangleIcon },
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
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <ShieldCheckIcon className="h-16 w-16 text-green-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              GDPR Compliance
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
              Your data protection rights under the General Data Protection Regulation
            </p>
            <div className="mt-8 text-sm text-green-200">
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
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Contact Information */}
              <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                  Questions?
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                  If you have any questions about our GDPR compliance, please contact us.
                </p>
                <a 
                  href="/contact" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
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
                    GDPR Overview
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It applies to all organizations operating within the EU and those that offer goods or services to individuals in the EU, regardless of where the organization is based.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What is GDPR?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      GDPR is designed to give individuals greater control over their personal data and to simplify the regulatory environment for international business by unifying data protection regulations within the EU.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Commitment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      At VaultX Tech, we are committed to protecting your privacy and ensuring compliance with GDPR. We have implemented appropriate technical and organizational measures to ensure a level of security appropriate to the risk.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Key Principles
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Lawfulness, fairness, and transparency:</strong> We process personal data lawfully, fairly, and transparently</li>
                      <li><strong>Purpose limitation:</strong> We collect personal data for specified, explicit, and legitimate purposes</li>
                      <li><strong>Data minimization:</strong> We only collect personal data that is adequate, relevant, and limited to what is necessary</li>
                      <li><strong>Accuracy:</strong> We keep personal data accurate and up to date</li>
                      <li><strong>Storage limitation:</strong> We retain personal data only for as long as necessary</li>
                      <li><strong>Integrity and confidentiality:</strong> We process personal data securely</li>
                      <li><strong>Accountability:</strong> We are responsible for demonstrating compliance with these principles</li>
                    </ul>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        Data Protection Officer
                      </h4>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        We have appointed a Data Protection Officer (DPO) to oversee our GDPR compliance. You can contact our DPO directly for any data protection concerns.
                      </p>
                      <a 
                        href="/contact" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Contact DPO
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Your Rights Section */}
              {activeSection === 'rights' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Your GDPR Rights
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Under GDPR, you have several rights regarding your personal data. We are committed to helping you exercise these rights.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Information
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to be informed about the collection and use of your personal data. This includes information about:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Who we are and how to contact us</li>
                      <li>What personal data we collect and why</li>
                      <li>How long we keep your data</li>
                      <li>Your rights and how to exercise them</li>
                      <li>How to lodge a complaint</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right of Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to access your personal data and receive a copy of the data we hold about you. This includes information about:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>What personal data we process</li>
                      <li>Why we process it</li>
                      <li>Who we share it with</li>
                      <li>How long we keep it</li>
                      <li>Your rights to rectification, erasure, and restriction</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Rectification
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to have inaccurate personal data corrected and incomplete data completed.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Erasure (Right to be Forgotten)
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to have your personal data erased in certain circumstances, such as when:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>The data is no longer necessary for the purpose it was collected</li>
                      <li>You withdraw consent and there is no other legal basis</li>
                      <li>You object to processing and there are no overriding legitimate grounds</li>
                      <li>The data has been unlawfully processed</li>
                      <li>The data must be erased to comply with a legal obligation</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Restrict Processing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to restrict the processing of your personal data in certain circumstances, such as when you contest the accuracy of the data or object to processing.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Data Portability
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit that data to another controller.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Right to Object
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right to object to the processing of your personal data in certain circumstances, particularly for direct marketing purposes.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Rights Related to Automated Decision Making
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning you or similarly significantly affects you.
                    </p>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                        Exercising Your Rights
                      </h4>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        To exercise any of these rights, please contact us using the information provided below. We will respond to your request within one month.
                      </p>
                      <a 
                        href="/contact" 
                        className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Exercise Your Rights
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Collection Section */}
              {activeSection === 'data-collection' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Collection
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What Personal Data We Collect
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We collect personal data that you provide directly to us, as well as data that is automatically collected when you use our services.
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Data You Provide
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Account Information:</strong> Email address, username, password</li>
                      <li><strong>Profile Information:</strong> Name, bio, profile picture</li>
                      <li><strong>Content:</strong> Reviews, comments, tool submissions</li>
                      <li><strong>Communication:</strong> Messages sent through contact forms</li>
                      <li><strong>Preferences:</strong> Settings, language preferences, notification preferences</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Automatically Collected Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                      <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                      <li><strong>Cookies:</strong> Session data, preferences, analytics data</li>
                      <li><strong>Log Data:</strong> Server logs, error logs, performance data</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Legal Basis for Processing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We process your personal data based on the following legal grounds:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Consent:</strong> When you explicitly agree to the processing</li>
                      <li><strong>Contract:</strong> When processing is necessary to fulfill our contract with you</li>
                      <li><strong>Legitimate Interest:</strong> When processing is necessary for our legitimate interests</li>
                      <li><strong>Legal Obligation:</strong> When processing is required by law</li>
                      <li><strong>Vital Interest:</strong> When processing is necessary to protect someone's life</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Data Sources
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may also receive personal data from third parties, such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Social media platforms when you sign up using social login</li>
                      <li>Analytics providers and advertising partners</li>
                      <li>Public databases and directories</li>
                      <li>Business partners and affiliates</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Processing Section */}
              {activeSection === 'data-processing' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Processing
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      How We Process Your Data
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We process your personal data for various purposes, always ensuring that we have a legal basis for doing so.
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Service Provision
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Providing and maintaining our media production tools and resources directory</li>
                      <li>Processing tool submissions and reviews</li>
                      <li>Managing user accounts and profiles</li>
                      <li>Facilitating user interactions and communications</li>
                      <li>Providing customer support and assistance</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Communication
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Sending service-related notifications</li>
                      <li>Responding to your inquiries and requests</li>
                      <li>Sending newsletters and marketing communications (with consent)</li>
                      <li>Providing updates about our services</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Analytics and Improvement
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Analyzing usage patterns and trends</li>
                      <li>Improving our services and user experience</li>
                      <li>Conducting research and development</li>
                      <li>Identifying and fixing technical issues</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Security and Compliance
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Protecting against fraud and abuse</li>
                      <li>Ensuring compliance with legal obligations</li>
                      <li>Investigating and preventing security incidents</li>
                      <li>Maintaining the integrity of our services</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Data Sharing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may share your personal data with:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Service Providers:</strong> Cloud hosting, analytics, payment processing</li>
                      <li><strong>Business Partners:</strong> When necessary to provide our services</li>
                      <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                      <li><strong>Other Users:</strong> Public information you choose to share</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      International Transfers
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA). When we do this, we ensure appropriate safeguards are in place, such as:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Adequacy decisions by the European Commission</li>
                      <li>Standard contractual clauses</li>
                      <li>Binding corporate rules</li>
                      <li>Other appropriate safeguards</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Data Retention Section */}
              {activeSection === 'data-retention' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Retention
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      How Long We Keep Your Data
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Account Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Active Accounts:</strong> Retained while your account is active</li>
                      <li><strong>Inactive Accounts:</strong> Deleted after 2 years of inactivity</li>
                      <li><strong>Deleted Accounts:</strong> Permanently deleted within 30 days</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Content Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Reviews and Comments:</strong> Retained for 5 years after posting</li>
                      <li><strong>Tool Submissions:</strong> Retained for 7 years after submission</li>
                      <li><strong>User-Generated Content:</strong> Deleted when account is deleted</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Communication Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Support Tickets:</strong> Retained for 3 years after resolution</li>
                      <li><strong>Contact Form Submissions:</strong> Retained for 2 years</li>
                      <li><strong>Email Communications:</strong> Retained for 2 years</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Technical Data
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Log Files:</strong> Retained for 1 year</li>
                      <li><strong>Analytics Data:</strong> Retained for 2 years</li>
                      <li><strong>Cookies:</strong> Varies by type (see Cookie Policy)</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Data Deletion
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      When we delete your personal data, we ensure that it is permanently and securely removed from our systems. This includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Permanent deletion from our databases</li>
                      <li>Removal from backup systems</li>
                      <li>Deletion from third-party services</li>
                      <li>Secure destruction of physical records</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Exceptions to Retention Periods
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We may retain your personal data for longer periods in certain circumstances:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>When required by law or regulation</li>
                      <li>To resolve disputes or enforce agreements</li>
                      <li>To protect against fraud or abuse</li>
                      <li>For legitimate business purposes</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Compliance Section */}
              {activeSection === 'compliance' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    GDPR Compliance
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Compliance Measures
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We have implemented comprehensive measures to ensure GDPR compliance across all aspects of our operations.
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Organizational Measures
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Appointment of a Data Protection Officer</li>
                      <li>Regular staff training on data protection</li>
                      <li>Clear data protection policies and procedures</li>
                      <li>Regular audits and compliance reviews</li>
                      <li>Documentation of all data processing activities</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Technical Measures
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Encryption of personal data in transit and at rest</li>
                      <li>Access controls and authentication systems</li>
                      <li>Regular security assessments and penetration testing</li>
                      <li>Backup and disaster recovery procedures</li>
                      <li>Monitoring and logging of data access</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Privacy by Design
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We implement privacy by design principles in all our systems and processes:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Data minimization in all systems</li>
                      <li>Default privacy settings</li>
                      <li>User-friendly privacy controls</li>
                      <li>Transparent data processing</li>
                      <li>Regular privacy impact assessments</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Third-Party Compliance
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We ensure that all third-party service providers we work with are also GDPR compliant:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Data processing agreements with all providers</li>
                      <li>Regular audits of third-party compliance</li>
                      <li>Clear contractual obligations for data protection</li>
                      <li>Monitoring of third-party data handling practices</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Regular Reviews and Updates
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We regularly review and update our GDPR compliance measures:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Annual compliance audits</li>
                      <li>Regular policy reviews and updates</li>
                      <li>Staff training refreshers</li>
                      <li>Technology and process improvements</li>
                      <li>Response to regulatory guidance and changes</li>
                    </ul>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                        Compliance Certification
                      </h4>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        We are committed to maintaining the highest standards of data protection and regularly review our compliance with GDPR requirements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Breaches Section */}
              {activeSection === 'breaches' && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Data Breach Response
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What is a Data Breach?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      A data breach is a security incident that results in the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Breach Response Plan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      We have a comprehensive data breach response plan that includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Detection and Assessment:</strong> Immediate identification and evaluation of breaches</li>
                      <li><strong>Containment:</strong> Rapid response to limit the impact</li>
                      <li><strong>Investigation:</strong> Thorough analysis of the cause and scope</li>
                      <li><strong>Notification:</strong> Timely communication to affected individuals and authorities</li>
                      <li><strong>Recovery:</strong> Restoration of systems and data</li>
                      <li><strong>Review:</strong> Post-incident analysis and improvement</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Notification Requirements
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Under GDPR, we are required to notify relevant authorities and affected individuals of data breaches within specific timeframes:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li><strong>Supervisory Authority:</strong> Within 72 hours of becoming aware of the breach</li>
                      <li><strong>Affected Individuals:</strong> Without undue delay when the breach poses a high risk to their rights and freedoms</li>
                      <li><strong>Data Processors:</strong> Immediately upon becoming aware of a breach</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What We Will Do
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      In the event of a data breach, we will:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Immediately assess the nature and scope of the breach</li>
                      <li>Take steps to contain and mitigate the impact</li>
                      <li>Notify the relevant supervisory authority within 72 hours</li>
                      <li>Inform affected individuals without undue delay</li>
                      <li>Provide clear information about the breach and its potential impact</li>
                      <li>Offer guidance on protective measures individuals can take</li>
                      <li>Implement measures to prevent similar breaches in the future</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What You Should Do
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you believe your personal data has been compromised:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Contact us immediately using the information below</li>
                      <li>Monitor your accounts for suspicious activity</li>
                      <li>Change passwords for affected accounts</li>
                      <li>Consider placing fraud alerts on your credit reports</li>
                      <li>Report any suspicious activity to relevant authorities</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Reporting a Breach
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      If you suspect a data breach or have security concerns:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6 space-y-2">
                      <li>Email our Data Protection Officer immediately</li>
                      <li>Include as much detail as possible about the incident</li>
                      <li>Provide any evidence or documentation you have</li>
                      <li>We will respond within 24 hours to acknowledge your report</li>
                    </ul>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mt-8">
                      <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                        Emergency Contact
                      </h4>
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        For urgent data breach reports or security incidents, please contact our Data Protection Officer immediately.
                      </p>
                      <a 
                        href="/contact" 
                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Report Security Incident
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