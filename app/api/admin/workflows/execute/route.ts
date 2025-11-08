import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, triggeredBy = 'manual', metadata = {} } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Get workflow details
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    if (!workflow.is_active) {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      );
    }

    // Create workflow run record
    const { data: run, error: runError } = await supabase
      .from('workflow_runs')
      .insert({
        workflow_id: workflowId,
        status: 'running',
        triggered_by: triggeredBy,
        metadata
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating workflow run:', runError);
      return NextResponse.json(
        { error: 'Failed to start workflow execution' },
        { status: 500 }
      );
    }

    // Execute workflow (this would be the actual workflow engine)
    try {
      const result = await executeWorkflow(workflow, metadata);
      
      // Update run record with success
      await supabase
        .from('workflow_runs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - new Date(run.started_at).getTime(),
          result
        })
        .eq('id', run.id);

      // Update workflow statistics
      await supabase
        .from('workflows')
        .update({
          last_run: new Date().toISOString(),
          run_count: workflow.run_count + 1,
          success_count: workflow.success_count + 1
        })
        .eq('id', workflowId);

      return NextResponse.json({
        message: 'Workflow executed successfully',
        runId: run.id,
        result
      });

    } catch (executionError) {
      // Update run record with error
      await supabase
        .from('workflow_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - new Date(run.started_at).getTime(),
          error_message: executionError instanceof Error ? executionError.message : 'Unknown error'
        })
        .eq('id', run.id);

      // Update workflow statistics
      await supabase
        .from('workflows')
        .update({
          last_run: new Date().toISOString(),
          run_count: workflow.run_count + 1,
          error_count: workflow.error_count + 1
        })
        .eq('id', workflowId);

      return NextResponse.json(
        { error: 'Workflow execution failed', details: executionError instanceof Error ? executionError.message : 'Unknown error' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock workflow execution function
// In a real implementation, this would be a sophisticated workflow engine
async function executeWorkflow(workflow: any, metadata: any) {
  console.log(`Executing workflow: ${workflow.name}`);
  
  // Simulate workflow execution time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Process workflow steps based on config
  const { config, triggers, actions, conditions } = workflow;
  
  // Mock execution result
  const result = {
    executed_at: new Date().toISOString(),
    steps_completed: config.steps?.length || 0,
    actions_executed: actions?.length || 0,
    conditions_met: conditions?.length || 0,
    metadata,
    workflow_config: config
  };

  // Simulate some random success/failure scenarios
  if (Math.random() < 0.1) {
    throw new Error('Simulated workflow execution failure');
  }

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Get workflow execution history
    let query = supabase
      .from('workflow_runs')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false });

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: runs, error, count } = await query;

    if (error) {
      console.error('Error fetching workflow runs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workflow runs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      runs: runs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Workflow runs GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
