'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, EyeOff, Flag, UserCheck, Clock, Ban } from 'lucide-react';

interface ModerationReport {
  id: string;
  contentType: 'review' | 'discussion' | 'comment' | 'user';
  contentId: string;
  reporterId: string;
  reporterName: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'copyright' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  action?: 'warn' | 'hide' | 'delete' | 'ban' | 'none';
  notes?: string;
}

interface ContentItem {
  id: string;
  type: 'review' | 'discussion' | 'comment' | 'user';
  title?: string;
  content: string;
  author: {
    id: string;
    name: string;
    email?: string;
    level: number;
    status: 'active' | 'warned' | 'suspended' | 'banned';
  };
  createdAt: string;
  isHidden: boolean;
  isFlagged: boolean;
  flagCount: number;
  lastModerated?: string;
}

interface ContentModerationProps {
  reports: ModerationReport[];
  contentItems: ContentItem[];
  onReportUpdate?: (reportId: string, updates: Partial<ModerationReport>) => void;
  onContentAction?: (contentId: string, action: string, reason?: string) => void;
  onUserAction?: (userId: string, action: string, reason?: string) => void;
  isAdmin?: boolean;
}

export default function ContentModeration({
  reports,
  contentItems,
  onReportUpdate,
  onContentAction,
  onUserAction,
  isAdmin = false
}: ContentModerationProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'content' | 'users'>('reports');
  const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'dismissed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'spam': return '🚫';
      case 'inappropriate': return '⚠️';
      case 'harassment': return '🚨';
      case 'fake': return '🤖';
      case 'copyright': return '📝';
      case 'other': return '❓';
      default: return '❓';
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'spam': return 'Spam';
      case 'inappropriate': return 'Inappropriate';
      case 'harassment': return 'Harassment';
      case 'fake': return 'Fake/Bot';
      case 'copyright': return 'Copyright';
      case 'other': return 'Other';
      default: return 'Unknown';
    }
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

  const filteredReports = reports.filter(report => {
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    if (filterPriority !== 'all' && report.priority !== filterPriority) return false;
    if (searchTerm && !report.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleReportAction = (reportId: string, action: string, notes?: string) => {
    if (onReportUpdate) {
      onReportUpdate(reportId, {
        status: 'resolved',
        action: action as any,
        notes,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Current Moderator'
      });
    }
    setSelectedReport(null);
  };

  const handleContentAction = (contentId: string, action: string, reason?: string) => {
    if (onContentAction) {
      onContentAction(contentId, action, reason);
    }
    setSelectedContent(null);
  };

  const handleUserAction = (userId: string, action: string, reason?: string) => {
    if (onUserAction) {
      onUserAction(userId, action, reason);
    }
  };

  const getContentPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Moderation</h2>
          <p className="text-white/70">Manage user-generated content and reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="text-white/60 text-sm">Admin Panel</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'reports', label: 'Reports', icon: Flag, count: reports.filter(r => r.status === 'pending').length },
          { id: 'content', label: 'Content', icon: Eye, count: contentItems.filter(c => c.isFlagged).length },
          { id: 'users', label: 'Users', icon: UserCheck, count: contentItems.filter(c => c.author.status !== 'active').length }
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
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
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
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getReasonIcon(report.reason)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">
                          {getReasonLabel(report.reason)} Report
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-white/60 text-xs">
                        <span>By: {report.reporterName}</span>
                        <span>Content: {report.contentType}</span>
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-xs">
                      {report.status === 'pending' && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Clock className="w-3 h-3" />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
                <Shield className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <div className="text-white/50 text-lg mb-2">No reports found</div>
                <div className="text-white/40 text-sm">
                  {filterStatus === 'all' ? 'All caught up!' : `No ${filterStatus} reports`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems.filter(item => item.isFlagged || item.isHidden).map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => setSelectedContent(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                      {item.type}
                    </span>
                    {item.isHidden && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                        Hidden
                      </span>
                    )}
                    {item.isFlagged && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                        Flagged ({item.flagCount})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  {item.title && (
                    <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  )}
                  <p className="text-white/80 text-sm line-clamp-3">
                    {getContentPreview(item.content)}
                  </p>
                </div>

                <div className="flex items-center justify-between text-white/60 text-xs">
                  <span>By: {item.author.name}</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems
              .filter(item => item.author.status !== 'active')
              .map((item) => (
                <div
                  key={item.author.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {item.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.author.name}</div>
                      <div className="text-white/60 text-sm">Level {item.author.level}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.author.status === 'warned' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.author.status === 'suspended' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.author.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {item.author.status === 'banned' ? (
                      <button
                        onClick={() => handleUserAction(item.author.id, 'unban', 'Appeal granted')}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Unban User
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUserAction(item.author.id, 'warn', 'Community guidelines violation')}
                          className="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Warn
                        </button>
                        <button
                          onClick={() => handleUserAction(item.author.id, 'ban', 'Repeated violations')}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Ban
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-white/80">
                <div>
                  <strong>Reason:</strong> {getReasonLabel(selectedReport.reason)}
                </div>
                <div>
                  <strong>Description:</strong> {selectedReport.description}
                </div>
                <div>
                  <strong>Reporter:</strong> {selectedReport.reporterName}
                </div>
                <div>
                  <strong>Content Type:</strong> {selectedReport.contentType}
                </div>
                <div>
                  <strong>Priority:</strong> {selectedReport.priority}
                </div>
                <div>
                  <strong>Status:</strong> {selectedReport.status}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(selectedReport.createdAt)}
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-white font-medium">Take Action:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'warn')}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                      Warn User
                    </button>
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'hide')}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      Hide Content
                    </button>
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'delete')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Delete Content
                    </button>
                    <button
                      onClick={() => handleReportAction(selectedReport.id, 'ban')}
                      className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors"
                    >
                      Ban User
                    </button>
                  </div>
                  <button
                    onClick={() => handleReportAction(selectedReport.id, 'none')}
                    className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Dismiss Report
                  </button>
                </div>
              )}
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
                <h3 className="text-xl font-semibold text-white">Content Details</h3>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-white/80">
                {selectedContent.title && (
                  <div>
                    <strong>Title:</strong> {selectedContent.title}
                  </div>
                )}
                <div>
                  <strong>Content:</strong> {selectedContent.content}
                </div>
                <div>
                  <strong>Author:</strong> {selectedContent.author.name} (Level {selectedContent.author.level})
                </div>
                <div>
                  <strong>Type:</strong> {selectedContent.type}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(selectedContent.createdAt)}
                </div>
                <div>
                  <strong>Status:</strong> {selectedContent.isHidden ? 'Hidden' : 'Visible'}
                </div>
                {selectedContent.isFlagged && (
                  <div>
                    <strong>Flag Count:</strong> {selectedContent.flagCount}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-white font-medium">Moderation Actions:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleContentAction(selectedContent.id, 'hide')}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    Hide Content
                  </button>
                  <button
                    onClick={() => handleContentAction(selectedContent.id, 'delete')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete Content
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedContent.author.id, 'warn')}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    Warn User
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedContent.author.id, 'ban')}
                    className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors"
                  >
                    Ban User
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
