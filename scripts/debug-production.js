#!/usr/bin/env node

/**
 * Debug script to help identify production issues
 * Run this in production to check environment and database connectivity
 */

const { createClient } = require('@supabase/supabase-js');

async function debugProduction() {
  console.log('🔍 Production Debug Script');
  console.log('========================');
  
  // Check environment variables
  console.log('\n1. Environment Variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('\n❌ CRITICAL: Missing Supabase environment variables!');
    console.log('This will cause the app to crash in production.');
    return;
  }
  
  // Test Supabase connection
  console.log('\n2. Testing Supabase Connection:');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test basic connection
    const { data, error } = await supabase
      .from('tools')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Database connection successful');
      console.log('Tools table accessible');
    }
    
  } catch (err) {
    console.log('❌ Failed to create Supabase client:', err.message);
  }
  
  // Check for common production issues
  console.log('\n3. Common Production Issues:');
  
  // Check if running in production
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Running in production mode');
  } else {
    console.log('⚠️  Not running in production mode');
  }
  
  // Check for HTTPS in production
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
      console.log('✅ Supabase URL uses HTTPS');
    } else {
      console.log('⚠️  Supabase URL does not use HTTPS (may cause issues)');
    }
  }
  
  console.log('\n4. Recommendations:');
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('• Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
  } else {
    console.log('• Environment variables are properly configured');
    console.log('• Check Supabase project status and database permissions');
    console.log('• Verify RLS policies are correctly configured');
    console.log('• Check browser console for JavaScript errors');
  }
  
  console.log('\n🔍 Debug complete. Check the output above for issues.');
}

// Run the debug function
debugProduction().catch(console.error);
