import { NextResponse } from 'next/server';
import { getGoogleOAuthUrl } from '@/lib/gbp/auth';

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gbpilot.top';

function cleanOrigin(raw: string | null, fallbackOrigin: string): string {
  const candidate = (raw || fallbackOrigin || 'https://www.gbpilot.top').trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(candidate);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return candidate.replace(/\/(dashboard|onboarding|b2b)$/, '');
  }
}

export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  const searchParams = reqUrl.searchParams;
  const fallbackOrigin = `${reqUrl.protocol}//${reqUrl.host}`;
  const stateOrigin = cleanOrigin(
    searchParams.get('origin') || searchParams.get('state') || searchParams.get('redirect_url'),
    fallbackOrigin
  );
  const rawJson = searchParams.get('raw_json') === 'true';

  // Try fetching the live OAuth URL from the Railway backend if it's a different host
  if (!BACKEND_BASE.includes(reqUrl.host)) {
    try {
      const upstreamUrl = `${BACKEND_BASE.replace(/\/+$/, '')}/api/v1/auth/google/login?origin=${encodeURIComponent(
        stateOrigin
      )}&redirect_url=${encodeURIComponent(stateOrigin)}&state=${encodeURIComponent(stateOrigin)}&raw_json=true`;
      const res = await fetch(upstreamUrl, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.auth_url) {
          if (rawJson) {
            return NextResponse.json({ success: true, auth_url: data.auth_url, authUrl: data.auth_url });
          }
          return NextResponse.redirect(data.auth_url, 307);
        }
      }
    } catch (e) {
      console.error('Upstream Google login proxy error:', e);
    }
  }

  const fallbackAuthUrl = getGoogleOAuthUrl(stateOrigin);
  if (rawJson) {
    return NextResponse.json({ success: true, auth_url: fallbackAuthUrl, authUrl: fallbackAuthUrl });
  }
  return NextResponse.redirect(fallbackAuthUrl, 307);
}
