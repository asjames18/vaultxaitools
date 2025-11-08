'use client';

import { useState } from 'react';
import Link from 'next/link';

// Icons
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CompareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

export default function GettingStartedClient() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Browse Media Tools",
      description: "Explore our curated collection of media production tools",
      icon: SearchIcon,
      content: "Start by browsing our comprehensive collection of hand-picked media production tools. Each tool has been carefully selected and tested to ensure quality and effectiveness for church and ministry use.",
      action: "Browse Tools",
      actionLink: "/AITools"
    },
    {
      id: 2,
      title: "Filter & Search",
      description: "Find tools that match your needs",
      icon: FilterIcon,
      content: "Use our advanced filters to narrow down tools by category, pricing, features, and use case. Our search functionality helps you find exactly what you're looking for.",
      action: "Search Tools",
              actionLink: "/AITools"
    },
    {
      id: 3,
      title: "Compare Tools",
      description: "Make informed decisions",
      icon: CompareIcon,
      content: "Compare multiple tools side-by-side to evaluate features, pricing, and capabilities. Save your favorites and track tools you're interested in.",
      action: "Compare Tools",
      actionLink: "/compare"
    },
    {
      id: 4,
      title: "Get Started",
      description: "Start using media tools",
      icon: RocketIcon,
      content: "Visit tool websites, sign up for free trials, and begin integrating media production tools into your church or ministry workflow. Start with free tools to experiment before investing.",
      action: "View Featured Tools",
      actionLink: "/"
    }
  ];

  const quickTips = [
    {
      icon: LightBulbIcon,
      title: "Start with Free Tools",
      description: "Many media tools offer free tiers or trials. Start with these to experiment without commitment."
    },
    {
      icon: UsersIcon,
      title: "Read User Reviews",
      description: "Check real user experiences and reviews to understand how tools perform in practice for churches and ministries."
    },
    {
      icon: BookOpenIcon,
      title: "Learn the Basics",
      description: "Familiarize yourself with media production terminology and concepts to make better tool choices for your ministry."
    }
  ];

  const popularCategories = [
            { name: "Video Editing", description: "Video editing tools for church media", icon: "🎬", link: "/AITools?category=Video Editing" },
        { name: "Graphics Design", description: "Graphics design tools for ministry materials", icon: "🎨", link: "/AITools?category=Graphics Design" },
        { name: "Social Media", description: "Social media management for churches", icon: "📱", link: "/AITools?category=Social Media" },
        { name: "Live Streaming", description: "Live streaming platforms for services", icon: "📺", link: "/AITools?category=Live Streaming" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full px-6 py-3 mb-8 shadow-lg">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Beginner's Guide</span>
            </div>
            
                                 <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                       Getting Started with Media Tools
                     </h1>
                     
                     <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                       New to media production tools? This comprehensive guide will help you find, understand, and use the best media solutions for your church or ministry.
                     </p>
         
                     <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                       <Link
                         href="/AITools"
                         className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                       >
                         Browse Media Tools
                         <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                       </Link>
                       {/* Search functionality integrated into Media Tools page */}
                     </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Journey to Media Production Success
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these four simple steps to find and use the perfect media production tools for your church or ministry
            </p>
          </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                     {/* Step Navigation */}
                     <div className="space-y-3 sm:space-y-4">
                       {steps.map((step) => (
                         <button
                           key={step.id}
                           onClick={() => setActiveStep(step.id)}
                           className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                             activeStep === step.id
                               ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                               : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                           }`}
                         >
                           <div className="flex items-center gap-3 sm:gap-4">
                             <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                               activeStep === step.id
                                 ? 'bg-blue-500 text-white'
                                 : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                             }`}>
                               <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                             </div>
                             <div className="flex-1">
                               <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">
                                 {step.title}
                               </h3>
                               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                 {step.description}
                               </p>
                             </div>
                             {activeStep === step.id && (
                               <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                             )}
                           </div>
                         </button>
                       ))}
                     </div>

                                 {/* Step Content */}
                     <div className="bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                       {steps.map((step) => (
                         <div
                           key={step.id}
                           className={`${activeStep === step.id ? 'block' : 'hidden'}`}
                         >
                           <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                               <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                             </div>
                             <div>
                               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                 {step.title}
                               </h3>
                               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                 {step.description}
                               </p>
                             </div>
                           </div>
                           
                           <p className="text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                             {step.content}
                           </p>
                           
                           <Link
                             href={step.actionLink}
                             className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base"
                           >
                             {step.action}
                             <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                           </Link>
                         </div>
                       ))}
                     </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Quick Tips for Success
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these best practices to get the most out of media production tools
            </p>
          </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                     {quickTips.map((tip, index) => (
                       <div
                         key={index}
                         className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                       >
                         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                           <tip.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                         </div>
                         <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                           {tip.title}
                         </h3>
                         <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                           {tip.description}
                         </p>
                       </div>
                     ))}
                   </div>
        </div>
      </section>

      {/* Popular Categories */}
      {/* <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Popular Media Tool Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start exploring these popular categories to find tools that match your church or ministry needs
            </p>
          </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                     {popularCategories.map((category, index) => (
                       <Link
                         key={index}
                         href={category.link}
                         className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-600"
                       >
                         <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{category.icon}</div>
                         <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                           {category.name}
                         </h3>
                         <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                           {category.description}
                         </p>
                         <div className="mt-3 sm:mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm">
                           Explore
                           <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                       </Link>
                     ))}
                   </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of churches and ministries who are already using media production tools to create engaging content and reach their communities.
          </p>
          
                             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                     <Link
                       href="/AITools"
                       className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 hover:bg-gray-50 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                     >
                       Browse All Tools
                       <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     </Link>
                     <Link
                       href="/search"
                       className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base"
                     >
                       Search Tools
                       <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     </Link>
                   </div>
        </div>
      </section>
    </div>
  );
}
