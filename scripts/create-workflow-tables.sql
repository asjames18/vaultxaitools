-- Workflow Database Setup SQL
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Create workflows table
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

-- 2. Create workflow_runs table
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

-- 3. Create workflow_templates table
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

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON workflows(type);
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_workflows_next_run ON workflows(next_run);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow_id ON workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_started_at ON workflow_runs(started_at);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_is_public ON workflow_templates(is_public);

-- 5. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create triggers for updated_at
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

-- 7. Enable RLS on all tables
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for workflows
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own workflows" ON workflows
  FOR DELETE USING (auth.uid() = created_by);

-- 9. Create RLS policies for workflow_runs
CREATE POLICY "Users can view own workflow runs" ON workflow_runs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workflows 
      WHERE id = workflow_runs.workflow_id 
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workflow runs" ON workflow_runs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workflows 
      WHERE id = workflow_runs.workflow_id 
      AND created_by = auth.uid()
    )
  );

-- 10. Create RLS policies for workflow_templates
CREATE POLICY "Users can view public templates" ON workflow_templates
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own templates" ON workflow_templates
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own templates" ON workflow_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own templates" ON workflow_templates
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own templates" ON workflow_templates
  FOR DELETE USING (auth.uid() = created_by);

-- 11. Insert sample workflow templates
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

-- 12. Grant necessary permissions
GRANT ALL ON workflows TO authenticated;
GRANT ALL ON workflow_runs TO authenticated;
GRANT ALL ON workflow_templates TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Success message
SELECT 'Workflow database setup completed successfully!' as status;
