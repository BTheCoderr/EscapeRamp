import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/lib/quickbooks';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const realmId = searchParams.get('realmId');

    console.log('🔗 QuickBooks OAuth Callback Received:', {
      code: code ? `${code.substring(0, 10)}...` : 'None',
      state,
      realmId
    });

    if (!code) {
      console.error('❌ No authorization code received');
      return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));
    }

    // Exchange the authorization code for tokens
    try {
      const tokenData = await quickBooksService.handleCallback(request.url);
      
      console.log('✅ QuickBooks OAuth successful:', {
        realmId: tokenData.realmId,
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token
      });

      // Redirect to dashboard with success
      return NextResponse.redirect(new URL('/dashboard?success=quickbooks_connected', request.url));
      
    } catch (tokenError) {
      console.error('❌ Token exchange failed:', tokenError);
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }

  } catch (error) {
    console.error('❌ Callback error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=callback_error', request.url));
  }
}
