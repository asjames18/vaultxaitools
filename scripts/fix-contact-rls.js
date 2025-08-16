#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role (admin access)
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function fixContactRLS() {
  console.log('🔧 Fixing RLS Policies for contact_messages table...');
  
  try {
    // First, let's check if the table exists and what policies are currently applied
    console.log('📋 Checking current table status...');
    
    // Test if we can insert a contact message as service role
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message for RLS testing',
      status: 'new'
    };

    console.log('🧪 Testing service role insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([testData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Service role insert failed:', insertError);
    } else {
      console.log('✅ Service role insert successful:', insertData.id);
      
      // Clean up test data
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test data cleaned up');
    }

    // Now let's fix the RLS policies
    console.log('🔧 Applying proper RLS policies...');
    
    const policies = [
      // Drop existing policies first
      'DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;',
      'DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON contact_messages;',
      
      // Create new policies
      'CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);',
      'CREATE POLICY "Admins can view and manage contact messages" ON contact_messages FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = \'admin\'));',
      'CREATE POLICY "Service role full access" ON contact_messages FOR ALL USING (auth.role() = \'service_role\');'
    ];

    for (const policy of policies) {
      console.log(`📝 Applying: ${policy.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      
      if (error) {
        console.log('⚠️  Could not apply policy via RPC, please run manually in SQL Editor');
        console.log(`SQL: ${policy}`);
      } else {
        console.log('✅ Policy applied successfully');
      }
    }

    // Test the fix with anon client
    console.log('🧪 Testing anon client access...');
    const { createClient: createAnonClient } = require('@supabase/supabase-js');
    const anonSupabase = createAnonClient(
      config.supabaseUrl, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const testAnonData = {
      name: 'Anon Test User',
      email: 'anon@example.com',
      subject: 'Anon Test Subject',
      message: 'Test message from anon client',
      status: 'new'
    };

    const { data: anonInsertData, error: anonInsertError } = await anonSupabase
      .from('contact_messages')
      .insert([testAnonData])
      .select()
      .single();

    if (anonInsertError) {
      console.error('❌ Anon insert still failing:', anonInsertError);
      console.log('');
      console.log('📋 Please run this SQL in your Supabase SQL Editor:');
      console.log(`
-- Fix contact_messages RLS policies
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON contact_messages;

CREATE POLICY "Anyone can create contact messages" ON contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages" ON contact_messages 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Service role full access" ON contact_messages 
FOR ALL USING (auth.role() = 'service_role');
      `);
    } else {
      console.log('✅ Anon insert successful!');
      
      // Clean up test data
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', anonInsertData.id);
      console.log('🧹 Anon test data cleaned up');
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// CLI interface
if (require.main === module) {
  fixContactRLS()
    .then(() => {
      console.log('🎉 Contact RLS fix completed!');
      console.log('');
      console.log('📊 Test the contact form now: http://localhost:3000/contact');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Contact RLS fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixContactRLS };
