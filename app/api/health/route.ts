import { NextResponse } from 'next/server';
import { createClientWithoutCookies } from '@/lib/supabase-server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };
    
    // Test database connection
    let dbStatus = { connected: false, error: null, toolsCount: 0 };
    
    try {
      if (envCheck.supabaseUrl && envCheck.supabaseKey) {
        const supabase = createClientWithoutCookies();
        const { data, error } = await supabase
          .from('tools')
          .select('id')
          .limit(1);
        
        if (error) {
          dbStatus.error = error.message;
        } else {
          dbStatus.connected = true;
          // Get total count
          const { count } = await supabase
            .from('tools')
            .select('*', { count: 'exact', head: true });
          dbStatus.toolsCount = count || 0;
        }
      }
    } catch (dbErr) {
      dbStatus.error = dbErr instanceof Error ? dbErr.message : 'Unknown database error';
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: envCheck,
      database: dbStatus,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };
    
    // Determine overall health status
    if (!envCheck.supabaseUrl || !envCheck.supabaseKey) {
      healthData.status = 'unhealthy';
      healthData.statusCode = 500;
    } else if (!dbStatus.connected) {
      healthData.status = 'degraded';
      healthData.statusCode = 503;
    } else {
      healthData.statusCode = 200;
    }
    
    return NextResponse.json(healthData, { 
      status: healthData.statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
} 