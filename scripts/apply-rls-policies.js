const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// RLS Policies for tools table
const toolsPolicies = [
  // Enable RLS
  'ALTER TABLE tools ENABLE ROW LEVEL SECURITY;',
  
  // Public read access
  `CREATE POLICY "Public read access" ON tools
   FOR SELECT USING (true);`,
  
  // Allow authenticated users to insert
  `CREATE POLICY "Authenticated users can insert" ON tools
   FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
  
  // Allow users to update their own tools
  `CREATE POLICY "Users can update own tools" ON tools
   FOR UPDATE USING (auth.uid()::text = user_name)
   WITH CHECK (auth.uid()::text = user_name);`,
  
  // Allow users to delete their own tools
  `CREATE POLICY "Users can delete own tools" ON tools
   FOR DELETE USING (auth.uid()::text = user_name);`
];

// RLS Policies for reviews table
const reviewsPolicies = [
  // Enable RLS
  'ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;',
  
  // Public read access
  `CREATE POLICY "Public read access" ON reviews
   FOR SELECT USING (true);`,
  
  // Allow authenticated users to insert
  `CREATE POLICY "Authenticated users can insert" ON reviews
   FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
  
  // Allow users to update their own reviews
  `CREATE POLICY "Users can update own reviews" ON reviews
   FOR UPDATE USING (auth.uid()::text = user_name)
   WITH CHECK (auth.uid()::text = user_name);`,
  
  // Allow users to delete their own reviews
  `CREATE POLICY "Users can delete own reviews" ON reviews
   FOR DELETE USING (auth.uid()::text = user_name);`
];

async function applyPolicies() {
  console.log('Applying RLS policies...');
  
  try {
    // Apply tools policies
    console.log('Applying tools table policies...');
    for (const policy of toolsPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`Policy already exists or error: ${error.message}`);
      } else {
        console.log('✓ Applied policy');
      }
    }
    
    // Apply reviews policies
    console.log('Applying reviews table policies...');
    for (const policy of reviewsPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`Policy already exists or error: ${error.message}`);
      } else {
        console.log('✓ Applied policy');
      }
    }
    
    console.log('✅ RLS policies applied successfully!');
  } catch (error) {
    console.error('Error applying policies:', error);
  }
}

applyPolicies(); 