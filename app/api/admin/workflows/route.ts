import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerSupabase } from '@/lib/supabase-server';
import { canAccessAdmin } from '@/lib/auth';
import { adminRateLimiter, sensitiveOperationRateLimiter } from '@/lib/rateLimit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = adminRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Require admin
  const supabaseUserClient = await createServerSupabase();
  const { data: { user } } = await supabaseUserClient.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = supabase
      .from('workflows')
      .select(`
        *,
        created_by,
        workflow_runs(count)
      `, { count: 'exact' });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by creation date
    query = query.order('created_at', { ascending: false });

    const { data: workflows, error, count } = await query;

    if (error) {
      console.error('Error fetching workflows:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workflows' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      workflows: workflows || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Workflows GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Require admin
  const supabaseUserClient = await createServerSupabase();
  const { data: { user } } = await supabaseUserClient.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, description, type, config, triggers, actions, conditions, schedule } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Create new workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .insert({
        name,
        description,
        type,
        config: config || {},
        triggers: triggers || [],
        actions: actions || [],
        conditions: conditions || [],
        schedule: schedule || {},
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workflow:', error);
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Workflow created successfully',
      workflow
    }, { status: 201 });

  } catch (error) {
    console.error('Workflows POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Require admin
  const supabaseUserClient = await createServerSupabase();
  const { data: { user } } = await supabaseUserClient.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Update workflow
    const { data: workflow, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workflow:', error);
      return NextResponse.json(
        { error: 'Failed to update workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Workflow updated successfully',
      workflow
    });

  } catch (error) {
    console.error('Workflows PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = sensitiveOperationRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  // Require admin
  const supabaseUserClient = await createServerSupabase();
  const { data: { user } } = await supabaseUserClient.auth.getUser();
  if (!user || !(await canAccessAdmin(user))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      );
    }

    // Delete workflow (this will cascade delete workflow_runs)
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workflow:', error);
      return NextResponse.json(
        { error: 'Failed to delete workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Workflow deleted successfully'
    });

  } catch (error) {
    console.error('Workflows DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
