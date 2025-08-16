'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';



const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

interface DailyToolProps {
  tools: Tool[];
}

export default function DailyTool({ tools }: DailyToolProps) {
  const [dailyTool, setDailyTool] = useState<Tool | null>(null);
  const [daysSinceEpoch, setDaysSinceEpoch] = useState(0);

  useEffect(() => {
    // Calculate days since epoch to ensure consistent daily tool selection
    const today = new Date();
    const epoch = new Date(2024, 0, 1); // Start from January 1, 2024
    const daysSince = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
    setDaysSinceEpoch(daysSince);

    // Select tool based on the day
    if (tools.length > 0) {
      const toolIndex = daysSince % tools.length;
      const selectedTool = tools[toolIndex];
      setDailyTool(selectedTool);
    }
  }, [tools]);

  if (!dailyTool) {
    return (
      <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="relative p-8 md:p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Loading Daily Tool...
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tools available: {tools.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Debug: dailyTool state is null
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-pink-600/10" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Tool Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full px-4 py-2 mb-6">
                    <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-purple-500 dark:text-purple-200">
                      Today's Featured Tool
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {dailyTool.name}
                  </h2>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-200 mb-6 max-w-2xl">
                    {dailyTool.description}
                  </p>
                  

                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href={`/tool/${dailyTool.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Explore {dailyTool.name}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/search"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200"
                    >
                      Browse All Tools
                    </Link>
                  </div>
                </div>
                
                {/* Tool Visual */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-8xl">{dailyTool.logo || dailyTool.name.charAt(0)}</div>
                  </div>
                </div>
              </div>
              
              {/* Tool details */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {dailyTool.category}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-200">Category</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {dailyTool.pricing}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-200">Pricing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 