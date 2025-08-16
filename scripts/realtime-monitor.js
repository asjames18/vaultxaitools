const { createClient } = require('@supabase/supabase-js');
const { fetchAllRealTimeData, startContinuousMonitoring } = require('./real-time-ai-data-fetcher');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Dashboard configuration
const DASHBOARD_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  maxHistoryItems: 50,
  sources: ['Product Hunt', 'GitHub', 'Reddit', 'Hacker News']
};

// Dashboard state
let dashboardState = {
  lastUpdate: new Date(),
  totalTools: 0,
  newToolsToday: 0,
  sourcesStatus: {},
  recentDiscoveries: [],
  trendingTools: [],
  systemStatus: 'idle'
};

// Function to get database statistics
async function getDatabaseStats() {
  try {
    // Get total tools count
    const { count: totalTools } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    // Get new tools today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: newToolsToday } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Get source status
    const { data: sourcesData } = await supabase
      .from('data_sources')
      .select('source_name, status, last_fetch, tools_found, tools_added');

    const sourcesStatus = {};
    sourcesData?.forEach(source => {
      sourcesStatus[source.source_name] = {
        status: source.status,
        lastFetch: source.last_fetch,
        toolsFound: source.tools_found,
        toolsAdded: source.tools_added
      };
    });

    return {
      totalTools: totalTools || 0,
      newToolsToday: newToolsToday || 0,
      sourcesStatus
    };

  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      totalTools: 0,
      newToolsToday: 0,
      sourcesStatus: {}
    };
  }
}

// Function to get recent discoveries
async function getRecentDiscoveries() {
  try {
    const { data } = await supabase
      .from('recently_discovered_tools')
      .select('*')
      .order('discovered_at', { ascending: false })
      .limit(DASHBOARD_CONFIG.maxHistoryItems);

    return data || [];

  } catch (error) {
    console.error('Error getting recent discoveries:', error);
    return [];
  }
}

// Function to get trending tools
async function getTrendingTools() {
  try {
    const { data } = await supabase
      .from('trending_tools')
      .select('name, logo, category, rating, trending_score, growth')
      .limit(10);

    return data || [];

  } catch (error) {
    console.error('Error getting trending tools:', error);
    return [];
  }
}

// Function to update data source status
async function updateDataSourceStatus(sourceName, status, toolsFound = 0, toolsAdded = 0) {
  try {
    const { error } = await supabase
      .from('data_sources')
      .upsert({
        source_name: sourceName,
        status: status,
        last_fetch: new Date().toISOString(),
        tools_found: toolsFound,
        tools_added: toolsAdded
      }, { onConflict: 'source_name' });

    if (error) {
      console.error(`Error updating ${sourceName} status:`, error);
    }

  } catch (error) {
    console.error(`Error updating ${sourceName} status:`, error);
  }
}

// Function to display dashboard
function displayDashboard() {
  console.clear();
  console.log('🤖 VaultX AI Tools - Real-Time Monitor');
  console.log('=' .repeat(50));
  console.log(`📅 Last Update: ${dashboardState.lastUpdate.toLocaleString()}`);
  console.log(`🔄 System Status: ${dashboardState.systemStatus}`);
  console.log('');

  // Database Statistics
  console.log('📊 Database Statistics');
  console.log(`   Total Tools: ${dashboardState.totalTools}`);
  console.log(`   New Tools Today: ${dashboardState.newToolsToday}`);
  console.log('');

  // Source Status
  console.log('🌐 Data Sources Status');
  DASHBOARD_CONFIG.sources.forEach(source => {
    const status = dashboardState.sourcesStatus[source];
    if (status) {
      const statusIcon = status.status === 'success' ? '✅' : '❌';
      const lastFetch = status.lastFetch ? new Date(status.lastFetch).toLocaleTimeString() : 'Never';
      console.log(`   ${statusIcon} ${source}: ${status.status} (Last: ${lastFetch})`);
      console.log(`      Tools Found: ${status.toolsFound}, Added: ${status.toolsAdded}`);
    } else {
      console.log(`   ⚪ ${source}: Not configured`);
    }
  });
  console.log('');

  // Trending Tools
  if (dashboardState.trendingTools.length > 0) {
    console.log('🔥 Trending Tools');
    dashboardState.trendingTools.slice(0, 5).forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.logo} ${tool.name} (${tool.category})`);
      console.log(`      Rating: ${tool.rating}/5.0 | Score: ${tool.trending_score} | Growth: ${tool.growth}`);
    });
    console.log('');
  }

  // Recent Discoveries
  if (dashboardState.recentDiscoveries.length > 0) {
    console.log('🆕 Recent Discoveries');
    dashboardState.recentDiscoveries.slice(0, 5).forEach(discovery => {
      const discoveredAt = new Date(discovery.discovered_at).toLocaleString();
      console.log(`   ${discovery.logo} ${discovery.name} (${discovery.source_name})`);
      console.log(`      Discovered: ${discoveredAt} | Rating: ${discovery.rating}/5.0`);
    });
    console.log('');
  }

  // Commands
  console.log('💡 Commands:');
  console.log('   [r] Refresh | [f] Fetch Now | [c] Continuous Mode | [q] Quit');
  console.log('');
}

// Function to refresh dashboard data
async function refreshDashboard() {
  try {
    dashboardState.systemStatus = 'refreshing';
    
    const [stats, discoveries, trending] = await Promise.all([
      getDatabaseStats(),
      getRecentDiscoveries(),
      getTrendingTools()
    ]);

    dashboardState = {
      ...dashboardState,
      ...stats,
      recentDiscoveries: discoveries,
      trendingTools: trending,
      lastUpdate: new Date(),
      systemStatus: 'idle'
    };

    displayDashboard();

  } catch (error) {
    console.error('Error refreshing dashboard:', error);
    dashboardState.systemStatus = 'error';
  }
}

// Function to start manual fetch
async function startManualFetch() {
  try {
    dashboardState.systemStatus = 'fetching';
    displayDashboard();

    console.log('🚀 Starting manual data fetch...');
    
    // Update source statuses to fetching
    for (const source of DASHBOARD_CONFIG.sources) {
      await updateDataSourceStatus(source, 'fetching');
    }

    // Start the fetch
    await fetchAllRealTimeData();

    // Update source statuses to success
    for (const source of DASHBOARD_CONFIG.sources) {
      await updateDataSourceStatus(source, 'success');
    }

    dashboardState.systemStatus = 'idle';
    await refreshDashboard();

  } catch (error) {
    console.error('Error in manual fetch:', error);
    dashboardState.systemStatus = 'error';
    
    // Update source statuses to error
    for (const source of DASHBOARD_CONFIG.sources) {
      await updateDataSourceStatus(source, 'error', 0, 0);
    }
  }
}

// Function to start continuous monitoring
function startContinuousMode() {
  console.log('🔄 Starting continuous monitoring mode...');
  console.log('Press Ctrl+C to stop');
  
  dashboardState.systemStatus = 'continuous';
  
  // Start continuous monitoring
  startContinuousMonitoring(5); // Check every 5 minutes
  
  // Set up dashboard refresh
  const refreshInterval = setInterval(refreshDashboard, DASHBOARD_CONFIG.refreshInterval);
  
  // Handle cleanup
  process.on('SIGINT', () => {
    clearInterval(refreshInterval);
    console.log('\n🛑 Continuous monitoring stopped');
    process.exit(0);
  });
}

// Function to handle user input
function handleUserInput(input) {
  switch (input.toLowerCase()) {
    case 'r':
      refreshDashboard();
      break;
    case 'f':
      startManualFetch();
      break;
    case 'c':
      startContinuousMode();
      break;
    case 'q':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('❓ Unknown command. Use [r], [f], [c], or [q]');
  }
}

// Function to start interactive mode
function startInteractiveMode() {
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Initial display
  displayDashboard();

  // Set up periodic refresh
  const refreshInterval = setInterval(refreshDashboard, DASHBOARD_CONFIG.refreshInterval);

  // Handle user input
  rl.on('line', (input) => {
    handleUserInput(input.trim());
  });

  // Handle cleanup
  rl.on('close', () => {
    clearInterval(refreshInterval);
    console.log('👋 Dashboard closed');
  });
}

// Function to run in non-interactive mode
async function runNonInteractive() {
  console.log('🤖 VaultX AI Tools - Real-Time Monitor (Non-Interactive)');
  console.log('=' .repeat(50));
  
  await refreshDashboard();
  
  // Set up periodic refresh
  setInterval(refreshDashboard, DASHBOARD_CONFIG.refreshInterval);
  
  console.log('📊 Dashboard will refresh every 30 seconds');
  console.log('Press Ctrl+C to stop');
  
  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n👋 Monitor stopped');
    process.exit(0);
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  try {
    // Check if database is set up
    const { data: toolsData } = await supabase
      .from('tools')
      .select('id')
      .limit(1);
    
    if (!toolsData) {
      console.log('⚠️ Database not set up. Running setup first...');
      const { setupRealtimeDatabase } = require('./setup-realtime-database');
      await setupRealtimeDatabase();
    }
    
    // Initial data load
    await refreshDashboard();
    
    // Start appropriate mode
    if (args.includes('--non-interactive') || args.includes('-n')) {
      await runNonInteractive();
    } else {
      startInteractiveMode();
    }
    
  } catch (error) {
    console.error('❌ Error starting monitor:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  refreshDashboard,
  startManualFetch,
  startContinuousMode,
  getDatabaseStats,
  getRecentDiscoveries,
  getTrendingTools
}; 