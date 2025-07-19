const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  console.log('Checking table structure...');
  
  try {
    // Check tools table structure
    console.log('\n=== Tools Table Structure ===');
    const { data: toolsData, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);
    
    if (toolsError) {
      console.error('Error accessing tools table:', toolsError);
    } else if (toolsData && toolsData.length > 0) {
      console.log('Tools table columns:', Object.keys(toolsData[0]));
    } else {
      console.log('Tools table is empty or inaccessible');
    }
    
    // Check reviews table structure
    console.log('\n=== Reviews Table Structure ===');
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.error('Error accessing reviews table:', reviewsError);
    } else if (reviewsData && reviewsData.length > 0) {
      console.log('Reviews table columns:', Object.keys(reviewsData[0]));
    } else {
      console.log('Reviews table is empty or inaccessible');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableStructure(); 