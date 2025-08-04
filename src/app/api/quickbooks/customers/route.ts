import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a mock realm ID
    // In production, you'd get this from the user's session
    const mockRealmId = 'sandbox-realm-123';
    
    // Initialize with mock tokens for demo
    // In production, you'd get these from your database
    quickBooksService.initialize(
      'mock-access-token',
      'mock-refresh-token', 
      mockRealmId
    );

    const customers = await quickBooksService.getCustomers();
    
    return NextResponse.json({
      success: true,
      customers: customers
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 