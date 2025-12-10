import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Middleware for locale detection and routing
 * Redirects root "/" to default locale "/en"
 * Handles locale-based routing for all pages
 */
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL (e.g., /en, /ar)
});

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - _next (Next.js internals)
  // - Static files (images, fonts, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};




