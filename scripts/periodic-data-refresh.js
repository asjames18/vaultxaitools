#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  refreshIntervalMinutes: 5, // Refresh every 5 minutes
  apiBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

// Utility function to format numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

// Calculate real-time statistics
async function calculateCurrentStats() {
  try {
    console.log('📊 Calculating current statistics...');
    
    // Get all tools
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');
    
    if (error) {
      console.error('Error fetching tools:', error);
      return null;
    }
    
    // Calculate stats
    const stats = {
      totalTools: tools.length,
      totalReviews: tools.reduce((sum, tool) => sum + (tool.review_count || 0), 0),
      totalUsers: tools.reduce((sum, tool) => sum + (tool.weekly_users || 0), 0),
      totalCategories: new Set(tools.map(tool => tool.category)).size,
      avgRating: tools.length > 0 
        ? tools.reduce((sum, tool) => sum + (tool.rating || 0), 0) / tools.length 
        : 0,
      lastUpdated: new Date().toISOString()
    };
    
    console.log(`📈 Current Statistics:`);
    console.log(`   🛠️ Tools: ${stats.totalTools}`);
    console.log(`   📝 Reviews: ${formatNumber(stats.totalReviews)}`);
    console.log(`   👥 Users: ${formatNumber(stats.totalUsers)}`);
    console.log(`   📂 Categories: ${stats.totalCategories}`);
    console.log(`   ⭐ Avg Rating: ${stats.avgRating.toFixed(1)}`);
    
    return stats;
    
  } catch (error) {
    console.error('Error calculating stats:', error);
    return null;
  }
}

// Update content cache to trigger frontend refresh
async function updateContentCache() {
  try {
    console.log('🔄 Updating content cache...');
    
    // Check if content_cache table exists first
    const { data: testData, error: testError } = await supabase
      .from('content_cache')
      .select('id')
      .limit(1);
    
    if (testError) {
      if (testError.message && testError.message.includes('does not exist')) {
        console.log('⚠️  content_cache table does not exist - skipping cache update');
        console.log('💡 Run: npm run fix:automation to create missing tables');
        return true; // Return true to continue with other operations
      } else {
        console.error('❌ Error checking content_cache table:', testError.message);
        return false;
      }
    }
    
    // Table exists, proceed with update
    const { error } = await supabase
      .from('content_cache')
      .upsert({
        content_type: 'tools',
        last_updated: new Date().toISOString(),
        updated_by: 'system'
      });
    
    if (error) {
      console.error('❌ Error updating content cache:', error.message);
      return false;
    }
    
    console.log('✅ Content cache updated successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in updateContentCache:', error.message);
    return false;
  }
}

// Send real-time update notification
async function sendRealtimeUpdate(stats) {
  try {
    console.log('📡 Sending real-time update...');
    
    await supabase
      .channel('stats-updates')
      .send({
        type: 'broadcast',
        event: 'stats-refresh',
        payload: {
          stats,
          timestamp: new Date().toISOString(),
          source: 'periodic-refresh'
        }
      });
    
    console.log('✅ Real-time update sent');
    
  } catch (error) {
    console.error('Error sending real-time update:', error);
  }
}

// Main refresh function
async function performDataRefresh() {
  console.log('🚀 Starting periodic data refresh...');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log('=' .repeat(50));
  
  try {
    // Calculate current stats
    const stats = await calculateCurrentStats();
    if (!stats) {
      console.error('❌ Failed to calculate statistics');
      return;
    }
    
    // Update content cache
    await updateContentCache();
    
    // Send real-time update
    await sendRealtimeUpdate(stats);
    
    console.log('\n🎉 Periodic data refresh completed successfully!');
    console.log(`🕒 Next refresh in ${config.refreshIntervalMinutes} minutes`);
    
  } catch (error) {
    console.error('❌ Error in periodic data refresh:', error);
  }
  
  console.log('=' .repeat(50));
}

// Check if running in continuous mode
const isContinuous = process.argv.includes('--continuous');

if (isContinuous) {
  console.log(`🔄 Starting continuous periodic refresh (every ${config.refreshIntervalMinutes} minutes)...`);
  
  // Initial refresh
  performDataRefresh();
  
  // Set up interval for continuous refresh
  setInterval(performDataRefresh, config.refreshIntervalMinutes * 60 * 1000);
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping periodic data refresh...');
    process.exit(0);
  });
  
} else {
  // Single refresh
  performDataRefresh().then(() => {
    process.exit(0);
  });
} 