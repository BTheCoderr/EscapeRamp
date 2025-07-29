import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient, TABLES } from '@/lib/supabase';
import { aiService } from '@/lib/ai-service';

const uploadSchema = z.object({
  migration_id: z.string().min(1, 'Migration ID is required'),
  filename: z.string().min(1, 'Filename is required'),
  file_size: z.number().positive('File size must be positive'),
  file_type: z.string().min(1, 'File type is required'),
  file_content: z.string().optional(), // For text-based files
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = uploadSchema.parse(body);
    
    const supabase = createServerSupabaseClient();
    
    // Check if migration exists
    const { data: migration, error: migrationError } = await supabase
      .from(TABLES.MIGRATIONS)
      .select('id, status')
      .eq('id', validatedData.migration_id)
      .single();

    if (migrationError || !migration) {
      return NextResponse.json(
        { error: 'Migration not found' },
        { status: 404 }
      );
    }

    // Generate file path (in production, you'd use actual file storage)
    const filePath = `migrations/${validatedData.migration_id}/${validatedData.filename}`;
    
    // Create file record
    const { data: file, error: fileError } = await supabase
      .from(TABLES.FILES)
      .insert({
        migration_id: validatedData.migration_id,
        filename: validatedData.filename,
        file_size: validatedData.file_size,
        file_type: validatedData.file_type,
        upload_status: 'uploaded',
        file_path: filePath,
      })
      .select()
      .single();

    if (fileError) {
      console.error('File creation error:', fileError);
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    // If file content is provided and it's a text-based file, analyze it with AI
    if (validatedData.file_content && isTextFile(validatedData.file_type)) {
      try {
        const analysis = await aiService.analyzeFile(
          validatedData.file_content,
          validatedData.filename
        );
        
        // Create AI analysis record
        await supabase
          .from(TABLES.AI_ANALYSES)
          .insert({
            migration_id: validatedData.migration_id,
            analysis_type: 'file_analysis',
            content: analysis,
            metadata: {
              file_id: file.id,
              filename: validatedData.filename,
              file_type: validatedData.file_type,
            },
          });

        // Update file status to processed
        await supabase
          .from(TABLES.FILES)
          .update({ upload_status: 'processed' })
          .eq('id', file.id);

      } catch (aiError) {
        console.error('File analysis failed:', aiError);
        // Continue without AI analysis
      }
    }

    return NextResponse.json({
      success: true,
      file_id: file.id,
      file_path: filePath,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    
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

    if (!migrationId) {
      return NextResponse.json(
        { error: 'Migration ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from(TABLES.FILES)
      .select('*')
      .eq('migration_id', migrationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Files fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Upload GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine if a file is text-based
function isTextFile(fileType: string): boolean {
  const textFileTypes = [
    '.txt', '.csv', '.json', '.xml', '.html', '.css', '.js', '.ts',
    '.md', '.log', '.sql', '.qbb', '.qbm', '.qbo'
  ];
  
  return textFileTypes.some(type => 
    fileType.toLowerCase().includes(type.toLowerCase())
  );
} 