import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, TABLES } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';

// Validation schema for intake form
const intakeSchema = z.object({
  user_email: z.string().email('Valid email is required'),
  software_used: z.string().min(1, 'Software used is required'),
  urgency_level: z.enum(['ASAP', '1-3 months', 'Just exploring']),
  pain_points: z.string().optional(),
  additional_notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = intakeSchema.parse(body);
    
    const supabase = createServerSupabaseClient();
    
    // Create intake form record
    const { data: intakeForm, error: intakeError } = await supabase
      .from('intake_form')
      .insert({
        user_email: validatedData.user_email,
        software_used: validatedData.software_used,
        urgency_level: validatedData.urgency_level,
        pain_points: validatedData.pain_points,
        additional_notes: validatedData.additional_notes,
      })
      .select()
      .single();

    if (intakeError) {
      console.error('Intake form creation error:', intakeError);
      return NextResponse.json(
        { error: 'Failed to save intake form' },
        { status: 500 }
      );
    }

    // Create migration status record
    const { data: migrationStatus, error: statusError } = await supabase
      .from('migration_status')
      .insert({
        intake_form_id: intakeForm.id,
        status: 'ready-for-review',
      })
      .select()
      .single();

    if (statusError) {
      console.error('Migration status creation error:', statusError);
      return NextResponse.json(
        { error: 'Failed to create migration status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thanks! You're on the list. We'll review your details and reach out shortly.",
      intake_form_id: intakeForm.id,
      migration_status_id: migrationStatus.id,
    });

  } catch (error) {
    console.error('Intake API error:', error);
    
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const intakeId = searchParams.get('intake_id');

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('intake_form')
      .select(`
        *,
        migration_status (
          id,
          status,
          assigned_specialist,
          estimated_completion_date
        )
      `);

    if (intakeId) {
      query = query.eq('id', intakeId);
    } else if (email) {
      query = query.eq('user_email', email);
    } else {
      // Return all intake forms (for admin purposes)
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Intake fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch intake forms' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Intake GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 