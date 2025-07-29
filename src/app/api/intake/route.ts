import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, TABLES } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';

// Validation schema for intake form
const intakeSchema = z.object({
  current_software: z.string().min(1, 'Current software is required'),
  target_software: z.string().min(1, 'Target software is required'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  data_preservation_requirements: z.array(z.string()).min(1, 'At least one data requirement is needed'),
  additional_notes: z.string().optional(),
  user_id: z.string().min(1, 'User ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = intakeSchema.parse(body);
    
    const supabase = createServerSupabaseClient();
    
    // Create migration record
    const { data: migration, error: migrationError } = await supabase
      .from(TABLES.MIGRATIONS)
      .insert({
        user_id: validatedData.user_id,
        status: 'pending',
        source_software: validatedData.current_software,
        target_software: validatedData.target_software,
        urgency: validatedData.urgency,
        data_preservation_requirements: validatedData.data_preservation_requirements,
      })
      .select()
      .single();

    if (migrationError) {
      console.error('Migration creation error:', migrationError);
      return NextResponse.json(
        { error: 'Failed to create migration' },
        { status: 500 }
      );
    }

    // Create intake response record
    const { data: intakeResponse, error: intakeError } = await supabase
      .from(TABLES.INTAKE_RESPONSES)
      .insert({
        migration_id: migration.id,
        current_software: validatedData.current_software,
        target_software: validatedData.target_software,
        urgency: validatedData.urgency,
        data_preservation_requirements: validatedData.data_preservation_requirements,
        additional_notes: validatedData.additional_notes,
      })
      .select()
      .single();

    if (intakeError) {
      console.error('Intake response creation error:', intakeError);
      return NextResponse.json(
        { error: 'Failed to save intake response' },
        { status: 500 }
      );
    }

    // Trigger AI analysis
    try {
      const aiSummary = await aiService.analyzeIntake(intakeResponse);
      
      // Update intake response with AI summary
      await supabase
        .from(TABLES.INTAKE_RESPONSES)
        .update({ ai_summary: aiSummary })
        .eq('id', intakeResponse.id);

      // Create AI analysis record
      await supabase
        .from(TABLES.AI_ANALYSES)
        .insert({
          migration_id: migration.id,
          analysis_type: 'intake_summary',
          content: aiSummary,
        });

      // Generate migration plan
      const migrationPlan = await aiService.generateMigrationPlan(migration.id, aiSummary);
      
      await supabase
        .from(TABLES.AI_ANALYSES)
        .insert({
          migration_id: migration.id,
          analysis_type: 'migration_plan',
          content: migrationPlan,
        });

    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      // Continue without AI analysis - migration can still proceed
    }

    return NextResponse.json({
      success: true,
      migration_id: migration.id,
      intake_response_id: intakeResponse.id,
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
    const migrationId = searchParams.get('migration_id');
    const userId = searchParams.get('user_id');

    if (!migrationId && !userId) {
      return NextResponse.json(
        { error: 'Migration ID or User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from(TABLES.INTAKE_RESPONSES)
      .select(`
        *,
        migrations (
          id,
          status,
          source_software,
          target_software,
          urgency,
          data_preservation_requirements,
          created_at
        )
      `);

    if (migrationId) {
      query = query.eq('migration_id', migrationId);
    } else if (userId) {
      query = query.eq('migrations.user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Intake fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch intake responses' },
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