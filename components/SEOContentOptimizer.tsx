'use client';

import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Link, FileText, Search, BarChart3, Lightbulb, Zap, Users, Globe, Hash, Eye } from 'lucide-react';

interface SEOKeyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cpc: number; // Cost per click
  competition: 'low' | 'medium' | 'high';
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  relatedKeywords: string[];
  questions: string[];
  contentGaps: string[];
}

interface ContentCluster {
  id: string;
  topic: string;
  pillarKeyword: string;
  relatedKeywords: string[];
  contentPieces: ContentPiece[];
  authorityScore: number;
  internalLinks: InternalLink[];
  searchPerformance: {
    impressions: number;
    clicks: number;
    ctr: number;
    averagePosition: number;
  };
}

interface ContentPiece {
  id: string;
  title: string;
  url: string;
  type: 'pillar' | 'cluster' | 'supporting';
  targetKeywords: string[];
  seoScore: number;
  wordCount: number;
  lastUpdated: string;
  performance: {
    views: number;
    engagement: number;
    backlinks: number;
  };
}

interface InternalLink {
  from: string;
  to: string;
  anchorText: string;
  relevance: number;
  lastChecked: string;
}

interface SEOContentOptimizerProps {
  keywords: SEOKeyword[];
  contentClusters: ContentCluster[];
  contentPieces: ContentPiece[];
  onKeywordAdd?: (keyword: SEOKeyword) => void;
  onContentOptimize?: (contentId: string, optimizations: any) => void;
  onClusterCreate?: (cluster: Omit<ContentCluster, 'id'>) => void;
  onInternalLinkAdd?: (link: Omit<InternalLink, 'lastChecked'>) => void;
}

export default function SEOContentOptimizer({
  keywords,
  contentClusters,
  contentPieces,
  onKeywordAdd,
  onContentOptimize,
  onClusterCreate,
  onInternalLinkAdd
}: SEOContentOptimizerProps) {
  const [activeTab, setActiveTab] = useState<'keywords' | 'clusters' | 'content' | 'links' | 'analytics'>('keywords');
  const [selectedKeyword, setSelectedKeyword] = useState<SEOKeyword | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<ContentCluster | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentPiece | null>(null);
  const [showKeywordForm, setShowKeywordForm] = useState(false);
  const [showClusterForm, setShowClusterForm] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'informational': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'navigational': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'transactional': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'commercial': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAuthorityScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const filteredKeywords = keywords.filter(keyword => {
    if (filterDifficulty !== 'all' && keyword.difficulty !== filterDifficulty) return false;
    if (filterIntent !== 'all' && keyword.intent !== filterIntent) return false;
    if (searchTerm && !keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getKeywordOpportunityScore = (keyword: SEOKeyword) => {
    // Calculate opportunity score based on search volume, difficulty, and competition
    const volumeScore = Math.min(keyword.searchVolume / 1000, 1) * 40;
    const difficultyScore = keyword.difficulty === 'easy' ? 30 : keyword.difficulty === 'medium' ? 20 : 10;
    const competitionScore = keyword.competition === 'low' ? 30 : keyword.competition === 'medium' ? 20 : 10;
    return Math.round(volumeScore + difficultyScore + competitionScore);
  };

  const getContentGapAnalysis = () => {
    const keywordIds = new Set(keywords.map(k => k.keyword.toLowerCase()));
    const contentKeywords = new Set();
    
    contentPieces.forEach(piece => {
      piece.targetKeywords.forEach(keyword => {
        contentKeywords.add(keyword.toLowerCase());
      });
    });

    const gaps = keywords.filter(keyword => 
      !contentKeywords.has(keyword.keyword.toLowerCase())
    );

    return gaps.sort((a, b) => getKeywordOpportunityScore(b) - getKeywordOpportunityScore(a));
  };

  const getInternalLinkingOpportunities = () => {
    const opportunities: Array<{ from: any; to: any[]; keyword: string; relevance: number }> = [];
    
    contentPieces.forEach(piece => {
      piece.targetKeywords.forEach(keyword => {
        const relatedContent = contentPieces.filter(otherPiece => 
          otherPiece.id !== piece.id && 
          otherPiece.targetKeywords.some(k => 
            k.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(k.toLowerCase())
          )
        );
        
        if (relatedContent.length > 0) {
          opportunities.push({
            from: piece,
            to: relatedContent,
            keyword,
            relevance: relatedContent.length
          });
        }
      });
    });

    return opportunities.sort((a, b) => b.relevance - a.relevance);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Content Optimizer</h2>
          <p className="text-white/70">Advanced SEO tools for content optimization and keyword strategy</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowKeywordForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Target className="w-4 h-4" />
            Add Keyword
          </button>
          <button
            onClick={() => setShowClusterForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Create Cluster
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'keywords', label: 'Keywords', icon: Target, count: keywords.length },
          { id: 'clusters', label: 'Content Clusters', icon: FileText, count: contentClusters.length },
          { id: 'content', label: 'Content Analysis', icon: Search, count: contentPieces.length },
          { id: 'links', label: 'Internal Links', icon: Link, count: getInternalLinkingOpportunities().length },
          { id: 'analytics', label: 'SEO Analytics', icon: BarChart3, count: 0 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              value={filterIntent}
              onChange={(e) => setFilterIntent(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Intents</option>
              <option value="informational">Informational</option>
              <option value="navigational">Navigational</option>
              <option value="transactional">Transactional</option>
              <option value="commercial">Commercial</option>
            </select>

            <input
              type="text"
              placeholder="Search keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKeywords.map((keyword) => (
              <div
                key={keyword.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedKeyword(keyword)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium text-lg">{keyword.keyword}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{getKeywordOpportunityScore(keyword)}</div>
                    <div className="text-white/60 text-xs">Opportunity</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Search Volume</span>
                    <span className="text-white font-medium">{keyword.searchVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">CPC</span>
                    <span className="text-white font-medium">${keyword.cpc.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                    {keyword.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntentColor(keyword.intent)}`}>
                    {keyword.intent}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(keyword.competition)}`}>
                    {keyword.competition}
                  </span>
                </div>

                {keyword.relatedKeywords.length > 0 && (
                  <div className="text-white/60 text-xs">
                    Related: {keyword.relatedKeywords.slice(0, 3).join(', ')}
                    {keyword.relatedKeywords.length > 3 && ` +${keyword.relatedKeywords.length - 3}`}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Gap Analysis */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Content Gap Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getContentGapAnalysis().slice(0, 6).map((keyword) => (
                <div
                  key={keyword.id}
                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{keyword.keyword}</span>
                    <span className="text-blue-400 font-bold">{getKeywordOpportunityScore(keyword)}</span>
                  </div>
                  <div className="text-white/60 text-xs">
                    Volume: {keyword.searchVolume.toLocaleString()} | 
                    Difficulty: {keyword.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Clusters Tab */}
      {activeTab === 'clusters' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentClusters.map((cluster) => (
              <div
                key={cluster.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium text-lg">{cluster.topic}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAuthorityScoreColor(cluster.authorityScore)}`}>
                    {cluster.authorityScore}% Authority
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-white/70 text-sm mb-1">Pillar Keyword</div>
                  <div className="text-blue-400 font-medium">{cluster.pillarKeyword}</div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Content Pieces</span>
                    <span>{cluster.contentPieces.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Internal Links</span>
                    <span>{cluster.internalLinks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Avg Position</span>
                    <span>{cluster.searchPerformance.averagePosition.toFixed(1)}</span>
                  </div>
                </div>

                <div className="text-white/60 text-xs">
                  Related: {cluster.relatedKeywords.slice(0, 3).join(', ')}
                  {cluster.relatedKeywords.length > 3 && ` +${cluster.relatedKeywords.length - 3}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Analysis Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentPieces.map((piece) => (
              <div
                key={piece.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedContent(piece)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium line-clamp-2">{piece.title}</h3>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      piece.seoScore >= 80 ? 'text-green-400' :
                      piece.seoScore >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {piece.seoScore}%
                    </div>
                    <div className="text-white/60 text-xs">SEO Score</div>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    piece.type === 'pillar' ? 'bg-blue-500/20 text-blue-400' :
                    piece.type === 'cluster' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {piece.type}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Word Count</span>
                    <span>{piece.wordCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Views</span>
                    <span>{piece.performance.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/60 text-xs">
                    <span>Backlinks</span>
                    <span>{piece.performance.backlinks}</span>
                  </div>
                </div>

                <div className="text-white/60 text-xs">
                  Keywords: {piece.targetKeywords.slice(0, 3).join(', ')}
                  {piece.targetKeywords.length > 3 && ` +${piece.targetKeywords.length - 3}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getInternalLinkingOpportunities().slice(0, 9).map((opportunity, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="mb-3">
                  <div className="text-white/70 text-sm mb-1">From</div>
                  <div className="text-white font-medium line-clamp-2">{opportunity.from.title}</div>
                </div>

                <div className="mb-3">
                  <div className="text-white/70 text-sm mb-1">Keyword</div>
                  <div className="text-blue-400 font-medium">{opportunity.keyword}</div>
                </div>

                <div className="mb-3">
                  <div className="text-white/70 text-sm mb-1">Link To</div>
                  <div className="space-y-1">
                    {opportunity.to.slice(0, 2).map((content) => (
                      <div key={content.id} className="text-white/80 text-sm line-clamp-1">
                        {content.title}
                      </div>
                    ))}
                    {opportunity.to.length > 2 && (
                      <div className="text-white/60 text-xs">
                        +{opportunity.to.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">
                    Relevance: {opportunity.relevance}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
                    Add Links
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{keywords.length}</div>
                  <div className="text-white/60 text-sm">Total Keywords</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{contentClusters.length}</div>
                  <div className="text-white/60 text-sm">Content Clusters</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Link className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {contentPieces.reduce((sum, piece) => sum + piece.performance.backlinks, 0)}
                  </div>
                  <div className="text-white/60 text-sm">Total Backlinks</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round(contentPieces.reduce((sum, piece) => sum + piece.seoScore, 0) / contentPieces.length)}%
                  </div>
                  <div className="text-white/60 text-sm">Avg SEO Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Charts */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">SEO Performance Trends</h3>
            <div className="text-white/40 text-center py-8">
              Performance charts coming soon...
            </div>
          </div>
        </div>
      )}

      {/* Keyword Detail Modal */}
      {selectedKeyword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedKeyword.keyword}</h3>
                <button
                  onClick={() => setSelectedKeyword(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Keyword Metrics</h4>
                  <div className="space-y-3 text-white/80">
                    <div className="flex justify-between">
                      <span>Search Volume:</span>
                      <span className="font-medium">{selectedKeyword.searchVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedKeyword.difficulty)}`}>
                        {selectedKeyword.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPC:</span>
                      <span className="font-medium">${selectedKeyword.cpc.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competition:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCompetitionColor(selectedKeyword.competition)}`}>
                        {selectedKeyword.competition}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Intent:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getIntentColor(selectedKeyword.intent)}`}>
                        {selectedKeyword.intent}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Content Opportunities</h4>
                  <div className="space-y-3">
                    {selectedKeyword.questions.length > 0 && (
                      <div>
                        <div className="text-white/70 text-sm mb-2">Questions to Answer:</div>
                        <div className="space-y-1">
                          {selectedKeyword.questions.slice(0, 3).map((question, index) => (
                            <div key={index} className="text-white/80 text-sm">• {question}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedKeyword.contentGaps.length > 0 && (
                      <div>
                        <div className="text-white/70 text-sm mb-2">Content Gaps:</div>
                        <div className="space-y-1">
                          {selectedKeyword.contentGaps.slice(0, 3).map((gap, index) => (
                            <div key={index} className="text-white/80 text-sm">• {gap}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Create Content
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Add to Cluster
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Track Performance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cluster Detail Modal */}
      {selectedCluster && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedCluster.topic}</h3>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Cluster Information</h4>
                  <div className="space-y-3 text-white/80">
                    <div><strong>Pillar Keyword:</strong> {selectedCluster.pillarKeyword}</div>
                    <div><strong>Authority Score:</strong> {selectedCluster.authorityScore}%</div>
                    <div><strong>Content Pieces:</strong> {selectedCluster.contentPieces.length}</div>
                    <div><strong>Internal Links:</strong> {selectedCluster.internalLinks.length}</div>
                  </div>

                  <div>
                    <div className="text-white/70 text-sm mb-2">Related Keywords:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCluster.relatedKeywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Search Performance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedCluster.searchPerformance.impressions.toLocaleString()}</div>
                      <div className="text-white/60 text-xs">Impressions</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedCluster.searchPerformance.clicks.toLocaleString()}</div>
                      <div className="text-white/60 text-xs">Clicks</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedCluster.searchPerformance.ctr.toFixed(2)}%</div>
                      <div className="text-white/60 text-xs">CTR</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedCluster.searchPerformance.averagePosition.toFixed(1)}</div>
                      <div className="text-white/60 text-xs">Avg Position</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Content Pieces</h4>
                <div className="space-y-2">
                  {selectedCluster.contentPieces.map((piece) => (
                    <div key={piece.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{piece.title}</div>
                        <div className="text-white/60 text-xs">{piece.type} • {piece.wordCount} words</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{piece.seoScore}%</div>
                        <div className="text-white/60 text-xs">SEO Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{selectedContent.title}</h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-white/80">
                <div><strong>Type:</strong> {selectedContent.type}</div>
                <div><strong>SEO Score:</strong> {selectedContent.seoScore}%</div>
                <div><strong>Word Count:</strong> {selectedContent.wordCount.toLocaleString()}</div>
                <div><strong>Last Updated:</strong> {new Date(selectedContent.lastUpdated).toLocaleDateString()}</div>
                <div><strong>URL:</strong> {selectedContent.url}</div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Target Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.targetKeywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-medium mb-3">Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{selectedContent.performance.views.toLocaleString()}</div>
                    <div className="text-white/60 text-xs">Views</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{selectedContent.performance.engagement}%</div>
                    <div className="text-white/60 text-xs">Engagement</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{selectedContent.performance.backlinks}</div>
                    <div className="text-white/60 text-xs">Backlinks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  Optimize Content
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  View Analytics
                </button>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Internal Links
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
