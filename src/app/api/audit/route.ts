import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET /api/audit - Fetch audit events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');
    const entityType = searchParams.get('entity_type');
    const entityId = searchParams.get('entity_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (action) {
      query = query.eq('action', action);
    }
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Audit events fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit events' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Audit GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/audit - Create audit event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, entity_type, entity_id, details, ip_address, user_agent } = body;

    if (!action || !entity_type) {
      return NextResponse.json(
        { error: 'Action and entity_type are required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get current user (in production, this would come from auth)
    const userId = '00000000-0000-0000-0000-000000000000'; // Demo user

    const { data: auditEvent, error } = await supabase
      .from('audit_events')
      .insert({
        user_id: userId,
        action,
        entity_type,
        entity_id,
        details,
        ip_address,
        user_agent,
      })
      .select()
      .single();

    if (error) {
      console.error('Audit event creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create audit event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: auditEvent,
    });

  } catch (error) {
    console.error('Audit POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 