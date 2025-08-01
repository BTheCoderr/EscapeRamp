import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization URL from QuickBooks
    const authUrl = quickBooksService.getAuthorizationUrl();
    
    // Redirect user to QuickBooks for authorization
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('QuickBooks auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate QuickBooks authorization' },
      { status: 500 }
    );
  }
} 