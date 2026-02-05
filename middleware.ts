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

  // 1. Skip middleware for critical paths (API, Next.js internal, static files)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Hand off everything else to internationalization middleware
  // Admin pages handle their own security via requireSuperAdmin() in the layout
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except api, _next, static files
  matcher: [
    '/((?!api|_next|.*\\..*).*)',
  ],
};
