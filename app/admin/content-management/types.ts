export type ContentTab = 'overview' | 'news' | 'tools' | 'announcements' | 'analytics';

export type ContentModalType = 'create' | 'edit' | 'view';

export interface ContentItem {
  id: string;
  type: 'news' | 'tool-update' | 'announcement' | 'feature';
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: string;
  expiryDate?: string;
  tags: string[];
  targetAudience: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
  engagement?: number;
}

export interface ToolUpdate {
  id: string;
  toolId: string;
  toolName: string;
  updateType: 'feature' | 'bugfix' | 'improvement' | 'new';
  title: string;
  description: string;
  version?: string;
  impact: 'low' | 'medium' | 'high';
  status: 'draft' | 'published';
  publishDate: string;
  createdBy: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  category: 'ai-news' | 'industry' | 'research' | 'product';
  status: 'draft' | 'published' | 'scheduled';
  publishDate: string;
  tags: string[];
  featured: boolean;
  createdBy: string;
}

export type ContentFormData = Partial<
  Pick<ContentItem, 'title' | 'content' | 'type' | 'priority' | 'status'>
>;
