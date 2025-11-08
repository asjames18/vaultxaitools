'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Edit3, History, Eye, EyeOff, TrendingUp, Target, Link, FileText } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'blog' | 'tool-update' | 'news' | 'guide' | 'review';
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    role: 'writer' | 'editor' | 'admin';
  };
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  seoData: {
    title: string;
    description: string;
    keywords: string[];
    focusKeyword: string;
    metaDescription: string;
    canonicalUrl: string;
    ogImage: string;
  };
  scheduling: {
    publishDate?: string;
    publishTime?: string;
    expireDate?: string;
    timezone: string;
  };
  versioning: {
    version: number;
    lastModified: string;
    modifiedBy: string;
    changeLog: string[];
  };
  analytics: {
    views: number;
    engagement: number;
    seoScore: number;
    readabilityScore: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

interface ContentWorkflow {
  id: string;
  contentId: string;
  step: 'draft' | 'review' | 'approval' | 'publish';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  notes: string;
}

interface EnhancedCMSProps {
  contentItems: ContentItem[];
  workflows: ContentWorkflow[];
  onContentCreate?: (content: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onContentUpdate?: (id: string, updates: Partial<ContentItem>) => void;
  onContentPublish?: (id: string, publishDate?: string) => void;
  onContentApprove?: (id: string, approvedBy: string, notes?: string) => void;
  onContentReject?: (id: string, rejectedBy: string, reason: string) => void;
  onWorkflowUpdate?: (workflowId: string, updates: Partial<ContentWorkflow>) => void;
  isAdmin?: boolean;
  userRole?: 'writer' | 'editor' | 'admin';
}

export default function EnhancedCMS({
  contentItems,
  workflows,
  onContentCreate,
  onContentUpdate,
  onContentPublish,
  onContentApprove,
  onContentReject,
  onWorkflowUpdate,
  isAdmin = false,
  userRole = 'writer'
}: EnhancedCMSProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'workflow' | 'calendar' | 'seo' | 'analytics'>('content');
  const [showCreateForm, setShowForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ContentWorkflow | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');

  const contentTypes = [
    { id: 'blog', name: 'Blog Post', icon: FileText, color: 'bg-blue-500/20 text-blue-600' },
    { id: 'tool-update', name: 'Tool Update', icon: TrendingUp, color: 'bg-green-500/20 text-green-600' },
    { id: 'news', name: 'News', icon: Target, color: 'bg-purple-500/20 text-purple-600' },
    { id: 'guide', name: 'Guide', icon: FileText, color: 'bg-yellow-500/20 text-yellow-600' },
    { id: 'review', name: 'Review', icon: Eye, color: 'bg-orange-500/20 text-orange-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'published': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'archived': return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (typeId: string) => {
    return contentTypes.find(t => t.id === typeId)?.color || 'bg-gray-500/20 text-gray-600';
  };

  const getTypeName = (typeId: string) => {
    return contentTypes.find(t => t.id === typeId)?.name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const filteredContent = contentItems.filter(item => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const canEdit = (item: ContentItem) => {
    if (userRole === 'admin') return true;
    if (userRole === 'editor') return true;
    if (userRole === 'writer' && item.author.id === 'current-user-id') return true;
    return false;
  };

  const canApprove = (item: ContentItem) => {
    return userRole === 'editor' || userRole === 'admin';
  };

  const canPublish = (item: ContentItem) => {
    return userRole === 'admin' || (userRole === 'editor' && item.status === 'approved');
  };

  const handleStatusChange = (contentId: string, newStatus: string) => {
    if (onContentUpdate) {
      onContentUpdate(contentId, { status: newStatus as any });
    }
  };

  const handlePublish = (contentId: string) => {
    if (onContentPublish) {
      onContentPublish(contentId);
    }
  };

  const handleApprove = (contentId: string) => {
    if (onContentApprove) {
      onContentApprove(contentId, 'Current User', 'Content approved');
    }
  };

  const handleReject = (contentId: string) => {
    if (onContentReject) {
      onContentReject(contentId, 'Current User', 'Content needs revision');
    }
  };

  const getSEOScore = (item: ContentItem) => {
    let score = 0;
    if (item.seoData.title && item.seoData.title.length > 0) score += 20;
    if (item.seoData.description && item.seoData.description.length > 0) score += 20;
    if (item.seoData.keywords.length > 0) score += 20;
    if (item.seoData.focusKeyword) score += 20;
    if (item.seoData.canonicalUrl) score += 20;
    return score;
  };

  const getReadabilityScore = (content: string) => {
    const words = content.split(' ').length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    if (avgWordsPerSentence <= 15) return 100;
    if (avgWordsPerSentence <= 20) return 80;
    if (avgWordsPerSentence <= 25) return 60;
    if (avgWordsPerSentence <= 30) return 40;
    return 20;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Enhanced Content Management</h2>
          <p className="text-white/70">Advanced CMS with workflows, scheduling, and SEO tools</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-3 py-2 bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors"
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Create Content
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'content', label: 'Content', icon: FileText, count: contentItems.length },
          { id: 'workflow', label: 'Workflows', icon: Users, count: workflows.filter(w => w.status === 'pending').length },
          { id: 'calendar', label: 'Calendar', icon: Calendar, count: contentItems.filter(c => c.scheduling.publishDate).length },
          { id: 'seo', label: 'SEO Tools', icon: Target, count: contentItems.filter(c => getSEOScore(c) < 80).length },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: contentItems.filter(c => c.analytics.views > 0).length }
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

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Types</option>
              {contentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Content Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className={`bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-white/30 transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center gap-4'
                }`}
                onClick={() => setSelectedContent(item)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeName(item.type)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-white/60 text-xs mb-3">
                      <span>By: {item.author.name}</span>
                      <span>{formatDate(item.updatedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.analytics.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {getSEOScore(item)}%
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {getReadabilityScore(item.content)}%
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                          {getTypeName(item.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{item.excerpt}</p>
                      <div className="flex items-center gap-4 text-white/60 text-xs">
                        <span>By: {item.author.name}</span>
                        <span>Updated: {formatDate(item.updatedAt)}</span>
                        <span>Views: {item.analytics.views}</span>
                        <span>SEO: {getSEOScore(item)}%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredContent.length === 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
              <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <div className="text-white/50 text-lg mb-2">No content found</div>
              <div className="text-white/40 text-sm">
                {filterStatus === 'all' ? 'Create your first piece of content!' : `No ${filterStatus} content`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Step {workflow.step}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    workflow.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                    workflow.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                
                <div className="text-white/70 text-sm mb-3">
                  <div>Assigned to: {workflow.assignedTo}</div>
                  <div>Due: {formatDate(workflow.dueDate)}</div>
                </div>

                {workflow.notes && (
                  <p className="text-white/60 text-xs line-clamp-2">{workflow.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white font-medium mb-4">Content Publishing Calendar</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-white/60 text-center text-sm font-medium p-2">
                  {day}
                </div>
              ))}
              {/* Calendar grid would go here */}
              <div className="text-white/40 text-center text-sm p-8">
                Calendar view coming soon...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tools Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems
              .filter(item => getSEOScore(item) < 80)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <h3 className="text-white font-medium mb-2">{item.title}</h3>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">SEO Score</span>
                      <span className={`text-sm font-medium ${
                        getSEOScore(item) >= 80 ? 'text-green-400' :
                        getSEOScore(item) >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {getSEOScore(item)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          getSEOScore(item) >= 80 ? 'bg-green-500' :
                          getSEOScore(item) >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${getSEOScore(item)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-white/60 text-xs">
                    {!item.seoData.title && <div>❌ Missing SEO title</div>}
                    {!item.seoData.description && <div>❌ Missing meta description</div>}
                    {item.seoData.keywords.length === 0 && <div>❌ No keywords</div>}
                    {!item.seoData.focusKeyword && <div>❌ No focus keyword</div>}
                    {!item.seoData.canonicalUrl && <div>❌ No canonical URL</div>}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems
              .filter(item => item.analytics.views > 0)
              .sort((a, b) => b.analytics.views - a.analytics.views)
              .slice(0, 9)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <h3 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{item.analytics.views}</div>
                      <div className="text-white/60 text-xs">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{item.analytics.engagement}%</div>
                      <div className="text-white/60 text-xs">Engagement</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-white/60 text-xs">Published {formatDate(item.publishedAt || item.updatedAt)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Content Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Content Details */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Content Information</h4>
                  <div className="space-y-2 text-white/80 text-sm">
                    <div><strong>Type:</strong> {getTypeName(selectedContent.type)}</div>
                    <div><strong>Status:</strong> {selectedContent.status}</div>
                    <div><strong>Priority:</strong> {selectedContent.priority}</div>
                    <div><strong>Author:</strong> {selectedContent.author.name}</div>
                    <div><strong>Category:</strong> {selectedContent.category}</div>
                    <div><strong>Created:</strong> {formatDate(selectedContent.createdAt)}</div>
                    <div><strong>Updated:</strong> {formatDate(selectedContent.updatedAt)}</div>
                    {selectedContent.publishedAt && (
                      <div><strong>Published:</strong> {formatDate(selectedContent.publishedAt)}</div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {canEdit(selectedContent) && (
                      <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                        Edit
                      </button>
                    )}
                    {canApprove(selectedContent) && selectedContent.status === 'review' && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedContent.id)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(selectedContent.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {canPublish(selectedContent) && selectedContent.status === 'approved' && (
                      <button
                        onClick={() => handlePublish(selectedContent.id)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>

                {/* Analytics & SEO */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Analytics & SEO</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedContent.analytics.views}</div>
                      <div className="text-white/60 text-xs">Views</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{getSEOScore(selectedContent)}%</div>
                      <div className="text-white/60 text-xs">SEO Score</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{getReadabilityScore(selectedContent.content)}%</div>
                      <div className="text-white/60 text-xs">Readability</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{selectedContent.analytics.engagement}%</div>
                      <div className="text-white/60 text-xs">Engagement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Detail Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Workflow Details</h3>
                <button
                  onClick={() => setSelectedWorkflow(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-white/80">
                <div><strong>Step:</strong> {selectedWorkflow.step}</div>
                <div><strong>Assigned To:</strong> {selectedWorkflow.assignedTo}</div>
                <div><strong>Status:</strong> {selectedWorkflow.status}</div>
                <div><strong>Due Date:</strong> {formatDate(selectedWorkflow.dueDate)}</div>
                {selectedWorkflow.notes && (
                  <div><strong>Notes:</strong> {selectedWorkflow.notes}</div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-white font-medium">Update Status:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (onWorkflowUpdate) {
                        onWorkflowUpdate(selectedWorkflow.id, { status: 'in-progress' });
                      }
                      setSelectedWorkflow(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Start Work
                  </button>
                  <button
                    onClick={() => {
                      if (onWorkflowUpdate) {
                        onWorkflowUpdate(selectedWorkflow.id, { status: 'completed' });
                      }
                      setSelectedWorkflow(null);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
