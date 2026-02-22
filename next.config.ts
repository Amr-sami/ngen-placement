import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/[locale]/request.ts');

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
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
