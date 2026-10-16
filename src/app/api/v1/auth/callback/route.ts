import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/gbp/auth';
import { GoogleBusinessProfileClient } from '@/lib/gbp/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/onboarding?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ success: false, error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const client = new GoogleBusinessProfileClient(tokens.accessToken);
    const accounts = await client.listAccounts();
    const primaryAccount = accounts[0];
    const locations = primaryAccount ? await client.listLocations(primaryAccount.name) : [];

    // Return JSON or redirect with secure context
    return NextResponse.json({
      success: true,
      message: 'Google Business Profile connected successfully',
      tokens: {
        accessToken: tokens.accessToken,
        encryptedRefreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      },
      accounts,
      locations
    });
  } catch (err: any) {
    console.error('OAuth callback failed:', err);
    return NextResponse.json({ success: false, error: err.message || 'OAuth exchange failed' }, { status: 500 });
  }
}
