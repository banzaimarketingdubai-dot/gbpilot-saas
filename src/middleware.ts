import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const url = request.nextUrl.clone();
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  // Case 1: Subdomain svoi.* (e.g. svoi.gbpilot.top or svoi.localhost:3000)
  if (host.startsWith('svoi.')) {
    // If user accesses root on subdomain, rewrite internally to /svoi
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/svoi';
      return NextResponse.rewrite(url);
    }
    // If user accesses /svoi directly on subdomain, redirect to clean root /
    if (url.pathname === '/svoi') {
      url.pathname = '/';
      return NextResponse.redirect(url, 301);
    }
    return NextResponse.next();
  }

  // Case 2: On production main domain (gbpilot.top), redirect /svoi to subdomain https://svoi.gbpilot.top
  if (!isLocal && (url.pathname === '/svoi' || url.pathname.startsWith('/svoi/'))) {
    const targetUrl = new URL(request.url);
    targetUrl.host = 'svoi.gbpilot.top';
    targetUrl.pathname = url.pathname.replace(/^\/svoi/, '') || '/';
    return NextResponse.redirect(targetUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (public images)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
