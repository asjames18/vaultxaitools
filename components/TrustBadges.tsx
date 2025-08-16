import React from 'react';

interface TrustBadgeProps {
  type: 'editors-pick' | 'community-favorite' | 'expert-tested' | 'top-rated';
  toolName: string;
}

export default function TrustBadges() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Our Evaluation Framework</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white text-sm">Usability & Interface</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-white text-sm">AI Accuracy & Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-white text-sm">Value for Money</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-white text-sm">Integration Capabilities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-white text-sm">Community & Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
            <span className="text-white text-sm">Innovation & Updates</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-green-500/20 text-green-100 text-xs rounded-full border border-green-500/30">
          Editor's Pick
        </span>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-100 text-xs rounded-full border border-blue-500/30">
          Expert Tested
        </span>
        <span className="px-3 py-1 bg-purple-500/20 text-purple-100 text-xs rounded-full border border-purple-500/30">
          Community Favorite
        </span>
        <span className="px-3 py-1 bg-yellow-500/20 text-white text-xs rounded-full border border-yellow-500/30">
          Top Rated
        </span>
      </div>
      
      <p className="text-white text-sm mt-4">
        Every tool listed undergoes our 4-step curation process: Discovery → Expert Testing → Quality Assessment → Final Selection
      </p>
    </div>
  );
}

export function TrustBadge({ type, toolName }: TrustBadgeProps) {
  const badgeConfig = {
    'editors-pick': { label: "Editor's Pick", color: "bg-green-500/20 text-green-100 border-green-500/30" },
    'community-favorite': { label: "Community Favorite", color: "bg-purple-500/20 text-purple-100 border-purple-500/30" },
    'expert-tested': { label: "Expert Tested", color: "bg-blue-500/20 text-blue-100 border-blue-500/30" },
    'top-rated': { label: "Top Rated", color: "bg-yellow-500/20 text-white border-yellow-500/30" }
  };
  
  const config = badgeConfig[type];
  
  return (
    <span className={`px-3 py-1 ${config.color} text-xs rounded-full border font-medium`}>
      {config.label}
    </span>
  );
}
