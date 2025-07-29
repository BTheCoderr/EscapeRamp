import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, TABLES } from '@/lib/supabase';

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
      .from(TABLES.MIGRATIONS)
      .select(`
        *,
        intake_responses (
          id,
          current_software,
          target_software,
          urgency,
          data_preservation_requirements,
          additional_notes,
          ai_summary,
          created_at
        ),
        files (
          id,
          filename,
          file_size,
          file_type,
          upload_status,
          created_at
        ),
        ai_analyses (
          id,
          analysis_type,
          content,
          metadata,
          created_at
        )
      `);

    if (migrationId) {
      query = query.eq('id', migrationId);
    } else if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: migrations, error } = await query;

    if (error) {
      console.error('Progress fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch migration progress' },
        { status: 500 }
      );
    }

    // Calculate progress for each migration
    const migrationsWithProgress = migrations?.map(migration => {
      const totalSteps = 4; // intake, files, analysis, completion
      let completedSteps = 0;
      
      // Check intake completion
      if (migration.intake_responses && migration.intake_responses.length > 0) {
        completedSteps++;
      }
      
      // Check file uploads
      if (migration.files && migration.files.length > 0) {
        completedSteps++;
      }
      
      // Check AI analysis
      if (migration.ai_analyses && migration.ai_analyses.length > 0) {
        completedSteps++;
      }
      
      // Check completion status
      if (migration.status === 'completed') {
        completedSteps++;
      }
      
      const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
      
      // Determine current step
      let currentStep = 'Getting Started';
      if (migration.status === 'completed') {
        currentStep = 'Migration Complete';
      } else if (migration.ai_analyses && migration.ai_analyses.length > 0) {
        currentStep = 'AI Analysis Complete';
      } else if (migration.files && migration.files.length > 0) {
        currentStep = 'Files Uploaded';
      } else if (migration.intake_responses && migration.intake_responses.length > 0) {
        currentStep = 'Intake Submitted';
      }
      
      // Estimate time remaining based on urgency and progress
      let estimatedTimeRemaining = null;
      if (migration.status !== 'completed') {
        const remainingSteps = totalSteps - completedSteps;
        const baseTimePerStep = 2; // days
        const urgencyMultipliers = {
          'low': 1.5,
          'medium': 1.0,
          'high': 0.7,
          'critical': 0.5
        } as const;
        const urgencyMultiplier = urgencyMultipliers[migration.urgency as keyof typeof urgencyMultipliers] || 1.0;
        
        const estimatedDays = Math.ceil(remainingSteps * baseTimePerStep * urgencyMultiplier);
        estimatedTimeRemaining = `${estimatedDays} day${estimatedDays !== 1 ? 's' : ''}`;
      }
      
      return {
        ...migration,
        progress: {
          percentage: progressPercentage,
          current_step: currentStep,
          completed_steps: completedSteps,
          total_steps: totalSteps,
          estimated_time_remaining: estimatedTimeRemaining,
        }
      };
    });

    return NextResponse.json({ 
      data: migrationsWithProgress,
      count: migrationsWithProgress?.length || 0
    });

  } catch (error) {
    console.error('Progress API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { migration_id, status, current_step, progress_percentage } = body;

    if (!migration_id) {
      return NextResponse.json(
        { error: 'Migration ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    // Update migration status if provided
    if (status) {
      const { error: migrationError } = await supabase
        .from(TABLES.MIGRATIONS)
        .update({ status })
        .eq('id', migration_id);

      if (migrationError) {
        console.error('Migration update error:', migrationError);
        return NextResponse.json(
          { error: 'Failed to update migration status' },
          { status: 500 }
        );
      }
    }

    // Update or create progress record
    const { error: progressError } = await supabase
      .from(TABLES.MIGRATION_PROGRESS)
      .upsert({
        migration_id,
        current_step: current_step || 'In Progress',
        progress_percentage: progress_percentage || 0,
        last_updated: new Date().toISOString(),
      });

    if (progressError) {
      console.error('Progress update error:', progressError);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Progress PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 