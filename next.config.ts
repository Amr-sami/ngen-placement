import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/[locale]/request.ts');

// Baseline CSP. Script 'unsafe-inline' is retained because Next.js ships inline
// bootstrap scripts and we don't run a nonce-injecting middleware yet. Every
// other directive is locked down. Sibling-specific allowlist:
//   - googleapis / gstatic / firebaseio for Firestore (sales mirror)
//   - ip-api.com for client geolocation
//   - api.resend.com for email send (server-side; included for completeness)
// Paymob is NOT included — this subdomain has no checkout flow.
const cspDirectives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://ip-api.com https://api.resend.com",
    "frame-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    { key: 'Content-Security-Policy', value: cspDirectives },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  outputFileTracingIncludes: {
    '/api/**/*': [
      './questions_v2/**/*',
      './SpicificTest-AR/**/*',
      './SpicificTest-EN/**/*'
    ],
  },
  outputFileTracingExcludes: {
    '/api/**/*': [
      './public/game/**/*',
      './hello_name_web/**/*',
      './public/assets/**/*',
      './public/*.svg'
    ],
  },
};

export default withNextIntl(nextConfig);
