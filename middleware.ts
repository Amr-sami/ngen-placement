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
  '/payment/return',
  '/payment/success',
  '/payment/error',
  '/en/payment/return',
  '/ar/payment/return',
  '/en/payment/success',
  '/ar/payment/success',
  '/en/payment/error',
  '/ar/payment/error',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Skip middleware for critical paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Get auth state
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. Identify route types
  const isAdminRoute = pathname.includes('/admin');
  const isAllowedPublicRoute = ADMIN_ALLOWED_PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route) || pathname === route
  );
  const isPreviewMode = request.nextUrl.searchParams.get('preview') === 'true';

  // ═══════════════════════════════════════════════════════════════
  // SECURITY CHECKS
  // ═══════════════════════════════════════════════════════════════

  if (isAdminRoute) {
    // A. Not logged in → redirect to login
    if (!token) {
      const loginUrl = new URL('/en/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // B. Not super admin → 404
    if (token.role !== 'superadmin') {
      return new NextResponse('Not Found', { status: 404 });
    }

    // C. Authorized Super Admin accessing Admin Route → FALL THROUGH TO INTL
  }

  // ═══════════════════════════════════════════════════════════════
  // SUPER ADMIN REDIRECTS (FORCE DASHBOARD FOR PUBLIC PAGES)
  // ═══════════════════════════════════════════════════════════════

  if (
    token?.role === 'superadmin' &&
    !isAdminRoute &&
    !isAllowedPublicRoute &&
    !isPreviewMode
  ) {
    const pathLocale = pathname.split('/')[1] || 'en';
    const validLocale = locales.includes(pathLocale as typeof locales[number]) ? pathLocale : 'en';
    return NextResponse.redirect(new URL(`/${validLocale}/admin`, request.url));
  }

  // ═══════════════════════════════════════════════════════════════
  // FINAL STEP: INTERNATIONALIZATION
  // ═══════════════════════════════════════════════════════════════
  // Always call intlMiddleware for authorized traffic to avoid loops and normalize URLs
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except api, _next, static files
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
  ],
};
