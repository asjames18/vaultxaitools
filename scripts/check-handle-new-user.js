#!/usr/bin/env node

// Check the handle_new_user function that might be causing signup issues
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function investigateHandleNewUser() {
  console.log('🔍 Investigating handle_new_user function...');
  
  try {
    // Check if the function exists and get its definition
    const { data: functions, error: funcError } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            p.proname as function_name,
            pg_get_functiondef(p.oid) as definition,
            p.prosrc as source_code
          FROM pg_proc p 
          JOIN pg_namespace n ON p.pronamespace = n.oid 
          WHERE n.nspname = 'public' 
          AND p.proname = 'handle_new_user';
        `
      })
      .single();
    
    if (funcError) {
      console.log('❌ Error checking function:', funcError.message);
      
      // Try alternative approach
      console.log('\n🔄 Trying alternative approach...');
      const { data: altCheck, error: altError } = await supabase
        .from('information_schema.routines')
        .select('*')
        .eq('routine_name', 'handle_new_user')
        .eq('routine_schema', 'public');
      
      if (altError) {
        console.log('❌ Alternative check failed:', altError.message);
      } else {
        console.log('✅ Function exists:', altCheck);
      }
    } else {
      console.log('✅ Function found!');
      console.log('Function definition:');
      console.log(functions.definition);
    }
    
    // Check for triggers that might use this function
    console.log('\n🔍 Checking for triggers...');
    const { data: triggers, error: trigError } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            t.tgname as trigger_name,
            c.relname as table_name,
            p.proname as function_name,
            t.tgtype
          FROM pg_trigger t
          JOIN pg_class c ON t.tgrelid = c.oid
          JOIN pg_proc p ON t.tgfoid = p.oid
          WHERE p.proname = 'handle_new_user';
        `
      });
    
    if (trigError) {
      console.log('❌ Error checking triggers:', trigError.message);
    } else {
      console.log('✅ Triggers using handle_new_user:');
      console.log(triggers);
    }
    
  } catch (error) {
    console.log('❌ Investigation failed:', error.message);
    
    // Try a simpler approach - just check if we can call the function
    console.log('\n🔄 Testing if function is callable...');
    try {
      const { data: testCall, error: testError } = await supabase
        .rpc('handle_new_user', {}, { head: true });
      
      if (testError) {
        console.log('❌ Function call test failed:', testError.message);
        console.log('This might be the source of the signup issue!');
      } else {
        console.log('✅ Function is callable');
      }
    } catch (callError) {
      console.log('❌ Function call exception:', callError.message);
    }
  }
}

// Also check other user-related functions
async function checkOtherFunctions() {
  console.log('\n🔍 Checking other user-related functions...');
  
  try {
    const { data: userFunctions, error } = await supabase
      .rpc('sql', {
        query: `
          SELECT 
            p.proname as function_name,
            n.nspname as schema_name
          FROM pg_proc p 
          JOIN pg_namespace n ON p.pronamespace = n.oid 
          WHERE p.proname ILIKE '%user%' 
          AND n.nspname IN ('public', 'auth')
          ORDER BY p.proname;
        `
      });
    
    if (error) {
      console.log('❌ Error checking user functions:', error.message);
    } else {
      console.log('✅ User-related functions:');
      userFunctions.forEach(func => {
        console.log(`  - ${func.schema_name}.${func.function_name}`);
      });
    }
  } catch (error) {
    console.log('❌ Failed to check user functions:', error.message);
  }
}

async function main() {
  console.log('🔍 INVESTIGATING USER SIGNUP FUNCTIONS');
  console.log('=====================================');
  
  await investigateHandleNewUser();
  await checkOtherFunctions();
  
  console.log('\n💡 ANALYSIS:');
  console.log('The handle_new_user function might be causing the signup failure.');
  console.log('If this function has errors or missing dependencies, it could');
  console.log('prevent new users from being saved to the database.');
  console.log('\nNext steps:');
  console.log('1. Check the function definition in Supabase SQL editor');
  console.log('2. Look for any errors in the function logic');
  console.log('3. Temporarily disable the trigger if needed');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
} else {
  main().catch(console.error);
}
