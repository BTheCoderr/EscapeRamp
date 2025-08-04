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

    const invoices = await quickBooksService.getInvoices();
    
    return NextResponse.json({
      success: true,
      invoices: invoices
    });
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch invoices',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 