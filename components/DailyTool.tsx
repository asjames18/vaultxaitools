'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tool } from '@/lib/types/tool';



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
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden">
            <div className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
                <SparklesIcon className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Today's Featured Tool</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Come back tomorrow for a featured tool
              </h2>
              <p className="text-gray-400">
                We feature a new AI tool every day. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl overflow-hidden">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-green-400/5 to-transparent" />

            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Tool Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2 mb-6">
                    <SparklesIcon className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">
                      Today's Featured Tool
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    {dailyTool.name}
                  </h2>
                  
                  <p className="text-lg text-gray-300 mb-6 max-w-2xl">
                    {dailyTool.description}
                  </p>
                  

                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href={`/tool/${dailyTool.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Explore {dailyTool.name}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/AITools"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-600"
                    >
                      Browse All Tools
                    </Link>
                  </div>
                </div>
                
                {/* Tool Visual */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gradient-to-br from-green-900 via-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg border border-green-500/20">
                    <div className="text-8xl">{dailyTool.logo || dailyTool.name.charAt(0)}</div>
                  </div>
                </div>
              </div>
              
              {/* Tool details */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {dailyTool.category}
                    </div>
                    <div className="text-sm text-gray-400">Category</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {dailyTool.pricing}
                    </div>
                    <div className="text-sm text-gray-400">Pricing</div>
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