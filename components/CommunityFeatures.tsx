'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, TrendingUp, Heart, Share2, Flag, Edit3, Trash2, Reply, MoreHorizontal } from 'lucide-react';

interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
  };
  category: 'general' | 'tools' | 'tips' | 'news' | 'help';
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  created_at: string;
  updated_at?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level: number;
  };
  likes: number;
  created_at: string;
  parentId?: string;
}

interface CommunityFeaturesProps {
  userId?: string;
  discussions: Discussion[];
  onDiscussionCreate?: (discussion: Omit<Discussion, 'id' | 'created_at' | 'author'>) => void;
  onDiscussionLike?: (discussionId: string) => void;
  onDiscussionReply?: (discussionId: string, reply: Omit<Reply, 'id' | 'created_at'>) => void;
  onDiscussionReport?: (discussionId: string, reason: string) => void;
}

export default function CommunityFeatures({
  userId,
  discussions,
  onDiscussionCreate,
  onDiscussionLike,
  onDiscussionReply,
  onDiscussionReport
}: CommunityFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'discussions' | 'trending' | 'my-posts'>('discussions');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    tags: ['']
  });
  const [newReply, setNewReply] = useState('');

  const categories = [
    { id: 'general', name: 'General', color: 'bg-blue-500/20 text-blue-600' },
    { id: 'tools', name: 'Tools', color: 'bg-green-500/20 text-green-600' },
    { id: 'tips', name: 'Tips & Tricks', color: 'bg-yellow-500/20 text-yellow-600' },
    { id: 'news', name: 'News', color: 'bg-purple-500/20 text-purple-600' },
    { id: 'help', name: 'Help & Support', color: 'bg-red-500/20 text-red-600' }
  ];

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || 'bg-gray-500/20 text-gray-600';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'General';
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

  const handleCreateDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDiscussionCreate && userId) {
      onDiscussionCreate({
        title: newDiscussion.title,
        content: newDiscussion.content,
        category: newDiscussion.category,
        tags: newDiscussion.tags.filter(tag => tag.trim()),
        likes: 0,
        replies: 0,
        views: 0
      });
      setNewDiscussion({ title: '', content: '', category: 'general', tags: [''] });
      setShowCreateForm(false);
    }
  };

  const handleReply = (discussionId: string) => {
    if (onDiscussionReply && userId && newReply.trim()) {
      onDiscussionReply(discussionId, {
        content: newReply,
        author: { id: userId, name: 'Current User', level: 1 },
        likes: 0
      });
      setNewReply('');
      setShowReplyForm(null);
    }
  };

  const addTag = () => {
    setNewDiscussion(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setNewDiscussion(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setNewDiscussion(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }));
  };

  const filteredDiscussions = discussions.filter(discussion => {
    if (activeTab === 'trending') {
      return discussion.likes > 5 || discussion.replies > 3;
    }
    if (activeTab === 'my-posts') {
      return discussion.author.id === userId;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Community</h2>
          <p className="text-white/70">Connect with other AI tool enthusiasts</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Start Discussion
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {[
          { id: 'discussions', label: 'All Discussions', icon: MessageSquare },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'my-posts', label: 'My Posts', icon: Users }
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
          </button>
        ))}
      </div>

      {/* Create Discussion Form */}
      {showCreateForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Start a New Discussion</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="What would you like to discuss?"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Content *
              </label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-y"
                placeholder="Share your thoughts, questions, or insights..."
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Tags
              </label>
              <div className="space-y-2">
                {newDiscussion.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      placeholder="Add a tag"
                    />
                    {newDiscussion.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  + Add Tag
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Discussion
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 text-white/70 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.map((discussion) => (
          <div
            key={discussion.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all cursor-pointer"
            onClick={() => setSelectedDiscussion(discussion)}
          >
            {/* Discussion Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {discussion.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{discussion.author.name}</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                      Level {discussion.author.level}
                    </span>
                  </div>
                  <div className="text-white/60 text-sm">
                    {formatDate(discussion.created_at)}
                    {discussion.updated_at && discussion.updated_at !== discussion.created_at && ' (edited)'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {discussion.isPinned && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    📌 Pinned
                  </span>
                )}
                {discussion.isLocked && (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                    🔒 Locked
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(discussion.category)}`}>
                  {getCategoryName(discussion.category)}
                </span>
              </div>
            </div>

            {/* Discussion Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">{discussion.title}</h3>
              <p className="text-white/80 line-clamp-3">{discussion.content}</p>
            </div>

            {/* Tags */}
            {discussion.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {discussion.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-white/20 text-white/70 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Discussion Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDiscussionLike) onDiscussionLike(discussion.id);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  {discussion.likes}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReplyForm(showReplyForm === discussion.id ? null : discussion.id);
                  }}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  {discussion.replies}
                </button>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {discussion.views}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share functionality
                  }}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDiscussionReport) onDiscussionReport(discussion.id, 'inappropriate');
                  }}
                  className="text-white/60 hover:text-white transition-colors p-1"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Reply Form */}
            {showReplyForm === discussion.id && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write a quick reply..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    onClick={() => handleReply(discussion.id)}
                    disabled={!newReply.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredDiscussions.length === 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
            <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <div className="text-white/50 text-lg mb-2">No discussions yet</div>
            <div className="text-white/40 text-sm">
              {activeTab === 'my-posts' 
                ? "You haven't started any discussions yet. Start one to engage with the community!"
                : "Be the first to start a discussion and engage with the community!"
              }
            </div>
          </div>
        )}
      </div>

      {/* Discussion Detail Modal */}
      {selectedDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedDiscussion.title}</h2>
                <button
                  onClick={() => setSelectedDiscussion(null)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80">{selectedDiscussion.content}</p>
              </div>
              
              {/* Add more discussion detail content here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
