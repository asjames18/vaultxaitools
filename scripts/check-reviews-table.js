const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkReviewsTable() {
  console.log('Checking reviews table...');
  
  try {
    // Try to get all reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*');
    
    if (reviewsError) {
      console.error('Error accessing reviews table:', reviewsError);
      
      // If table doesn't exist, let's create it
      if (reviewsError.message.includes('does not exist')) {
        console.log('Reviews table does not exist. Creating it...');
        await createReviewsTable();
      }
    } else {
      console.log('Reviews table exists with', reviewsData?.length || 0, 'records');
      if (reviewsData && reviewsData.length > 0) {
        console.log('Sample review columns:', Object.keys(reviewsData[0]));
        console.log('Sample review:', reviewsData[0]);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function createReviewsTable() {
  console.log('Creating reviews table...');
  
  // This would need to be done via SQL, but for now let's just show what we need
  console.log('You need to run this SQL in your Supabase dashboard:');
  console.log(`
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date TEXT NOT NULL,
    comment TEXT NOT NULL,
    helpful INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
  `);
}

checkReviewsTable(); 