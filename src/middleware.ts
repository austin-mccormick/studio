
import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (excluding /api/auth/me which should be protected if you want server-side validation)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (publicly accessible login page)
     * - /register (publicly accessible registration page)
     * - /forgot-password (publicly accessible forgot password page)
     */
    '/((?!api/auth/(?!me)|_next/static|_next/image|favicon.ico|register|forgot-password|$).*)',
    '/api/auth/me', // Ensure /api/auth/me is explicitly included for protection
  ],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // List of public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/forgot-password'];

  // If trying to access a protected API route without a valid token
  if (pathname.startsWith('/api/') && pathname !== '/api/auth/login' && pathname !== '/api/auth/register') {
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // If trying to access a protected page (not API, not public) without a valid token
  if (!publicPaths.includes(pathname) && !pathname.startsWith('/api/')) {
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass redirect info
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If user is authenticated and tries to access login/register/forgot-password, redirect to dashboard
  if (token && verifyToken(token) && publicPaths.includes(pathname)) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}
