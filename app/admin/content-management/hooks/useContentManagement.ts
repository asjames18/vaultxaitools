'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { ContentFormData, ContentItem, NewsItem, ToolUpdate } from '../types';

const FALLBACK_CONTENT: ContentItem[] = [
  {
    id: 'content-1',
    type: 'news',
    title: 'Welcome to Content Management',
    content: 'This is a sample content item to demonstrate the content management interface.',
    status: 'published',
    priority: 'medium',
    publishDate: new Date().toISOString(),
    tags: ['welcome', 'demo'],
    targetAudience: ['all'],
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const FALLBACK_TOOL_UPDATES: ToolUpdate[] = [
  {
    id: 'tool-1',
    toolId: 'demo-tool-1',
    toolName: 'Demo AI Tool',
    updateType: 'feature',
    title: 'Demo Tool - New Features',
    description: 'This is a sample tool update to demonstrate the interface.',
    version: '1.0.0',
    impact: 'high',
    status: 'published',
    publishDate: new Date().toISOString(),
    createdBy: 'Admin',
  },
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'OpenAI Releases GPT-4 Turbo',
    content: 'OpenAI has announced the release of GPT-4 Turbo with enhanced capabilities...',
    source: 'OpenAI Blog',
    category: 'ai-news',
    status: 'published',
    publishDate: new Date().toISOString(),
    tags: ['openai', 'gpt-4', 'ai'],
    featured: true,
    createdBy: 'Admin',
  },
];

function toolsToUpdates(tools: { id: string; name: string; updated_at: string }[]): ToolUpdate[] {
  return tools.map((tool, index) => ({
    id: `tool-${tool.id}`,
    toolId: tool.id,
    toolName: tool.name,
    updateType: index < 3 ? 'feature' : 'improvement',
    title: `${tool.name} - Latest Updates`,
    description: `Updated ${tool.name} with latest information and improvements`,
    version: '1.0.0',
    impact: index < 2 ? 'high' : 'medium',
    status: 'published' as const,
    publishDate: tool.updated_at,
    createdBy: 'Admin',
  }));
}

export function useContentManagement() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [toolUpdates, setToolUpdates] = useState<ToolUpdate[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const supabase = createClient();

  const applyFallbackData = useCallback(() => {
    setContentItems(FALLBACK_CONTENT);
    setToolUpdates(FALLBACK_TOOL_UPDATES);
    setNewsItems(FALLBACK_NEWS);
  }, []);

  const fetchContentData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: content, error: contentError } = await supabase
        .from('content_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentError) {
        console.log('Content table error (might not exist):', contentError);
        setContentItems(FALLBACK_CONTENT);
      } else {
        setContentItems(content || []);
      }

      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .order('updated_at', { ascending: false });

      if (toolsError) {
        console.log('Tools table error:', toolsError);
        setToolUpdates(FALLBACK_TOOL_UPDATES);
      } else {
        setToolUpdates(toolsToUpdates(tools || []));
      }

      setNewsItems(FALLBACK_NEWS);
    } catch (error) {
      console.error('Error fetching content data:', error);
      applyFallbackData();
    } finally {
      setLoading(false);
    }
  }, [applyFallbackData, supabase]);

  useEffect(() => {
    fetchContentData();
  }, [fetchContentData]);

  const triggerFrontendRefresh = async (contentType: string) => {
    try {
      await fetch('/api/admin/refresh-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: contentType }),
      });
    } catch (error) {
      console.error('Error triggering refresh:', error);
    }
  };

  const publishContent = async (item: ContentItem) => {
    try {
      setPublishing(true);

      const { error } = await supabase
        .from('content_management')
        .update({
          status: 'published',
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) throw error;

      await triggerFrontendRefresh(item.type);
      await fetchContentData();
      alert('Content published successfully!');
    } catch (error) {
      console.error('Error publishing content:', error);
      alert('Error publishing content');
    } finally {
      setPublishing(false);
    }
  };

  const createContent = async (data: ContentFormData) => {
    try {
      const { error } = await supabase.from('content_management').insert([
        {
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      await fetchContentData();
      alert('Content created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Error creating content');
      return false;
    }
  };

  const updateContent = async (id: string, data: ContentFormData) => {
    try {
      const { error } = await supabase
        .from('content_management')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchContentData();
      alert('Content updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content');
      return false;
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase.from('content_management').delete().eq('id', id);

      if (error) throw error;

      await fetchContentData();
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  return {
    contentItems,
    toolUpdates,
    newsItems,
    loading,
    publishing,
    publishContent,
    createContent,
    updateContent,
    deleteContent,
  };
}
