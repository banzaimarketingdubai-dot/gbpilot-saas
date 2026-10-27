import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const url = request.nextUrl.clone();

  // Subdomain svoi.* (e.g. svoi.gbpilot.top) -> rewrite root to /svoi
  if (host.startsWith('svoi.')) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/svoi';
      return NextResponse.rewrite(url);
    }
    if (url.pathname === '/svoi') {
      url.pathname = '/';
      return NextResponse.redirect(url, 301);
    }
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
