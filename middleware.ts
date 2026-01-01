import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Intl middleware for non-admin routes
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Routes that admins CAN access (for login and API purposes)
const ADMIN_ALLOWED_PUBLIC_ROUTES = [
  '/api',
  '/_next',
  '/auth/login',
  '/auth/logout',
  '/en/auth/login',
  '/ar/auth/login',
  '/en/auth/logout',
  '/ar/auth/logout',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Get token for auth checks
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if this is an admin route
  const isAdminRoute = pathname.includes('/admin');

  // Check if this is an allowed public route (login, auth routes)
  const isAllowedPublicRoute = ADMIN_ALLOWED_PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route) || pathname === route
  );

  // ═══════════════════════════════════════════════════════════════
  // ADMIN ROUTE HANDLING
  // ═══════════════════════════════════════════════════════════════
  if (isAdminRoute) {
    // Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL('/en/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Not super admin → return 404 response (security through obscurity)
    if (token.role !== 'superadmin') {
      // Return a proper 404 response
      return new NextResponse('Not Found', { status: 404 });
    }

    // Super admin accessing admin routes → allow
    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
  }

  // Check if preview mode is requested
  const isPreviewMode = request.nextUrl.searchParams.get('preview') === 'true';

  // ═══════════════════════════════════════════════════════════════
  // SUPER ADMIN ACCESSING PUBLIC ROUTES
  // ═══════════════════════════════════════════════════════════════
  if (token?.role === 'superadmin' && !isAllowedPublicRoute && !isPreviewMode) {
    // Super admin trying to access public pages → redirect to admin dashboard
    const pathLocale = pathname.split('/')[1] || 'en';
    const validLocale = locales.includes(pathLocale as typeof locales[number]) ? pathLocale : 'en';
    return NextResponse.redirect(new URL(`/${validLocale}/admin`, request.url));
  }

  // ═══════════════════════════════════════════════════════════════
  // REGULAR USERS / GUESTS - PUBLIC ROUTES
  // ═══════════════════════════════════════════════════════════════
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except api, _next, static files
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
  ],
};
