import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In production, you'd revoke the tokens and clear them from your database
    // For demo purposes, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Disconnected from QuickBooks'
    });
    
  } catch (error) {
    console.error('Error disconnecting from QuickBooks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to disconnect from QuickBooks'
      },
      { status: 500 }
    );
  }
} 