import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userRole = await getUserRole(user);
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request body
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'run-automation':
        // Import and run automation
        const { runAutomation } = await import('@/scripts/ai-tools-automation');
        
        // Run automation in background
        runAutomation().catch(error => {
          console.error('Automation error:', error);
        });

        return NextResponse.json({ 
          message: 'Automation started successfully',
          timestamp: new Date().toISOString()
        });

      case 'get-status':
        // Get automation status from logs
        const fs = await import('fs/promises');
        const path = await import('path');
        
        try {
          const logPath = path.join(process.cwd(), 'logs', 'automation-report.json');
          const logData = await fs.readFile(logPath, 'utf-8');
          const report = JSON.parse(logData);
          
          return NextResponse.json({
            status: 'completed',
            lastRun: report.timestamp,
            toolsFound: report.totalTools,
            sources: report.sources,
            categories: report.categories
          });
        } catch (error) {
          return NextResponse.json({
            status: 'no-data',
            message: 'No automation data found'
          });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Automation API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userRole = await getUserRole(user);
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get automation status
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const logPath = path.join(process.cwd(), 'logs', 'automation-report.json');
      const logData = await fs.readFile(logPath, 'utf-8');
      const report = JSON.parse(logData);
      
      return NextResponse.json({
        status: 'completed',
        lastRun: report.timestamp,
        toolsFound: report.totalTools,
        sources: report.sources,
        categories: report.categories,
        summary: report.summary
      });
    } catch (error) {
      return NextResponse.json({
        status: 'no-data',
        message: 'No automation data found'
      });
    }

  } catch (error) {
    console.error('Automation status API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 