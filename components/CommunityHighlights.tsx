'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ChatBubbleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Expanded reviews array with 50 realistic reviews
const initialReviews = [
  {
    id: 1,
    user: "Sarah M.",
    avatar: "👩‍💼",
    tool: "ChatGPT",
    rating: 5,
    comment: "Absolutely game-changing for my content creation workflow! Saves me hours every week.",
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    user: "Alex K.",
    avatar: "👨‍💻",
    tool: "Midjourney",
    rating: 4,
    comment: "The image quality is incredible. Perfect for my design projects and client presentations.",
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    user: "Maria L.",
    avatar: "👩‍🎨",
    tool: "Notion AI",
    rating: 5,
    comment: "This has revolutionized how I organize my work and ideas. The AI suggestions are spot-on.",
    timeAgo: "6 hours ago"
  },
  {
    id: 4,
    user: "David R.",
    avatar: "👨‍🔬",
    tool: "Claude",
    rating: 5,
    comment: "Much better reasoning than ChatGPT for my research work. Highly recommend for academics.",
    timeAgo: "8 hours ago"
  },
  {
    id: 5,
    user: "Emma T.",
    avatar: "👩‍💻",
    tool: "Cursor",
    rating: 4,
    comment: "The AI code completion is incredible. It's like having a senior developer pair programming with me.",
    timeAgo: "10 hours ago"
  },
  {
    id: 6,
    user: "Michael B.",
    avatar: "👨‍💼",
    tool: "Perplexity",
    rating: 5,
    comment: "Finally, a search engine that gives me actual answers instead of just links. Game changer!",
    timeAgo: "12 hours ago"
  },
  {
    id: 7,
    user: "Lisa P.",
    avatar: "👩‍🎨",
    tool: "Stable Diffusion",
    rating: 4,
    comment: "Amazing for creating custom artwork. The control over the generation process is impressive.",
    timeAgo: "1 day ago"
  },
  {
    id: 8,
    user: "James W.",
    avatar: "👨‍💻",
    tool: "Fireflies",
    rating: 5,
    comment: "Perfect for meeting transcriptions and action item extraction. Saves me so much time.",
    timeAgo: "1 day ago"
  },
  {
    id: 9,
    user: "Rachel S.",
    avatar: "👩‍💼",
    tool: "Grammarly",
    rating: 4,
    comment: "Essential for professional writing. Catches errors I never would have noticed.",
    timeAgo: "1 day ago"
  },
  {
    id: 10,
    user: "Tom H.",
    avatar: "👨‍🎨",
    tool: "Canva",
    rating: 5,
    comment: "The AI design suggestions are brilliant. Makes me look like a professional designer.",
    timeAgo: "2 days ago"
  },
  {
    id: 11,
    user: "Amanda K.",
    avatar: "👩‍💻",
    tool: "GitHub Copilot",
    rating: 5,
    comment: "Revolutionized my coding workflow. The suggestions are incredibly accurate and helpful.",
    timeAgo: "2 days ago"
  },
  {
    id: 12,
    user: "Chris M.",
    avatar: "👨‍💼",
    tool: "Otter.ai",
    rating: 4,
    comment: "Great for interview transcriptions. The speaker identification works really well.",
    timeAgo: "2 days ago"
  },
  {
    id: 13,
    user: "Jennifer L.",
    avatar: "👩‍🎨",
    tool: "DALL-E",
    rating: 4,
    comment: "Love the creative possibilities. Perfect for generating unique visuals for my projects.",
    timeAgo: "3 days ago"
  },
  {
    id: 14,
    user: "Robert T.",
    avatar: "👨‍💻",
    tool: "Tabnine",
    rating: 3,
    comment: "Good code completion, but sometimes a bit slow. Overall helpful for productivity.",
    timeAgo: "3 days ago"
  },
  {
    id: 15,
    user: "Natalie R.",
    avatar: "👩‍💼",
    tool: "Jasper",
    rating: 5,
    comment: "Incredible for marketing copy. Generates high-converting content in minutes.",
    timeAgo: "3 days ago"
  },
  {
    id: 16,
    user: "Kevin D.",
    avatar: "👨‍🎨",
    tool: "Runway ML",
    rating: 4,
    comment: "Amazing video editing capabilities. The AI-powered tools are revolutionary.",
    timeAgo: "4 days ago"
  },
  {
    id: 17,
    user: "Sophie W.",
    avatar: "👩‍💻",
    tool: "Replit",
    rating: 4,
    comment: "Great for collaborative coding. The AI assistant is really helpful for debugging.",
    timeAgo: "4 days ago"
  },
  {
    id: 18,
    user: "Mark J.",
    avatar: "👨‍💼",
    tool: "Loom",
    rating: 5,
    comment: "Perfect for async communication. The AI transcription makes it so much more accessible.",
    timeAgo: "4 days ago"
  },
  {
    id: 19,
    user: "Hannah B.",
    avatar: "👩‍🎨",
    tool: "Figma",
    rating: 4,
    comment: "The AI design features are getting better every day. Great for rapid prototyping.",
    timeAgo: "5 days ago"
  },
  {
    id: 20,
    user: "Daniel L.",
    avatar: "👨‍💻",
    tool: "CodeWhisperer",
    rating: 4,
    comment: "Solid code completion tool. Integrates well with AWS services.",
    timeAgo: "5 days ago"
  },
  {
    id: 21,
    user: "Olivia M.",
    avatar: "👩‍💼",
    tool: "Copy.ai",
    rating: 5,
    comment: "Fantastic for generating marketing content. Saves me hours of writing time.",
    timeAgo: "5 days ago"
  },
  {
    id: 22,
    user: "Paul S.",
    avatar: "👨‍🎨",
    tool: "Adobe Firefly",
    rating: 4,
    comment: "Great integration with Adobe suite. The generative AI features are impressive.",
    timeAgo: "6 days ago"
  },
  {
    id: 23,
    user: "Grace T.",
    avatar: "👩‍💻",
    tool: "Tabnine",
    rating: 3,
    comment: "Decent code completion, but the free version is quite limited.",
    timeAgo: "6 days ago"
  },
  {
    id: 24,
    user: "Andrew R.",
    avatar: "👨‍💼",
    tool: "Descript",
    rating: 5,
    comment: "Revolutionary for podcast editing. The AI voice cloning is mind-blowing.",
    timeAgo: "6 days ago"
  },
  {
    id: 25,
    user: "Isabella K.",
    avatar: "👩‍🎨",
    tool: "Leonardo.ai",
    rating: 4,
    comment: "Great for creating consistent character designs. The training features are excellent.",
    timeAgo: "1 week ago"
  },
  {
    id: 26,
    user: "Ryan M.",
    avatar: "👨‍💻",
    tool: "Kite",
    rating: 3,
    comment: "Good code completion, but the company shutdown was disappointing.",
    timeAgo: "1 week ago"
  },
  {
    id: 27,
    user: "Victoria L.",
    avatar: "👩‍💼",
    tool: "Writesonic",
    rating: 4,
    comment: "Excellent for SEO content. The keyword optimization suggestions are spot-on.",
    timeAgo: "1 week ago"
  },
  {
    id: 28,
    user: "Brandon H.",
    avatar: "👨‍🎨",
    tool: "Artbreeder",
    rating: 4,
    comment: "Fascinating for creating unique artwork. The genetic algorithm approach is innovative.",
    timeAgo: "1 week ago"
  },
  {
    id: 29,
    user: "Maya S.",
    avatar: "👩‍💻",
    tool: "IntelliCode",
    rating: 4,
    comment: "Good integration with Visual Studio. The suggestions are contextually relevant.",
    timeAgo: "1 week ago"
  },
  {
    id: 30,
    user: "Ethan W.",
    avatar: "👨‍💼",
    tool: "Synthesia",
    rating: 5,
    comment: "Incredible for creating professional videos with AI avatars. Perfect for training content.",
    timeAgo: "1 week ago"
  },
  {
    id: 31,
    user: "Zoe B.",
    avatar: "👩‍🎨",
    tool: "Playground AI",
    rating: 4,
    comment: "Great for experimenting with different AI models. The interface is intuitive.",
    timeAgo: "1 week ago"
  },
  {
    id: 32,
    user: "Nathan T.",
    avatar: "👨‍💻",
    tool: "Codeium",
    rating: 4,
    comment: "Fast and accurate code completion. The free tier is quite generous.",
    timeAgo: "1 week ago"
  },
  {
    id: 33,
    user: "Ava R.",
    avatar: "👩‍💼",
    tool: "Rytr",
    rating: 4,
    comment: "Good for content creation. The templates are helpful for different use cases.",
    timeAgo: "1 week ago"
  },
  {
    id: 34,
    user: "Caleb M.",
    avatar: "👨‍🎨",
    tool: "NightCafe",
    rating: 3,
    comment: "Interesting concept, but the results can be inconsistent. Good for experimentation.",
    timeAgo: "1 week ago"
  },
  {
    id: 35,
    user: "Lily K.",
    avatar: "👩‍💻",
    tool: "Kite",
    rating: 2,
    comment: "Was great while it lasted, but the shutdown left me looking for alternatives.",
    timeAgo: "1 week ago"
  },
  {
    id: 36,
    user: "Dylan L.",
    avatar: "👨‍💼",
    tool: "Lumen5",
    rating: 4,
    comment: "Excellent for creating engaging video content from blog posts. Saves tons of time.",
    timeAgo: "1 week ago"
  },
  {
    id: 37,
    user: "Chloe S.",
    avatar: "👩‍🎨",
    tool: "DeepAI",
    rating: 3,
    comment: "Good API for AI services, but the web interface could be more user-friendly.",
    timeAgo: "1 week ago"
  },
  {
    id: 38,
    user: "Jordan W.",
    avatar: "👨‍💻",
    tool: "Tabnine",
    rating: 4,
    comment: "Solid code completion tool. The team features are great for collaboration.",
    timeAgo: "1 week ago"
  },
  {
    id: 39,
    user: "Scarlett B.",
    avatar: "👩‍💼",
    tool: "Wordtune",
    rating: 5,
    comment: "Perfect for improving my writing. The suggestions are always helpful and natural.",
    timeAgo: "1 week ago"
  },
  {
    id: 40,
    user: "Mason T.",
    avatar: "👨‍🎨",
    tool: "Craiyon",
    rating: 3,
    comment: "Free alternative to DALL-E, but the quality isn't quite as good. Good for testing ideas.",
    timeAgo: "1 week ago"
  },
  {
    id: 41,
    user: "Harper R.",
    avatar: "👩‍💻",
    tool: "CodeWhisperer",
    rating: 4,
    comment: "Great for AWS development. The security scanning features are particularly useful.",
    timeAgo: "1 week ago"
  },
  {
    id: 42,
    user: "Logan M.",
    avatar: "👨‍💼",
    tool: "Murf",
    rating: 4,
    comment: "Excellent text-to-speech with natural-sounding voices. Perfect for video narration.",
    timeAgo: "1 week ago"
  },
  {
    id: 43,
    user: "Aria K.",
    avatar: "👩‍🎨",
    tool: "Midjourney",
    rating: 5,
    comment: "The best AI image generator I've used. The artistic quality is unmatched.",
    timeAgo: "1 week ago"
  },
  {
    id: 44,
    user: "Grayson L.",
    avatar: "👨‍💻",
    tool: "Replit",
    rating: 4,
    comment: "Great for learning and prototyping. The collaborative features are fantastic.",
    timeAgo: "1 week ago"
  },
  {
    id: 45,
    user: "Luna S.",
    avatar: "👩‍💼",
    tool: "ChatGPT",
    rating: 5,
    comment: "Essential tool for my daily workflow. Use it for everything from writing to brainstorming.",
    timeAgo: "1 week ago"
  },
  {
    id: 46,
    user: "Atlas W.",
    avatar: "👨‍🎨",
    tool: "Stable Diffusion",
    rating: 4,
    comment: "Love the open-source approach. Great for creating custom models for specific use cases.",
    timeAgo: "1 week ago"
  },
  {
    id: 47,
    user: "Nova B.",
    avatar: "👩‍💻",
    tool: "Cursor",
    rating: 5,
    comment: "The best AI-powered code editor I've used. The chat feature is incredibly helpful.",
    timeAgo: "1 week ago"
  },
  {
    id: 48,
    user: "Phoenix T.",
    avatar: "👨‍💼",
    tool: "Perplexity",
    rating: 5,
    comment: "Revolutionary search experience. Finally, a search engine that actually answers questions.",
    timeAgo: "1 week ago"
  },
  {
    id: 49,
    user: "Sage R.",
    avatar: "👩‍🎨",
    tool: "Notion AI",
    rating: 4,
    comment: "Great for organizing thoughts and generating content within my workspace.",
    timeAgo: "1 week ago"
  },
  {
    id: 50,
    user: "River M.",
    avatar: "👨‍💻",
    tool: "Claude",
    rating: 5,
    comment: "Superior reasoning and analysis compared to other AI assistants. Perfect for research.",
    timeAgo: "1 week ago"
  }
];

const communityStats = [
  { label: "Curated Tools", value: "19", icon: StarIcon, color: "yellow" },
  { label: "Categories", value: "8", icon: ChatBubbleIcon, color: "green" },
  { label: "Expert Selected", value: "100%", icon: UsersIcon, color: "blue" },
  { label: "Quality Focused", value: "✓", icon: HeartIcon, color: "red" }
];

export default function CommunityHighlights() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    // Rotate through reviews every 5 seconds
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  // Function to add new review (can be called from external components)
  const addNewReview = (newReview: any) => {
    const reviewWithId = {
      ...newReview,
      id: Math.max(...reviews.map(r => r.id)) + 1,
      timeAgo: "Just now"
    };
    setReviews(prev => [reviewWithId, ...prev]);
  };

  // Expose the function globally for other components to use
  useEffect(() => {
    (window as any).addCommunityReview = addNewReview;
    return () => {
      delete (window as any).addCommunityReview;
    };
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Platform Highlights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover hand-picked AI tools curated for quality and real-world effectiveness
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Community Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Platform Overview
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Hand-picked quality tools</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Curated</span>
                </div>
              </div>
              <Link
                href="/AITools"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center block"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Recent Reviews
            </h3>
            <div className="space-y-6">
              {reviews.slice(currentReviewIndex, currentReviewIndex + 3).map((review, index) => (
                <div
                  key={review.id}
                  className={`transition-all duration-500 ${
                    index === 0 ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center text-xl">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.user}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          reviewed
                        </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {review.tool}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.timeAgo}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>Updated every 5 seconds • {reviews.length} total reviews</span>
                </div>
                <Link
                  href="/reviews"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read All Reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Share Your Experience
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Help others discover amazing AI tools by sharing your reviews and experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/submit-tool"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                Submit a Tool
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Browse Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 