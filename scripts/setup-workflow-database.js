const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupWorkflowDatabase() {
  console.log('🚀 Setting up workflow database...');

  try {
    // Create workflows table
    console.log('📋 Creating workflows table...');
    const { error: workflowsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workflows (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          type VARCHAR(100) NOT NULL DEFAULT 'automation',
          status VARCHAR(50) NOT NULL DEFAULT 'draft',
          config JSONB NOT NULL DEFAULT '{}',
          triggers JSONB DEFAULT '[]',
          actions JSONB DEFAULT '[]',
          conditions JSONB DEFAULT '[]',
          schedule JSONB DEFAULT '{}',
          last_run TIMESTAMP WITH TIME ZONE,
          next_run TIMESTAMP WITH TIME ZONE,
          run_count INTEGER DEFAULT 0,
          success_count INTEGER DEFAULT 0,
          error_count INTEGER DEFAULT 0,
          created_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          is_active BOOLEAN DEFAULT true,
          version INTEGER DEFAULT 1
        );
      `
    });

    if (workflowsError) {
      console.error('❌ Error creating workflows table:', workflowsError);
      return;
    }

    // Create workflow_runs table for execution history
    console.log('📊 Creating workflow_runs table...');
    const { error: runsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workflow_runs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL,
          started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          duration_ms INTEGER,
          result JSONB DEFAULT '{}',
          error_message TEXT,
          triggered_by VARCHAR(100) DEFAULT 'manual',
          metadata JSONB DEFAULT '{}'
        );
      `
    });

    if (runsError) {
      console.error('❌ Error creating workflow_runs table:', runsError);
      return;
    }

    // Create workflow_templates table for reusable templates
    console.log('📝 Creating workflow_templates table...');
    const { error: templatesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workflow_templates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          config JSONB NOT NULL DEFAULT '{}',
          is_public BOOLEAN DEFAULT false,
          created_by UUID REFERENCES auth.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          usage_count INTEGER DEFAULT 0,
          rating DECIMAL(3,2) DEFAULT 0,
          tags TEXT[]
        );
      `
    });

    if (templatesError) {
      console.error('❌ Error creating workflow_templates table:', templatesError);
      return;
    }

    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
        CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
        CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows(created_by);
        CREATE INDEX IF NOT EXISTS idx_workflows_next_run ON workflows(next_run);
        CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
        CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
        CREATE INDEX IF NOT EXISTS idx_workflow_runs_started_at ON workflow_runs(started_at);
        CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
        CREATE INDEX IF NOT EXISTS idx_workflow_templates_is_public ON workflow_templates(is_public);
      `
    });

    if (indexesError) {
      console.error('❌ Error creating indexes:', indexesError);
      return;
    }

    // Create updated_at trigger function
    console.log('⚡ Creating updated_at trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `
    });

    if (triggerError) {
      console.error('❌ Error creating trigger function:', triggerError);
      return;
    }

    // Create triggers for updated_at
    console.log('🔗 Creating triggers...');
    const { error: triggersError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
        CREATE TRIGGER update_workflows_updated_at
          BEFORE UPDATE ON workflows
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_workflow_templates_updated_at ON workflow_templates;
        CREATE TRIGGER update_workflow_templates_updated_at
          BEFORE UPDATE ON workflow_templates
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (triggersError) {
      console.error('❌ Error creating triggers:', triggersError);
      return;
    }

    // Set up RLS policies
    console.log('🔒 Setting up RLS policies...');
    
    // Enable RLS on all tables
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
        ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
      return;
    }

    // Workflows policies
    const { error: workflowsPoliciesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Users can view their own workflows
        CREATE POLICY "Users can view own workflows" ON workflows
          FOR SELECT USING (auth.uid() = created_by);

        -- Users can insert their own workflows
        CREATE POLICY "Users can insert own workflows" ON workflows
          FOR INSERT WITH CHECK (auth.uid() = created_by);

        -- Users can update their own workflows
        CREATE POLICY "Users can update own workflows" ON workflows
          FOR UPDATE USING (auth.uid() = created_by);

        -- Users can delete their own workflows
        CREATE POLICY "Users can delete own workflows" ON workflows
          FOR DELETE USING (auth.uid() = created_by);

        -- Admins can view all workflows
        CREATE POLICY "Admins can view all workflows" ON workflows
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );

        -- Admins can manage all workflows
        CREATE POLICY "Admins can manage all workflows" ON workflows
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );
      `
    });

    if (workflowsPoliciesError) {
      console.error('❌ Error creating workflow policies:', workflowsPoliciesError);
      return;
    }

    // Workflow runs policies
    const { error: runsPoliciesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Users can view runs of their own workflows
        CREATE POLICY "Users can view own workflow runs" ON workflow_runs
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM workflows 
              WHERE id = workflow_runs.workflow_id 
              AND created_by = auth.uid()
            )
          );

        -- Users can insert runs for their own workflows
        CREATE POLICY "Users can insert own workflow runs" ON workflow_runs
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM workflows 
              WHERE id = workflow_runs.workflow_id 
              AND created_by = auth.uid()
            )
          );

        -- Admins can view all workflow runs
        CREATE POLICY "Admins can view all workflow runs" ON workflow_runs
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );
      `
    });

    if (runsPoliciesError) {
      console.error('❌ Error creating workflow runs policies:', runsPoliciesError);
      return;
    }

    // Workflow templates policies
    const { error: templatesPoliciesError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Users can view public templates
        CREATE POLICY "Users can view public templates" ON workflow_templates
          FOR SELECT USING (is_public = true);

        -- Users can view their own templates
        CREATE POLICY "Users can view own templates" ON workflow_templates
          FOR SELECT USING (auth.uid() = created_by);

        -- Users can insert their own templates
        CREATE POLICY "Users can insert own templates" ON workflow_templates
          FOR INSERT WITH CHECK (auth.uid() = created_by);

        -- Users can update their own templates
        CREATE POLICY "Users can update own templates" ON workflow_templates
          FOR UPDATE USING (auth.uid() = created_by);

        -- Users can delete their own templates
        CREATE POLICY "Users can delete own templates" ON workflow_templates
          FOR DELETE USING (auth.uid() = created_by);

        -- Admins can view all templates
        CREATE POLICY "Admins can view all templates" ON workflow_templates
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );

        -- Admins can manage all templates
        CREATE POLICY "Admins can manage all templates" ON workflow_templates
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles 
              WHERE user_id = auth.uid() AND role = 'admin'
            )
          );
      `
    });

    if (templatesPoliciesError) {
      console.error('❌ Error creating template policies:', templatesPoliciesError);
      return;
    }

    // Insert some sample workflow templates
    console.log('📚 Inserting sample workflow templates...');
    const { error: sampleError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO workflow_templates (name, description, category, config, is_public, tags) VALUES
        (
          'Content Review Workflow',
          'Automated workflow for reviewing and approving content before publication',
          'content-management',
          '{"steps": ["draft", "review", "approve", "publish"], "approvers": ["editor", "manager"]}',
          true,
          ARRAY['content', 'approval', 'workflow']
        ),
        (
          'Data Quality Check',
          'Automated data validation and quality assurance workflow',
          'data-management',
          '{"steps": ["validate", "clean", "verify", "report"], "thresholds": {"quality": 0.9}}',
          true,
          ARRAY['data', 'quality', 'validation']
        ),
        (
          'User Onboarding',
          'Automated user onboarding and activation workflow',
          'user-management',
          '{"steps": ["welcome", "tutorial", "verification", "activation"], "timeout": "24h"}',
          true,
          ARRAY['onboarding', 'user', 'activation']
        )
        ON CONFLICT DO NOTHING;
      `
    });

    if (sampleError) {
      console.error('❌ Error inserting sample templates:', sampleError);
      return;
    }

    console.log('✅ Workflow database setup completed successfully!');
    console.log('📊 Tables created: workflows, workflow_runs, workflow_templates');
    console.log('🔒 RLS policies configured for security');
    console.log('📚 Sample templates added');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run the setup
setupWorkflowDatabase();
