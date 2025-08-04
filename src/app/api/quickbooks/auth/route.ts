import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    console.log('QuickBooks Auth - Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      QUICKBOOKS_ENVIRONMENT: process.env.QUICKBOOKS_ENVIRONMENT,
      QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET' : 'NOT SET',
      QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI
    });

    // Get the authorization URL from QuickBooks
    const authUrl = quickBooksService.getAuthorizationUrl();
    
    console.log('QuickBooks Auth - Generated URL:', authUrl);
    
    // Redirect user to QuickBooks for authorization
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('QuickBooks auth error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initiate QuickBooks authorization',
        details: error instanceof Error ? error.message : 'Unknown error',
        environment: process.env.QUICKBOOKS_ENVIRONMENT,
        clientId: process.env.QUICKBOOKS_CLIENT_ID ? 'SET' : 'NOT SET'
      },
      { status: 500 }
    );
  }
} 