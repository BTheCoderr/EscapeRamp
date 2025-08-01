import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseQuickBooksExport } from '@/lib/claude';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, fileUrl } = await request.json();
    
    if (!userId || !fileUrl) {
      return NextResponse.json({ error: 'Missing userId or fileUrl' }, { status: 400 });
    }

    // Create migration record
    const { data: migration, error: insertError } = await supabase
      .from('migrations')
      .insert({ 
        user_id: userId, 
        filename: fileUrl,
        status: 'parsing'
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating migration:', insertError);
      return NextResponse.json({ error: 'Failed to create migration record' }, { status: 500 });
    }

    try {
      // Fetch the file content
      const exportText = await fetch(fileUrl).then((r) => r.text());
      
      // Parse with Claude using our existing function
      const parseResult = await parseQuickBooksExport(exportText);

      // Insert parsed entities
      const rows = parseResult.entities.map((row: any, index: number) => ({
        migration_id: migration.id,
        entity_type: row.entityType,
        legacy_id: row.legacyId,
        name: row.name,
        mapped_account: row.mappedAccount,
        amount: row.amount,
        date: row.date,
        memo: row.memo,
        notes: row.notes,
        requires_review: row.requiresReview,
        review_reason: row.reviewReason,
        raw_json: row,
        row_index: index
      }));

      const { error: insertEntitiesError } = await supabase
        .from('qb_entities')
        .insert(rows);

      if (insertEntitiesError) {
        console.error('Error inserting entities:', insertEntitiesError);
        throw new Error('Failed to save parsed entities');
      }

      // Update migration status
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
        ok: true,
        migrationId: migration.id,
        parseResult
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
    console.error('Parse API error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
} 