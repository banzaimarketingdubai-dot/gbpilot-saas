import { NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/gbp/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || 'gbpilot_onboarding_state';
  const url = getGoogleOAuthUrl(state);

  return NextResponse.json({
    success: true,
    authUrl: url,
    scopes: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });
}
