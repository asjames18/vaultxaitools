import React, { useState } from 'react';
import { TrendingUp, Star, Users, DollarSign, Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface Alternative {
  name: string;
  rating: number;
  logo: string;
  description?: string;
  pricing?: string;
  pros?: string[];
  cons?: string[];
  website?: string;
}

interface AlternativesSectionProps {
  alternatives: Alternative[];
  currentToolName: string;
  currentToolCategory: string;
}

export default function AlternativesSection({ alternatives, currentToolName, currentToolCategory }: AlternativesSectionProps) {
  const [expandedAlternative, setExpandedAlternative] = useState<string | null>(null);

  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  const toggleAlternative = (name: string) => {
    setExpandedAlternative(expandedAlternative === name ? null : name);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Fair';
    return 'Poor';
  };

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <TrendingUp className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Competitive Alternatives</h3>
          <p className="text-white/70 text-sm">
            Compare {currentToolName} with other {currentToolCategory.toLowerCase()} tools
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alternative, index) => {
          const isExpanded = expandedAlternative === alternative.name;
          
          return (
            <div
              key={index}
              className={`bg-white/5 rounded-lg border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/10 ${
                isExpanded ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              {/* Alternative Header */}
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{alternative.logo}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{alternative.name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className={`w-4 h-4 ${getRatingColor(alternative.rating)} fill-current`} />
                        <span className={`text-sm font-medium ${getRatingColor(alternative.rating)}`}>
                          {alternative.rating}
                        </span>
                      </div>
                      <span className="text-white/50 text-xs">•</span>
                      <span className="text-white/60 text-xs">{getRatingLabel(alternative.rating)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <Users className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                  {alternative.pricing && (
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <DollarSign className="w-3 h-3" />
                      <span>{alternative.pricing}</span>
                    </div>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => toggleAlternative(alternative.name)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors text-sm"
                >
                  {isExpanded ? 'Show Less' : 'Learn More'}
                  <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-white/20 bg-white/5 p-4 space-y-4">
                  {/* Description */}
                  {alternative.description && (
                    <div>
                      <h5 className="text-white/80 font-medium text-sm mb-2">Overview</h5>
                      <p className="text-white/70 text-sm leading-relaxed">{alternative.description}</p>
                    </div>
                  )}

                  {/* Pros */}
                  {alternative.pros && alternative.pros.length > 0 && (
                    <div>
                      <h5 className="text-green-400 font-medium text-sm mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {alternative.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Cons */}
                  {alternative.cons && alternative.cons.length > 0 && (
                    <div>
                      <h5 className="text-red-400 font-medium text-sm mb-2">Limitations</h5>
                      <ul className="space-y-1">
                        {alternative.cons.map((con, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (alternative.website) {
                          window.open(alternative.website, '_blank');
                        }
                      }}
                      disabled={!alternative.website}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {alternative.website ? 'Visit Website' : 'No Website'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h4 className="font-medium text-white">Why Compare Alternatives?</h4>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          Each tool has unique strengths and trade-offs. Comparing alternatives helps you find the perfect fit for your specific needs, budget, and workflow. Consider factors like pricing, features, ease of use, and integration capabilities.
        </p>
      </div>
    </section>
  );
}
