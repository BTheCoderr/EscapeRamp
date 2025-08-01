import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { parseQuickBooksExport, analyzeMigrationComplexity } from '@/lib/claude';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, filename } = await request.json();

    if (!fileUrl || !filename) {
      return NextResponse.json({ error: 'File URL and filename are required' }, { status: 400 });
    }

    // Create migration record
    const { data: migration, error: migrationError } = await supabase
      .from('migrations')
      .insert({
        user_id: user.id,
        filename,
        file_url: fileUrl,
        status: 'parsing'
      })
      .select('*')
      .single();

    if (migrationError) {
      console.error('Error creating migration:', migrationError);
      return NextResponse.json({ error: 'Failed to create migration record' }, { status: 500 });
    }

    try {
      // Fetch the file content
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
      }
      
      const exportContent = await fileResponse.text();

      // Parse with Claude
      const parseResult = await parseQuickBooksExport(exportContent);

      // Analyze complexity
      const complexityAnalysis = await analyzeMigrationComplexity(parseResult.entities);

      // Insert parsed entities
      const entitiesToInsert = parseResult.entities.map((entity, index) => ({
        migration_id: migration.id,
        entity_type: entity.entityType,
        legacy_id: entity.legacyId,
        name: entity.name,
        mapped_account: entity.mappedAccount,
        amount: entity.amount,
        date: entity.date,
        memo: entity.memo,
        notes: entity.notes,
        requires_review: entity.requiresReview,
        review_reason: entity.reviewReason,
        raw_json: entity,
        row_index: index
      }));

      const { error: insertError } = await supabase
        .from('qb_entities')
        .insert(entitiesToInsert);

      if (insertError) {
        console.error('Error inserting entities:', insertError);
        throw new Error('Failed to save parsed entities');
      }

      // Update migration with final status and analysis
      const { error: updateError } = await supabase
        .from('migrations')
        .update({
          status: parseResult.summary.requiresReview > 0 ? 'review_required' : 'parsed',
          total_rows: parseResult.summary.totalRows,
          requires_review_count: parseResult.summary.requiresReview
        })
        .eq('id', migration.id);

      if (updateError) {
        console.error('Error updating migration:', updateError);
      }

      return NextResponse.json({
        success: true,
        migrationId: migration.id,
        parseResult,
        complexityAnalysis
      });

    } catch (parseError) {
      // Update migration with error status
      await supabase
        .from('migrations')
        .update({
          status: 'error',
          error: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        })
        .eq('id', migration.id);

      throw parseError;
    }

  } catch (error) {
    console.error('Migration parse API error:', error);
    return NextResponse.json(
      { error: 'Failed to parse QuickBooks export' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerSupabaseClient(cookieStore);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const migrationId = searchParams.get('migrationId');

    if (!migrationId) {
      return NextResponse.json({ error: 'Migration ID is required' }, { status: 400 });
    }

    // Get migration details
    const { data: migration, error: migrationError } = await supabase
      .from('migrations')
      .select('*')
      .eq('id', migrationId)
      .eq('user_id', user.id)
      .single();

    if (migrationError || !migration) {
      return NextResponse.json({ error: 'Migration not found' }, { status: 404 });
    }

    // Get parsed entities
    const { data: entities, error: entitiesError } = await supabase
      .from('qb_entities')
      .select('*')
      .eq('migration_id', migrationId)
      .order('row_index');

    if (entitiesError) {
      console.error('Error fetching entities:', entitiesError);
      return NextResponse.json({ error: 'Failed to fetch parsed entities' }, { status: 500 });
    }

    return NextResponse.json({
      migration,
      entities,
      summary: {
        totalRows: entities.length,
        requiresReview: entities.filter(e => e.requires_review).length,
        entityTypes: entities.reduce((acc, entity) => {
          acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Migration get API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch migration data' },
      { status: 500 }
    );
  }
} 