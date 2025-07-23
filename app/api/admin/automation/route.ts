import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';

interface AutomationStatus {
  status: string;
  lastRun?: string;
  toolsFound?: number;
  sources?: Record<string, number>;
  categories?: Record<string, number>;
  summary?: {
    newTools: number;
    updatedTools: number;
    errors: number;
  };
}

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

    // Import child_process at the top for spawn functionality
    const { spawn: spawnProcess } = await import('child_process');

    // Get request body
    const body = await request.json();
    const { action, config } = body;

    switch (action) {
      case 'run-automation':
        // Import and run combined automation
        const { runCombinedAutomation } = await import('../../../../scripts/combined-automation.js');
        
        // Run automation in background
        runCombinedAutomation().catch(error => {
          console.error('Automation error:', error);
        });

        return NextResponse.json({ 
          message: 'Automation started successfully',
          timestamp: new Date().toISOString()
        });

      case 'refresh-data':
        // Run data refresh script
        try {
          spawnProcess('node', ['scripts/periodic-data-refresh.js'], {
            detached: true,
            stdio: 'ignore'
          });
        } catch (error) {
          console.error('Error spawning data refresh process:', error);
        }

        return NextResponse.json({ 
          message: 'Data refresh triggered successfully',
          timestamp: new Date().toISOString()
        });

      case 'toggle-auto-refresh':
        // Handle auto-refresh toggle
        const enabled = config?.enabled || false;
        
        // Update automation settings in database
        const { error: updateError } = await supabase
          .from('automation_settings')
          .upsert({
            setting_key: 'auto_refresh_enabled',
            setting_value: enabled.toString(),
            updated_by: user.id,
            updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error('Error updating auto-refresh setting:', updateError);
        }

        // If enabling, start continuous refresh
        if (enabled) {
          spawnProcess('node', ['scripts/periodic-data-refresh.js', '--continuous'], {
            detached: true,
            stdio: 'ignore'
          });
        }

        return NextResponse.json({ 
          message: `Auto-refresh ${enabled ? 'enabled' : 'disabled'}`,
          enabled,
          timestamp: new Date().toISOString()
        });

      case 'get-automation-settings':
        // Get current automation settings
        const { data: settings, error: settingsError } = await supabase
          .from('automation_settings')
          .select('*');

        if (settingsError) {
          console.error('Error fetching automation settings:', settingsError);
        }

        return NextResponse.json({ 
          settings: settings || [],
          timestamp: new Date().toISOString()
        });

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

    // Get automation status from logs
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      // Read automation status from log files
      const automationReportPath = path.join(process.cwd(), 'logs', 'automation-report.json');
      const combinedReportPath = path.join(process.cwd(), 'logs', 'combined-automation-report.json');
      
             let status: AutomationStatus = { status: 'no-data' };
       
       // Try to read the most recent report
       try {
         const combinedReport = await fs.readFile(combinedReportPath, 'utf8');
         const combinedData = JSON.parse(combinedReport);
         
         if (combinedData) {
           status = {
             status: 'completed',
             lastRun: combinedData.timestamp,
             toolsFound: combinedData.tools?.count || 0,
             summary: {
               newTools: combinedData.tools?.count || 0,
               updatedTools: 0,
               errors: (combinedData.tools?.errors?.length || 0) + (combinedData.news?.errors?.length || 0)
             }
           };
         }
       } catch {
         // Fallback to automation report
         try {
           const automationReport = await fs.readFile(automationReportPath, 'utf8');
           const automationData = JSON.parse(automationReport);
           
           if (automationData) {
             status = {
               status: 'completed',
               lastRun: automationData.timestamp,
               toolsFound: automationData.toolsProcessed || 0,
               summary: {
                 newTools: automationData.toolsAdded || 0,
                 updatedTools: automationData.toolsUpdated || 0,
                 errors: automationData.errors?.length || 0
               }
             };
           }
         } catch {
           // No reports found
         }
       }

       // Get current database statistics
       const { data: tools, error: toolsError } = await supabase
         .from('tools')
         .select('category, created_at, source');
       
       if (!toolsError && tools) {
         // Calculate sources breakdown
         const sources: Record<string, number> = {};
         const categories: Record<string, number> = {};
         
         tools.forEach(tool => {
           const source = tool.source || 'Manual';
           sources[source] = (sources[source] || 0) + 1;
           
           const category = tool.category || 'Other';
           categories[category] = (categories[category] || 0) + 1;
         });

         status = {
           ...status,
           sources,
           categories,
           toolsFound: tools.length
         };
       }

      // Get automation settings
      const { data: settings } = await supabase
        .from('automation_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'auto_refresh_enabled')
        .single();

      return NextResponse.json({
        ...status,
        settings: {
          autoRefreshEnabled: settings?.setting_value === 'true' || false
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error reading automation logs:', error);
      return NextResponse.json({
        status: 'no-data',
        message: 'No automation data available',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Automation status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 