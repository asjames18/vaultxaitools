require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateSchema() {
  console.log('🔧 Updating tools table schema...');
  
  try {
    // Add missing columns one by one
    const columnsToAdd = [
      {
        name: 'use_cases',
        type: 'jsonb',
        description: 'Use cases with prompts and descriptions'
      },
      {
        name: 'quick_start',
        type: 'jsonb', 
        description: 'Quick start steps array'
      },
      {
        name: 'integrations',
        type: 'jsonb',
        description: 'Integration information array'
      }
    ];

    for (const column of columnsToAdd) {
      try {
        // Check if column already exists
        const { data: existing } = await supabase
          .from('tools')
          .select(column.name)
          .limit(1);
        
        if (existing !== null) {
          console.log(`✅ Column ${column.name} already exists`);
          continue;
        }
      } catch (error) {
        // Column doesn't exist, add it
        console.log(`➕ Adding column: ${column.name}`);
        
        // Note: We can't add columns directly via Supabase client
        // This would need to be done via SQL in the Supabase dashboard
        // For now, we'll skip columns that don't exist and modify our data
        console.log(`⚠️  Column ${column.name} needs to be added manually in Supabase dashboard`);
      }
    }

    console.log('\n📋 Schema update summary:');
    console.log('✅ Existing columns are ready');
    console.log('⚠️  New columns need to be added manually in Supabase dashboard:');
    console.log('   - use_cases (jsonb)');
    console.log('   - quick_start (jsonb)');
    console.log('   - integrations (jsonb)');
    
    console.log('\n💡 To add these columns:');
    console.log('1. Go to Supabase Dashboard > Table Editor > tools');
    console.log('2. Add the missing columns with jsonb type');
    console.log('3. Run the seeding script again');
    
  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
  }
}

// Run the schema update
updateSchema().catch(console.error);
