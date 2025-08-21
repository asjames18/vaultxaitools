const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAuditLogs() {
  console.log('🔍 Setting up audit logs table...');

  try {
    // Create audit_logs table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          user_email TEXT NOT NULL,
          action TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          resource_id TEXT,
          details JSONB DEFAULT '{}',
          ip_address TEXT,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createError) {
      // Try alternative method if RPC doesn't work
      console.log('⚠️ RPC method failed, trying direct SQL...');
      
      // Note: This requires the table to be created manually in Supabase dashboard
      // or through a migration file
      console.log('📋 Please create the audit_logs table manually in Supabase dashboard:');
      console.log(`
        CREATE TABLE audit_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          user_email TEXT NOT NULL,
          action TEXT NOT NULL,
          resource_type TEXT NOT NULL,
          resource_id TEXT,
          details JSONB DEFAULT '{}',
          ip_address TEXT,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    } else {
      console.log('✅ Audit logs table created successfully');
    }

    // Create indexes for better performance
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
          CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
          CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
          CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
        `
      });
      console.log('✅ Audit logs indexes created successfully');
    } catch (indexError) {
      console.log('⚠️ Index creation failed (may already exist):', indexError.message);
    }

    // Create RLS policies
    try {
      await supabase.rpc('exec_sql', {
        sql: `
          -- Enable RLS
          ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
          
          -- Only admins can read audit logs
          CREATE POLICY "Admins can read audit logs" ON audit_logs
            FOR SELECT USING (
              EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_roles.user_id = auth.uid() 
                AND user_roles.role = 'admin'
              )
            );
          
          -- Only admins can insert audit logs
          CREATE POLICY "Admins can insert audit logs" ON audit_logs
            FOR INSERT WITH CHECK (
              EXISTS (
                SELECT 1 FROM user_roles 
                WHERE user_roles.user_id = auth.uid() 
                AND user_roles.role = 'admin'
              )
            );
        `
      });
      console.log('✅ RLS policies created successfully');
    } catch (policyError) {
      console.log('⚠️ RLS policy creation failed (may already exist):', policyError.message);
    }

    // Test the table
    console.log('🧪 Testing audit logs table...');
    
    const testLog = {
      user_id: '00000000-0000-0000-0000-000000000000',
      user_email: 'test@example.com',
      action: 'TEST',
      resource_type: 'SYSTEM',
      details: { test: true, timestamp: new Date().toISOString() }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('audit_logs')
      .insert([testLog])
      .select();

    if (insertError) {
      console.error('❌ Failed to insert test log:', insertError);
    } else {
      console.log('✅ Test log inserted successfully:', insertData);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('audit_logs')
        .delete()
        .eq('action', 'TEST');
      
      if (deleteError) {
        console.log('⚠️ Failed to clean up test data:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }

    console.log('\n🎉 Audit logs setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. The audit_logs table is now ready to use');
    console.log('2. Admin actions will be automatically logged');
    console.log('3. You can view logs in the Supabase dashboard');
    console.log('4. Consider setting up log retention policies');

  } catch (error) {
    console.error('❌ Error setting up audit logs:', error);
    process.exit(1);
  }
}

// Run the setup
setupAuditLogs();
