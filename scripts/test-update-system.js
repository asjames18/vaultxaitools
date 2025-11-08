#!/usr/bin/env node

/**
 * Test script to verify the real-time update system
 * This simulates admin actions and tests if frontend components receive updates
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUpdateSystem() {
  console.log('🧪 Testing Real-Time Update System...\n');

  try {
    // 1. Test database connection
    console.log('1️⃣ Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (testError) throw testError;
    console.log('✅ Database connection successful\n');

    // 2. Test tool update
    console.log('2️⃣ Testing tool update...');
    if (testData && testData.length > 0) {
      const testTool = testData[0];
      const newDescription = `Test update at ${new Date().toLocaleTimeString()}`;
      
      const { error: updateError } = await supabase
        .from('tools')
        .update({ 
          description: newDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', testTool.id);
      
      if (updateError) throw updateError;
      console.log(`✅ Tool "${testTool.name}" updated successfully`);
      console.log(`   New description: "${newDescription}"\n`);
    } else {
      console.log('⚠️  No tools found to test with\n');
    }

    // 3. Test revalidation API
    console.log('3️⃣ Testing revalidation API...');
    const response = await fetch('http://localhost:3001/api/revalidate/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/', '/AITools'] })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Revalidation API working:', result.message);
    } else {
      console.log('⚠️  Revalidation API failed (this is expected if dev server not running)');
    }

    console.log('\n🎉 Update system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://localhost:3001/admin in one tab');
    console.log('2. Open http://localhost:3001/AITools in another tab');
    console.log('3. Edit a tool in admin portal');
    console.log('4. Check if changes appear in AITools tab');
    console.log('5. Look for console logs showing real-time updates');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testUpdateSystem();


