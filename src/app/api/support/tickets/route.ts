import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schemas
const createTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['migration', 'technical', 'billing', 'general']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  user_email: z.string().email('Valid email is required'),
});

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in-progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: z.string().optional(),
});

const messageSchema = z.object({
  ticket_id: z.string().uuid('Valid ticket ID is required'),
  message: z.string().min(1, 'Message is required'),
  sender: z.enum(['user', 'support']),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        messages (
          id,
          message,
          sender,
          timestamp,
          attachments
        )
      `)
      .order('created_at', { ascending: false });

    if (email) {
      query = query.eq('user_email', email);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data: tickets, error } = await query;

    if (error) {
      console.error('Error fetching tickets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tickets' },
        { status: 500 }
      );
    }

    return NextResponse.json({ tickets });

  } catch (error) {
    console.error('Tickets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTicketSchema.parse(body);
    
    const supabase = createServerSupabaseClient();
    
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        status: 'open',
        user_email: validatedData.user_email,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json(
        { error: 'Failed to create ticket' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Support ticket created successfully'
    });

  } catch (error) {
    console.error('Create ticket API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('id');
    
    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateTicketSchema.parse(body);
    
    const supabase = createServerSupabaseClient();
    
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(validatedData)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket:', error);
      return NextResponse.json(
        { error: 'Failed to update ticket' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: 'Ticket updated successfully'
    });

  } catch (error) {
    console.error('Update ticket API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 