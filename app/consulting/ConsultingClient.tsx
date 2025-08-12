'use client';

import { useState } from 'react';
import Link from 'next/link';

// Icons
const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export default function ConsultingClient() {
  const [activeTab, setActiveTab] = useState('strategy');

  const services = [
    {
      id: 'strategy',
      title: 'AI Strategy & Roadmap',
      description: 'Develop comprehensive AI strategies aligned with your business objectives',
      icon: BrainIcon,
      features: [
        'AI readiness assessment',
        'Technology stack evaluation',
        'ROI analysis and business case development',
        'Implementation roadmap and timeline',
        'Risk assessment and mitigation strategies'
      ]
    },
    {
      id: 'implementation',
      title: 'AI Implementation & Integration',
      description: 'Expert guidance on implementing AI solutions into your existing infrastructure',
      icon: RocketIcon,
      features: [
        'AI tool selection and procurement',
        'System integration and API development',
        'Data pipeline optimization',
        'Performance monitoring and optimization',
        'Scalability planning and execution'
      ]
    },
    {
      id: 'analytics',
      title: 'AI Analytics & Insights',
      description: 'Transform your data into actionable insights with AI-powered analytics',
      icon: ChartIcon,
      features: [
        'Predictive analytics implementation',
        'Business intelligence dashboards',
        'Data visualization and reporting',
        'Performance metrics and KPIs',
        'Continuous improvement strategies'
      ]
    },
    {
      id: 'automation',
      title: 'AI Process Automation',
      description: 'Streamline operations and reduce costs with intelligent automation',
      icon: CogIcon,
      features: [
        'Workflow automation design',
        'RPA (Robotic Process Automation)',
        'Intelligent document processing',
        'Customer service automation',
        'Quality assurance and testing'
      ]
    }
  ];

  const expertise = [
    {
      title: 'Machine Learning & AI',
      description: 'Deep expertise in ML algorithms, neural networks, and AI model development',
      icon: BrainIcon
    },
    {
      title: 'Data Science & Analytics',
      description: 'Advanced analytics, predictive modeling, and data-driven decision making',
      icon: ChartIcon
    },
    {
      title: 'Business Transformation',
      description: 'Strategic guidance on leveraging AI for competitive advantage',
      icon: UsersIcon
    },
    {
      title: 'Technology Integration',
      description: 'Seamless integration of AI solutions with existing enterprise systems',
      icon: CogIcon
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Assessment',
      description: 'We analyze your current state, identify opportunities, and assess AI readiness'
    },
    {
      step: '02',
      title: 'Strategy Development',
      description: 'Create a comprehensive AI roadmap aligned with your business goals'
    },
    {
      step: '03',
      title: 'Implementation Planning',
      description: 'Detailed planning for successful AI deployment and integration'
    },
    {
      step: '04',
      title: 'Execution & Support',
      description: 'Expert implementation with ongoing support and optimization'
    }
  ];

  const aiEducationTopics = [
    {
      title: 'AI Fundamentals',
      description: 'Understanding artificial intelligence, machine learning, and deep learning basics',
      topics: [
        'What is AI and how it works',
        'Types of machine learning (supervised, unsupervised, reinforcement)',
        'Neural networks and deep learning',
        'AI vs traditional programming',
        'Current AI capabilities and limitations'
      ]
    },
    {
      title: 'AI Ethics & Responsible Use',
      description: 'Ensuring ethical and responsible AI implementation',
      topics: [
        'Bias detection and mitigation',
        'Privacy and data protection',
        'Transparency and explainability',
        'AI governance frameworks',
        'Social impact considerations'
      ]
    },
    {
      title: 'AI in Business Context',
      description: 'How AI transforms different business functions',
      topics: [
        'AI in marketing and customer service',
        'AI for operations and supply chain',
        'AI in finance and risk management',
        'AI for product development',
        'Measuring AI ROI and success metrics'
      ]
    }
  ];

  const toolSelectionGuide = [
    {
      category: 'Content Creation',
      description: 'AI tools for writing, design, and multimedia',
      tools: [
        { name: 'ChatGPT', use: 'Text generation, content writing, brainstorming' },
        { name: 'Midjourney', use: 'AI image generation and visual design' },
        { name: 'Jasper', use: 'Marketing copy and content optimization' },
        { name: 'Canva AI', use: 'Design templates and visual content' }
      ],
      selectionCriteria: [
        'Content quality and accuracy',
        'Customization options',
        'Integration capabilities',
        'Cost-effectiveness'
      ]
    },
    {
      category: 'Data Analysis',
      description: 'AI-powered analytics and business intelligence',
      tools: [
        { name: 'Tableau', use: 'Data visualization and business intelligence' },
        { name: 'Power BI', use: 'Microsoft ecosystem analytics' },
        { name: 'Google Analytics AI', use: 'Website and marketing analytics' },
        { name: 'IBM Watson', use: 'Advanced analytics and cognitive computing' }
      ],
      selectionCriteria: [
        'Data processing capabilities',
        'Ease of use for your team',
        'Scalability and performance',
        'Security and compliance features'
      ]
    },
    {
      category: 'Automation & Workflow',
      description: 'Process automation and workflow optimization',
      tools: [
        { name: 'Zapier', use: 'Workflow automation between apps' },
        { name: 'UiPath', use: 'Robotic process automation (RPA)' },
        { name: 'Microsoft Power Automate', use: 'Business process automation' },
        { name: 'Automation Anywhere', use: 'Enterprise RPA solutions' }
      ],
      selectionCriteria: [
        'Integration with existing systems',
        'Customization flexibility',
        'Monitoring and reporting',
        'Support and maintenance'
      ]
    },
    {
      category: 'Customer Experience',
      description: 'AI-powered customer service and engagement',
      tools: [
        { name: 'Intercom', use: 'AI-powered customer messaging' },
        { name: 'Zendesk AI', use: 'Intelligent customer support' },
        { name: 'Drift', use: 'Conversational marketing and sales' },
        { name: 'Freshdesk', use: 'AI-enhanced customer service' }
      ],
      selectionCriteria: [
        'Customer satisfaction metrics',
        'Response time and accuracy',
        'Multi-channel support',
        'Analytics and insights'
      ]
    }
  ];

  const aiImplementationSteps = [
    {
      phase: 'Phase 1: Foundation',
      title: 'AI Readiness Assessment',
      description: 'Evaluate your organization\'s current state and AI readiness',
      activities: [
        'Data quality and infrastructure audit',
        'Team skills and training needs assessment',
        'Business process analysis',
        'Technology stack evaluation',
        'ROI potential identification'
      ]
    },
    {
      phase: 'Phase 2: Strategy',
      title: 'AI Roadmap Development',
      description: 'Create a comprehensive implementation strategy',
      activities: [
        'Use case prioritization',
        'Technology selection and vendor evaluation',
        'Implementation timeline planning',
        'Resource allocation and budgeting',
        'Risk assessment and mitigation planning'
      ]
    },
    {
      phase: 'Phase 3: Implementation',
      title: 'Pilot and Scale',
      description: 'Start with pilot projects and scale successful implementations',
      activities: [
        'Pilot project design and execution',
        'Performance monitoring and optimization',
        'User training and change management',
        'Gradual scaling and expansion',
        'Continuous improvement and iteration'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-slide-up">
            AI Consulting Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Transform your business with expert AI strategy, implementation, and optimization services. 
            We help organizations leverage artificial intelligence for competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link
              href="#services"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Services
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our AI Consulting Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive AI solutions tailored to your business needs and objectives
            </p>
          </div>

          {/* Service Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveTab(service.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === service.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* Service Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12">
            {services.map((service) => (
              <div key={service.id} className={activeTab === service.id ? 'block' : 'hidden'}>
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Expertise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Deep knowledge across all aspects of artificial intelligence and business transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {expertise.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Education Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Education & Training
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Build your team's AI knowledge and capabilities with our comprehensive education programs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiEducationTopics.map((topic, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <BrainIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {topic.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {topic.description}
                </p>
                <ul className="space-y-2">
                  {topic.topics.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tool Selection Guide */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Choose the Right AI Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert guidance on selecting and implementing the best AI solutions for your specific needs
            </p>
          </div>

          <div className="space-y-12">
            {toolSelectionGuide.map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.category}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recommended Tools */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recommended Tools
                    </h4>
                    <div className="space-y-3">
                      {category.tools.map((tool, toolIndex) => (
                        <div key={toolIndex} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {tool.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {tool.use}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Criteria */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Selection Criteria
                    </h4>
                    <ul className="space-y-2">
                      {category.selectionCriteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Implementation Roadmap */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              AI Implementation Roadmap
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A structured approach to successfully implementing AI in your organization
            </p>
          </div>

          <div className="space-y-8">
            {aiImplementationSteps.map((step, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-6 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {step.phase}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                <div className="ml-22">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Key Activities:
                  </h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {step.activities.map((activity, activityIndex) => (
                      <li key={activityIndex} className="flex items-start">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Consulting Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A proven methodology for successful AI implementation and business transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business with AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how artificial intelligence can drive growth, efficiency, and innovation in your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/categories"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Explore AI Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Start Your AI Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Whether you're just beginning to explore AI or ready to implement advanced solutions, 
                our expert consultants are here to guide you every step of the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Free initial consultation</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Customized AI strategies</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Ongoing support and optimization</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UsersIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Expert AI consultants</span>
                </div>
                <div className="flex items-center">
                  <RocketIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Proven implementation track record</span>
                </div>
                <div className="flex items-center">
                  <ChartIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Data-driven approach</span>
                </div>
              </div>
              <Link
                href="/contact"
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
              >
                Contact Us
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
