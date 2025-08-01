import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // For demo purposes, we'll simulate file upload
    // In production, you'd upload to Supabase Storage, AWS S3, etc.
    const fileName = file.name;
    const fileSize = file.size;
    
    // Simulate file processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a mock file URL (in production, this would be the actual uploaded file URL)
    const fileUrl = `https://example.com/uploads/${Date.now()}-${fileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      fileSize,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 