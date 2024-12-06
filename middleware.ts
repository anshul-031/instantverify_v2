import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

// Pages that should redirect to /verify when logged in
const authPages = ['/login', '/signup', '/reset-password'];

// Pages that don't require authentication
const publicPaths = [
  '/', 
  '/login', 
  '/signup', 
  '/reset-password',
  '/verify-email',
  '/api/auth/verify-email',
  '/contact'
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // If user is logged in and trying to access auth pages, redirect to verify
  if (token && authPages.some(page => pathname.startsWith(page))&& !pathname.startsWith('/reset-password/confirm')) {
    try {
      await verifyAuth(token);
      return NextResponse.redirect(new URL('/verify', request.url));
    } catch (error) {
      // If token verification fails, continue to auth pages
      return NextResponse.next();
    }
  }

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Verify authentication for protected routes
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  try {
    await verifyAuth(token);
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};