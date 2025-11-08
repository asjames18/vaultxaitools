import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started with Media Tools - VaultX Tech',
  description: 'New to media production? Start here with our beginner-friendly guide to media tools and resources for churches and ministries',
};

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Getting Started with Media Tools 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            New to media production? Start here with our beginner-friendly guide for churches and ministries
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Beginner's Guide</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">What is Media Production?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Media production for churches and ministries involves creating professional-quality video, graphics, audio, and social media content. 
                This includes everything from editing sermon videos to designing graphics for social media posts.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Media production tools can help you create engaging content, manage your social media presence, stream services live, and produce professional audio for podcasts and sermons.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Getting Started Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Explore Our Directory</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Browse our curated collection of media production tools to see what's available for your church or ministry
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Start with Simple Tools</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Begin with user-friendly tools that don't require technical expertise
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Learn and Experiment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try different tools, read reviews, and learn from the community
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recommended Starting Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Content Creation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI writing assistants, image generators, and video creation tools
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Productivity</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Task automation, scheduling, and workflow optimization tools
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Learning</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Educational AI tools, language learning, and skill development
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Business</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Marketing, analytics, and customer service automation tools
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <a 
                  href="/AITools" 
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Media Tools
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
