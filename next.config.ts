import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/[locale]/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': [
        './questions_v2/**/*',
        './SpicificTest-AR/**/*',
        './SpicificTest-EN/**/*'
      ],
    },
  },
};

export default withNextIntl(nextConfig);
