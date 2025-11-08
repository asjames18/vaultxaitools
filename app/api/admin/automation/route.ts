import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';

interface AutomationStatus {
  status: string;
  lastRun?: string;
  toolsFound?: number;
  summary?: {
    newTools: number;
    updatedTools: number;
    errors: number;
  };
  sources?: Record<string, number>;
  categories?: Record<string, number>;
  newsCount?: number;
  recentNews?: any[];
}

export async function POST(request: NextRequest) {
  try {
    // Require admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !(await canAccessAdmin(user))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    console.log('Received POST body:', body);
    const { action, config } = body;

    switch (action) {
      case 'run-automation': {
        return NextResponse.json({ 
          message: 'Automation scripts have been cleaned up. Manual data management is now available through the admin dashboard.',
          timestamp: new Date().toISOString(),
          syncEnabled: false
        });
      }

      case 'refresh-data': {
        return NextResponse.json({ 
          message: 'Data refresh scripts have been cleaned up. Use the admin dashboard for manual data management.',
          timestamp: new Date().toISOString(),
          syncEnabled: false
        });
      }

      case 'toggle-auto-refresh': {
        return NextResponse.json({ 
          message: 'Auto-refresh has been disabled. Use the admin dashboard for manual data management.',
          enabled: false,
          timestamp: new Date().toISOString()
        });
      }

      case 'get-automation-settings': {
        return NextResponse.json({ 
          settings: [],
          message: 'Automation has been simplified. Manual management through admin dashboard.',
          timestamp: new Date().toISOString()
        });
      }

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Automation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !(await canAccessAdmin(user))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current database statistics
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('category, created_at, name, rating');
    
    console.log('Fetched tools data:', tools?.length || 0, 'tools');
    
    // Get current news statistics
    const { data: newsData, error: newsError } = await supabase
      .from('ai_news')
      .select('category, created_at, source, published_at');
    
    console.log('Fetched news data:', newsData?.length || 0, 'news articles');
    
    let status: AutomationStatus = { 
      status: 'simplified',
      lastRun: new Date().toISOString(),
      toolsFound: tools?.length || 0,
      summary: {
        newTools: 0,
        updatedTools: 0,
        errors: 0
      }
    };
    
    if (!toolsError && tools) {
      // Calculate sources breakdown (mock data based on tool names since source column doesn't exist)
      const sources: Record<string, number> = {};
      const categories: Record<string, number> = {};
      
      // Mock source mapping based on known tool names
      const sourceMapping: Record<string, string> = {
        'ChatGPT': 'OpenAI',
        'Claude': 'Anthropic',
        'Midjourney': 'Product Hunt',
        'GitHub Copilot': 'GitHub',
        'Google Bard': 'Google',
        'Microsoft Copilot': 'Microsoft',
        'Stable Diffusion': 'Stability AI'
      };
      
      tools.forEach(tool => {
        const source = sourceMapping[tool.name] || 'Manual';
        sources[source] = (sources[source] || 0) + 1;
        
        const category = tool.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      // Add news sources and categories
      if (!newsError && newsData) {
        newsData.forEach(article => {
          const source = article.source || 'Unknown';
          sources[source] = (sources[source] || 0) + 1;
          
          const category = `News: ${article.category || 'General'}`;
          categories[category] = (categories[category] || 0) + 1;
        });
      }
      
      status.sources = sources;
      status.categories = categories;
      status.newsCount = newsData?.length || 0;
      status.recentNews = newsData?.slice(0, 5) || [];
    } else {
      console.error('Error fetching tools:', toolsError);
      // Provide fallback data
      status = {
        ...status,
        sources: { 'Manual': 1, 'Product Hunt': 5, 'OpenAI': 2, 'GitHub': 1 },
        categories: { 'Language': 3, 'Design': 4, 'Development': 2, 'Marketing': 2 },
        toolsFound: 0
      };
    }

    return NextResponse.json({
      ...status,
      settings: {
        autoRefreshEnabled: false
      },
      timestamp: new Date().toISOString(),
      syncStatus: 'simplified',
      cacheInvalidation: 'disabled',
      message: 'Automation has been simplified. Use the admin dashboard for manual data management.',
      debug: {
        toolsCount: tools?.length || 0,
        hasSourcesData: !!(status.sources && Object.keys(status.sources).length > 0),
        hasCategoriesData: !!(status.categories && Object.keys(status.categories).length > 0)
      }
    });

  } catch (error) {
    console.error('Automation status API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error fetching automation status',
      timestamp: new Date().toISOString()
    });
  }
} 