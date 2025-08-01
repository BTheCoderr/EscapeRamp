import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const realmId = searchParams.get('realmId');
    const state = searchParams.get('state');

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