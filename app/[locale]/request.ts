import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

/**
 * Request configuration for next-intl
 * Loads the appropriate message file based on locale
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get and validate the incoming locale
  const locale = (await requestLocale) || 'en';
  
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

