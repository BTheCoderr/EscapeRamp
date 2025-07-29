import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schemas
const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1, 'Category is required'),
  vendor: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).default('completed'),
  reference_number: z.string().optional(),
  notes: z.string().optional(),
});

const updateTransactionSchema = transactionSchema.partial();

// GET /api/transactions - Fetch transactions with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const vendor = searchParams.get('vendor');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('transactions')
      .select(`
        *,
        transaction_changes (
          id,
          field_name,
          old_value,
          new_value,
          changed_at,
          changed_by
        )
      `)
      .order('date', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('date', dateTo);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (vendor) {
      query = query.ilike('vendor', `%${vendor}%`);
    }
    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Transaction fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Transaction GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = transactionSchema.parse(body);
    
    const supabase = createServerSupabaseClient();

    // Get current user (in production, this would come from auth)
    const userId = '00000000-0000-0000-0000-000000000000'; // Demo user

    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        ...validatedData,
        user_id: userId,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Transaction creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Create audit event
    await supabase.rpc('create_audit_event', {
      p_user_id: userId,
      p_action: 'CREATE',
      p_entity_type: 'Transaction',
      p_entity_id: transaction.id,
      p_details: {
        amount: validatedData.amount,
        type: validatedData.type,
        category: validatedData.category,
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Transaction POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateTransactionSchema.parse(body);
    
    const supabase = createServerSupabaseClient();

    // Get current user (in production, this would come from auth)
    const userId = '00000000-0000-0000-0000-000000000000'; // Demo user

    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({
        ...validatedData,
        updated_by: userId,
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) {
      console.error('Transaction update error:', error);
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    // Create audit event
    await supabase.rpc('create_audit_event', {
      p_user_id: userId,
      p_action: 'UPDATE',
      p_entity_type: 'Transaction',
      p_entity_id: transactionId,
      p_details: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Transaction PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions - Delete transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get current user (in production, this would come from auth)
    const userId = '00000000-0000-0000-0000-000000000000'; // Demo user

    // Create audit event before deletion
    await supabase.rpc('create_audit_event', {
      p_user_id: userId,
      p_action: 'DELETE',
      p_entity_type: 'Transaction',
      p_entity_id: transactionId,
      p_details: { reason: 'User requested deletion' },
    });

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);

    if (error) {
      console.error('Transaction deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
    });

  } catch (error) {
    console.error('Transaction DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 