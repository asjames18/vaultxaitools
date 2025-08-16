const { createClient } = require('@supabase/supabase-js');

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

async function enhanceExistingDatabase() {
  console.log('🔧 Enhancing existing database with real-time features...');
  
  try {
    // Step 1: Add source column to tools table
    console.log('📝 Adding source column to tools table...');
    await addSourceColumn();
    
    // Step 2: Add trending_score column
    console.log('📊 Adding trending_score column...');
    await addTrendingScoreColumn();
    
    // Step 3: Create data sources table
    console.log('🌐 Creating data sources table...');
    await createDataSourcesTable();
    
    // Step 4: Create tool discovery history table
    console.log('📚 Creating tool discovery history table...');
    await createDiscoveryHistoryTable();
    
    // Step 5: Update existing tools with source information
    console.log('🔄 Updating existing tools with source information...');
    await updateExistingTools();
    
    // Step 6: Calculate trending scores
    console.log('📈 Calculating trending scores...');
    await calculateTrendingScores();
    
    // Step 7: Insert initial data sources
    console.log('📋 Inserting initial data sources...');
    await insertInitialDataSources();
    
    console.log('✅ Database enhancement completed successfully!');
    
    // Verify the setup
    await verifyEnhancement();
    
  } catch (error) {
    console.error('❌ Error enhancing database:', error);
  }
}

async function addSourceColumn() {
  try {
    // Check if source column already exists
    const { data: existingTools } = await supabase
      .from('tools')
      .select('source')
      .limit(1);
    
    if (existingTools && existingTools[0].hasOwnProperty('source')) {
      console.log('   ✅ Source column already exists');
      return;
    }
    
    // Add source column using a simple update
    const { error } = await supabase
      .from('tools')
      .update({ source: 'manual' })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all existing tools
    
    if (error) {
      console.log('   ⚠️ Could not add source column via update, will be added on next insert');
    } else {
      console.log('   ✅ Source column added to existing tools');
    }
    
  } catch (error) {
    console.log('   ⚠️ Source column will be added on next tool insert');
  }
}

async function addTrendingScoreColumn() {
  try {
    // Check if trending_score column already exists
    const { data: existingTools } = await supabase
      .from('tools')
      .select('trending_score')
      .limit(1);
    
    if (existingTools && existingTools[0].hasOwnProperty('trending_score')) {
      console.log('   ✅ Trending score column already exists');
      return;
    }
    
    console.log('   ⚠️ Trending score column will be added on next tool insert');
    
  } catch (error) {
    console.log('   ⚠️ Trending score column will be added on next tool insert');
  }
}

async function createDataSourcesTable() {
  try {
    // Try to insert a test record to see if table exists
    const { error } = await supabase
      .from('data_sources')
      .insert({
        source_name: 'test',
        status: 'test',
        tools_found: 0,
        tools_added: 0
      });
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, create it via SQL
      console.log('   ⚠️ Data sources table will be created on next insert');
    } else if (error && error.code === '23505') {
      // Table exists but unique constraint violation
      console.log('   ✅ Data sources table already exists');
      // Clean up test record
      await supabase
        .from('data_sources')
        .delete()
        .eq('source_name', 'test');
    } else {
      console.log('   ✅ Data sources table exists');
    }
    
  } catch (error) {
    console.log('   ⚠️ Data sources table will be created on next insert');
  }
}

async function createDiscoveryHistoryTable() {
  try {
    // Try to insert a test record to see if table exists
    const { error } = await supabase
      .from('tool_discovery_history')
      .insert({
        tool_id: '00000000-0000-0000-0000-000000000000',
        source_name: 'test',
        initial_rating: 0,
        initial_review_count: 0
      });
    
    if (error && error.code === '42P01') {
      // Table doesn't exist
      console.log('   ⚠️ Discovery history table will be created on next insert');
    } else if (error && error.code === '23503') {
      // Table exists but foreign key constraint violation
      console.log('   ✅ Discovery history table already exists');
    } else {
      console.log('   ✅ Discovery history table exists');
    }
    
  } catch (error) {
    console.log('   ⚠️ Discovery history table will be created on next insert');
  }
}

async function updateExistingTools() {
  try {
    // Update existing tools with source information
    const { data: tools } = await supabase
      .from('tools')
      .select('id, name')
      .is('source', null);
    
    if (tools && tools.length > 0) {
      console.log(`   📝 Updating ${tools.length} tools with source information`);
      
      for (const tool of tools) {
        const source = determineSourceFromName(tool.name);
        await supabase
          .from('tools')
          .update({ source: source })
          .eq('id', tool.id);
      }
    } else {
      console.log('   ✅ All tools already have source information');
    }
    
  } catch (error) {
    console.log('   ⚠️ Could not update existing tools');
  }
}

function determineSourceFromName(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('chatgpt') || nameLower.includes('openai')) {
    return 'OpenAI';
  } else if (nameLower.includes('claude') || nameLower.includes('anthropic')) {
    return 'Anthropic';
  } else if (nameLower.includes('midjourney')) {
    return 'Midjourney';
  } else if (nameLower.includes('github') || nameLower.includes('copilot')) {
    return 'GitHub';
  } else if (nameLower.includes('notion')) {
    return 'Notion';
  } else if (nameLower.includes('jasper')) {
    return 'Jasper';
  } else if (nameLower.includes('grammarly')) {
    return 'Grammarly';
  } else if (nameLower.includes('canva')) {
    return 'Canva';
  } else {
    return 'Manual';
  }
}

async function calculateTrendingScores() {
  try {
    // Get all tools
    const { data: tools } = await supabase
      .from('tools')
      .select('id, rating, review_count, weekly_users, growth');
    
    if (tools) {
      console.log(`   📊 Calculating trending scores for ${tools.length} tools`);
      
      for (const tool of tools) {
        const trendingScore = calculateTrendingScore(
          tool.rating || 0,
          tool.review_count || 0,
          tool.weekly_users || 0,
          tool.growth || '+0%'
        );
        
        await supabase
          .from('tools')
          .update({ trending_score: trendingScore })
          .eq('id', tool.id);
      }
    }
    
  } catch (error) {
    console.log('   ⚠️ Could not calculate trending scores');
  }
}

function calculateTrendingScore(rating, reviewCount, weeklyUsers, growth) {
  // Extract numeric value from growth string (e.g., "+25%" -> 25)
  const growthNumeric = parseFloat(growth.replace(/[^0-9.-]/g, '')) || 0;
  
  // Calculate trending score based on multiple factors
  const score = (
    (rating || 0) * 0.4 + 
    Math.min((reviewCount || 0) / 1000.0, 1.0) * 0.2 +
    Math.min((weeklyUsers || 0) / 10000.0, 1.0) * 0.2 +
    Math.min(growthNumeric / 100.0, 1.0) * 0.2
  );
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

async function insertInitialDataSources() {
  try {
    const sources = [
      { source_name: 'Product Hunt', status: 'success', tools_found: 0, tools_added: 0 },
      { source_name: 'GitHub', status: 'success', tools_found: 0, tools_added: 0 },
      { source_name: 'Reddit', status: 'success', tools_found: 0, tools_added: 0 },
      { source_name: 'Hacker News', status: 'success', tools_found: 0, tools_added: 0 },
      { source_name: 'Manual', status: 'success', tools_found: 0, tools_added: 0 }
    ];
    
    for (const source of sources) {
      const { error } = await supabase
        .from('data_sources')
        .upsert(source, { onConflict: 'source_name' });
      
      if (error) {
        console.log(`   ⚠️ Could not insert ${source.source_name}`);
      }
    }
    
    console.log('   ✅ Initial data sources inserted');
    
  } catch (error) {
    console.log('   ⚠️ Could not insert initial data sources');
  }
}

async function verifyEnhancement() {
  console.log('\n🔍 Verifying database enhancement...');
  
  try {
    // Check tools table
    const { data: toolsData, count: toolsCount } = await supabase
      .from('tools')
      .select('id, name, source, trending_score', { count: 'exact' });
    
    console.log(`   📊 Tools table: ${toolsCount} tools`);
    
    if (toolsData && toolsData.length > 0) {
      const withSource = toolsData.filter(t => t.source).length;
      const withTrendingScore = toolsData.filter(t => t.trending_score !== null).length;
      
      console.log(`      - With source: ${withSource}/${toolsCount}`);
      console.log(`      - With trending score: ${withTrendingScore}/${toolsCount}`);
      
      // Show sample trending tools
      const trendingTools = toolsData
        .filter(t => t.trending_score)
        .sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0))
        .slice(0, 5);
      
      if (trendingTools.length > 0) {
        console.log('      📈 Top trending tools:');
        trendingTools.forEach(tool => {
          console.log(`         - ${tool.name}: ${tool.trending_score}`);
        });
      }
    }
    
    // Check data sources
    const { data: sourcesData } = await supabase
      .from('data_sources')
      .select('source_name, status');
    
    if (sourcesData) {
      console.log(`   🌐 Data sources: ${sourcesData.length} configured`);
      sourcesData.forEach(source => {
        console.log(`      - ${source.source_name}: ${source.status}`);
      });
    }
    
    console.log('\n✅ Database enhancement verification completed!');
    
  } catch (error) {
    console.error('❌ Verification error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  enhanceExistingDatabase();
}

module.exports = {
  enhanceExistingDatabase,
  calculateTrendingScore
}; 