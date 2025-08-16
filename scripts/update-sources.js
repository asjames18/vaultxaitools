const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateToolsWithSource() {
  console.log('🔧 Updating tools with source information...');
  
  try {
    // Get all tools
    const { data: tools, error: fetchError } = await supabase
      .from('tools')
      .select('id, name, category');
    
    if (fetchError) {
      console.error('Error fetching tools:', fetchError);
      return;
    }
    
    console.log(`Found ${tools.length} tools to update`);
    
    const sourceMapping = {
      'ChatGPT': 'OpenAI',
      'Claude': 'Anthropic',  
      'Midjourney': 'Product Hunt',
      'GitHub Copilot': 'GitHub',
      'DALL-E': 'OpenAI',
      'Grammarly': 'Product Hunt',
      'Notion AI': 'Product Hunt',
      'Jasper': 'Product Hunt',
      'ElevenLabs': 'Product Hunt',
      'Perplexity': 'Product Hunt',
      'Otter.ai': 'Product Hunt',
      'Synthesia': 'Product Hunt',
      'Cursor': 'Product Hunt',
      'Google Bard': 'Google',
      'Microsoft Copilot': 'Microsoft',
      'Stable Diffusion': 'Stability AI'
    };
    
    let updatedCount = 0;
    
    for (const tool of tools) {
      const source = sourceMapping[tool.name] || 'Manual';
      
      try {
        // Try to update with source - if column doesn't exist, it will fail gracefully
        const { error: updateError } = await supabase
          .from('tools')
          .update({ source: source })
          .eq('id', tool.id);
        
        if (!updateError) {
          console.log(`✅ Updated ${tool.name} -> ${source}`);
          updatedCount++;
        } else {
          console.log(`⚠️ Could not update ${tool.name}: ${updateError.message}`);
        }
      } catch (err) {
        console.log(`⚠️ Error updating ${tool.name}: ${err.message}`);
      }
    }
    
    console.log(`\n📊 Updated ${updatedCount} tools with source information`);
    
    // Test the sources query
    console.log('\n🔍 Testing sources and categories query...');
    const { data: testTools, error: queryError } = await supabase
      .from('tools')
      .select('source, category, name');
    
    if (queryError) {
      console.error('Query error:', queryError);
      return;
    }
    
    if (testTools) {
      const sources = {};
      const categories = {};
      
      testTools.forEach(tool => {
        const source = tool.source || 'Unknown';
        const category = tool.category || 'Unknown';
        sources[source] = (sources[source] || 0) + 1;
        categories[category] = (categories[category] || 0) + 1;
      });
      
      console.log('✅ Sources breakdown:', sources);
      console.log('✅ Categories breakdown:', categories);
      
      // Show some sample tools
      console.log('\n📋 Sample tools with source/category:');
      testTools.slice(0, 5).forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.source || 'No source'} / ${tool.category || 'No category'}`);
      });
    }
    
  } catch (error) {
    console.error('Error updating tools:', error);
  }
}

// Run the function
updateToolsWithSource().catch(console.error); 