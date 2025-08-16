require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabaseAlternatives() {
  console.log('🔍 Checking alternatives data in Supabase database...\n');

  try {
    // Get all tools with alternatives
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, category, alternatives')
      .not('alternatives', 'eq', null);

    if (error) {
      throw error;
    }

    if (!tools || tools.length === 0) {
      console.log('❌ No tools with alternatives found in database');
      return;
    }

    console.log(`📊 Found ${tools.length} tools with alternatives\n`);

    let issues = 0;
    let totalAlternatives = 0;
    let toolsWithIssues = [];

    tools.forEach(tool => {
      if (tool.alternatives && Array.isArray(tool.alternatives)) {
        totalAlternatives += tool.alternatives.length;
        
        // Check for self-references
        const selfReferences = tool.alternatives.filter(alt => 
          alt.name && alt.name.toLowerCase() === tool.name.toLowerCase()
        );
        
        // Check for duplicates
        const names = tool.alternatives.map(alt => alt.name).filter(Boolean);
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        
        if (selfReferences.length > 0 || duplicates.length > 0) {
          toolsWithIssues.push({
            id: tool.id,
            name: tool.name,
            category: tool.category,
            selfReferences: selfReferences.map(alt => alt.name),
            duplicates: duplicates
          });
          
          console.log(`❌ ${tool.name} (${tool.category}):`);
          if (selfReferences.length > 0) {
            console.log(`   Self-references: ${selfReferences.map(alt => alt.name).join(', ')}`);
            issues++;
          }
          if (duplicates.length > 0) {
            console.log(`   Duplicates: ${duplicates.join(', ')}`);
            issues++;
          }
        } else {
          console.log(`✅ ${tool.name} (${tool.category}): ${tool.alternatives.length} alternatives`);
        }
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total tools with alternatives: ${tools.length}`);
    console.log(`   Total alternatives: ${totalAlternatives}`);
    console.log(`   Issues found: ${issues}`);
    console.log(`   Tools with issues: ${toolsWithIssues.length}`);

    if (toolsWithIssues.length > 0) {
      console.log(`\n🔧 Tools that need fixing:`);
      toolsWithIssues.forEach(tool => {
        console.log(`   - ${tool.name} (${tool.category}) - ID: ${tool.id}`);
      });
      
      console.log(`\n💡 Next: We'll fix these issues and improve the alternatives data.`);
    } else {
      console.log(`\n🎉 All alternatives look good! No issues found.`);
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

checkDatabaseAlternatives().catch(console.error);
