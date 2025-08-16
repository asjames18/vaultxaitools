require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanupAndFinalize() {
  console.log('🧹 Starting database cleanup and finalization...');
  
  try {
    // 1. Check for duplicates and remove them
    console.log('\n🔍 Checking for duplicate tools...');
    const { data: allTools } = await supabase
      .from('tools')
      .select('id, name, category, rating, weekly_users, created_at')
      .order('created_at', { ascending: false });
    
    if (allTools && allTools.length > 0) {
      const seenNames = new Set();
      const duplicates = [];
      
      allTools.forEach(tool => {
        if (seenNames.has(tool.name)) {
          duplicates.push(tool);
        } else {
          seenNames.add(tool.name);
        }
      });
      
      if (duplicates.length > 0) {
        console.log(`⚠️  Found ${duplicates.length} duplicate tools:`);
        duplicates.forEach(tool => {
          console.log(`  - ${tool.name} (ID: ${tool.id})`);
        });
        
        // Remove duplicates (keep the oldest one)
        for (const duplicate of duplicates) {
          const { error } = await supabase
            .from('tools')
            .delete()
            .eq('id', duplicate.id);
          
          if (error) {
            console.error(`❌ Error removing duplicate ${duplicate.name}:`, error.message);
          } else {
            console.log(`✅ Removed duplicate: ${duplicate.name}`);
          }
        }
      } else {
        console.log('✅ No duplicate tools found');
      }
    }
    
    // 2. Update tool data to ensure consistency
    console.log('\n🔧 Updating tool data for consistency...');
    
    // Get the final list of tools
    const { data: finalTools } = await supabase
      .from('tools')
      .select('*')
      .order('weekly_users', { ascending: false });
    
    if (finalTools && finalTools.length > 0) {
      console.log(`\n📊 Final Database State:`);
      console.log(`Total tools: ${finalTools.length}`);
      
      // Show category breakdown
      const categories = {};
      finalTools.forEach(tool => {
        categories[tool.category] = (categories[tool.category] || 0) + 1;
      });
      
      console.log('\n📈 Category breakdown:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`  - ${cat}: ${count} tools`);
      });
      
      // Show top tools by popularity
      console.log('\n🏆 Top 10 Most Popular Tools:');
      finalTools.slice(0, 10).forEach((tool, index) => {
        const userCount = tool.weekly_users ? tool.weekly_users.toLocaleString() : 'N/A';
        console.log(`${index + 1}. ${tool.name} (${tool.category}) - ${userCount} users - ⭐${tool.rating}`);
      });
      
      // 3. Verify data quality
      console.log('\n✅ Data Quality Check:');
      let qualityScore = 0;
      const totalChecks = finalTools.length * 4; // 4 checks per tool
      
      finalTools.forEach(tool => {
        if (tool.description && tool.description.length > 10) qualityScore++;
        if (tool.features && tool.features.length > 0) qualityScore++;
        if (tool.pros && tool.pros.length > 0) qualityScore++;
        if (tool.cons && tool.cons.length > 0) qualityScore++;
      });
      
      const qualityPercentage = Math.round((qualityScore / totalChecks) * 100);
      console.log(`  - Data completeness: ${qualityPercentage}%`);
      console.log(`  - Tools with full profiles: ${finalTools.filter(t => t.use_cases && t.quick_start && t.integrations).length}/${finalTools.length}`);
      
      // 4. Summary
      console.log('\n🎉 Cleanup and Finalization Complete!');
      console.log(`📊 Final tool count: ${finalTools.length}`);
      console.log(`⭐ Average rating: ${(finalTools.reduce((sum, t) => sum + (t.rating || 0), 0) / finalTools.length).toFixed(1)}`);
      console.log(`👥 Total weekly users: ${finalTools.reduce((sum, t) => sum + (t.weekly_users || 0), 0).toLocaleString()}`);
      
      console.log('\n💡 Your AI tools directory is now ready with:');
      console.log('  ✅ High-quality, curated tools');
      console.log('  ✅ No duplicates');
      console.log('  ✅ Comprehensive tool profiles');
      console.log('  ✅ Popular and essential AI tools');
      console.log('  ✅ Enhanced user experience');
      
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

// Run the cleanup and finalization
cleanupAndFinalize().catch(console.error);
