import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

// Helper function to get the correct redirect URI
const getRedirectUri = () => {
  // For server-side, check if we're in development context
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
    return 'http://localhost:3000/api/quickbooks/callback';
  }
  return process.env.QUICKBOOKS_REDIRECT_URI || 'https://escaperamp.vercel.app/api/quickbooks/callback';
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const state = searchParams.get('state');
    const test = searchParams.get('test');

    // Handle test requests
    if (test === 'true') {
      return NextResponse.json({
        status: 'Callback endpoint is working',
        environment: process.env.QUICKBOOKS_ENVIRONMENT,
        redirectUri: getRedirectUri(),
        timestamp: new Date().toISOString()
      });
    }

    if (!code || !realmId) {
      return NextResponse.json(
        { error: 'Missing authorization code or realm ID' },
        { status: 400 }
      );
    }

    // Construct the callback URL
    const callbackUrl = `${request.nextUrl.origin}/api/quickbooks/callback?code=${code}&realmId=${realmId}&state=${state}`;
    
    // Handle the OAuth callback
    const result = await quickBooksService.handleCallback(callbackUrl);

    // In production, you'd store these tokens securely in your database
    // For demo purposes, we'll redirect with success message
    const successUrl = `${request.nextUrl.origin}/dashboard?quickbooks=connected&realmId=${realmId}`;
    
    return NextResponse.redirect(successUrl);
    
  } catch (error) {
    console.error('QuickBooks callback error:', error);
    const errorUrl = `${request.nextUrl.origin}/dashboard?quickbooks=error`;
    return NextResponse.redirect(errorUrl);
  }
} 