'use client';

import { useState } from 'react';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import AdvancedAnimations, { 
  StaggerContainer, 
  Parallax, 
  HoverCard, 
  Floating, 
  Pulse, 
  Shake, 
  Typewriter, 
  LoadingSpinner, 
  ProgressBar 
} from '../../components/AdvancedAnimations';
import Personalization from '../../components/Personalization';
import { Star, Zap, Heart, TrendingUp, Users, Award, Sparkles } from 'lucide-react';

export default function UIShowcaseClient() {
  const [activeSection, setActiveSection] = useState<'animations' | 'theme' | 'personalization'>('animations');
  const [progress, setProgress] = useState(0);

  // Simulate progress
  useState(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 1000);
    return () => clearInterval(interval);
  });

  const sections = [
    { id: 'animations', label: 'Animations', icon: Sparkles },
    { id: 'theme', label: 'Theme System', icon: Zap },
    { id: 'personalization', label: 'Personalization', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VaultX UI Showcase
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeSwitcher variant="compact" />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeSection === 'animations' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center">
              <AdvancedAnimations animation="fadeIn" trigger="always">
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  <Typewriter text="Advanced Animations" speed={100} />
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Experience smooth, performant animations that enhance user engagement and create delightful interactions.
                </p>
              </AdvancedAnimations>
            </div>

            {/* Basic Animations */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Basic Animation Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { animation: 'fadeIn', label: 'Fade In', delay: 0 },
                  { animation: 'slideUp', label: 'Slide Up', delay: 0.1 },
                  { animation: 'slideLeft', label: 'Slide Left', delay: 0.2 },
                  { animation: 'scale', label: 'Scale', delay: 0.3 }
                ].map((item) => (
                  <AdvancedAnimations
                    key={item.animation}
                    animation={item.animation as any}
                    delay={item.delay}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
                  >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Smooth {item.label.toLowerCase()} animation
                    </p>
                  </AdvancedAnimations>
                ))}
              </div>
            </div>

            {/* Stagger Animations */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Stagger Animations
              </h3>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Star, title: 'Premium Quality', description: 'Built with attention to detail' },
                  { icon: Zap, title: 'Lightning Fast', description: 'Optimized for performance' },
                  { icon: Heart, title: 'User Centered', description: 'Designed for the best experience' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl transition-shadow"
                    >
                      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </StaggerContainer>
            </div>

            {/* Interactive Elements */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Interactive Elements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <HoverCard className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Hover Effect
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    3D hover interaction
                  </p>
                </HoverCard>

                <Floating className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Floating
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gentle floating animation
                  </p>
                </Floating>

                <Pulse className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Pulse
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Breathing pulse effect
                  </p>
                </Pulse>

                <Shake className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Shake
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hover to shake
                  </p>
                </Shake>
              </div>
            </div>

            {/* Loading & Progress */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Loading & Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Loading Spinner
                  </h4>
                  <div className="flex justify-center">
                    <LoadingSpinner />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Progress Bar
                  </h4>
                  <ProgressBar progress={progress} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                    {progress}% Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Parallax Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Parallax Effect
              </h3>
              <Parallax className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-2xl font-bold mb-2">Parallax Background</h4>
                  <p className="text-blue-100">Scroll to see the effect</p>
                </div>
              </Parallax>
            </div>
          </div>
        )}

        {activeSection === 'theme' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Theme System
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Seamlessly switch between light, dark, and system themes with smooth transitions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Theme Switcher Demo */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Theme Switcher Variants
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Button Variant
                    </h4>
                    <ThemeSwitcher variant="button" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dropdown Variant
                    </h4>
                    <ThemeSwitcher variant="dropdown" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compact Variant
                    </h4>
                    <ThemeSwitcher variant="compact" />
                  </div>
                </div>
              </div>

              {/* Theme Preview */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Theme Preview
                </h3>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Theme
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Background</span>
                      <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Text</span>
                      <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded border border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Border</span>
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'personalization' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Personalization
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Customize your experience with comprehensive personalization options.
              </p>
            </div>

            <Personalization />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 VaultX AI Tools. Built with modern web technologies and advanced UI/UX principles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
