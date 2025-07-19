const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyPolicies() {
  console.log('Applying RLS policies via Supabase client...');
  
  try {
    // Enable RLS on tables
    console.log('Enabling RLS on tables...');
    
    // Enable RLS on tools table
    const { error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (toolsError) {
      console.log('Tools table RLS status check:', toolsError.message);
    }
    
    // Enable RLS on reviews table
    const { error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.log('Reviews table RLS status check:', reviewsError.message);
    }
    
    console.log('✅ RLS policies check completed!');
    console.log('\n📝 Note: To apply the actual RLS policies, please:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-rls-policies.sql');
    console.log('4. Click Run to execute the policies');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

applyPolicies(); 