import { NextResponse } from 'next/server';

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gbpilot-saas-production.up.railway.app';

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  const code = reqUrl.searchParams.get('code');
  const state = reqUrl.searchParams.get('state') || `${reqUrl.protocol}//${reqUrl.host}`;
  const error = reqUrl.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard?auth=error&detail=${encodeURIComponent(error)}`, reqUrl.origin)
    );
  }

  if (code && !BACKEND_BASE.includes(reqUrl.host)) {
    const target = `${BACKEND_BASE.replace(/\/+$/, '')}/api/v1/auth/google/callback?code=${encodeURIComponent(
      code
    )}&state=${encodeURIComponent(state)}`;
    return NextResponse.redirect(target, 307);
  }

  return NextResponse.redirect(new URL('/dashboard?auth=success', reqUrl.origin));
}
