'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { locales } from '@/i18n';
import type { Locale } from '@/i18n';

function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const t = useTranslations('nav.lang');
  const currentLocale = (params?.locale as Locale) || 'en';

  // Get the path without the locale prefix
  const getPathWithoutLocale = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && locales.includes(pathSegments[0] as Locale)) {
      return '/' + pathSegments.slice(1).join('/');
    }
    return pathname;
  };

  // Preserve hash if present
  const getCurrentHash = () => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  };

  const switchLanguage = (locale: Locale) => {
    const pathWithoutLocale = getPathWithoutLocale();
    const hash = getCurrentHash();
    return `/${locale}${pathWithoutLocale}${hash}`;
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={switchLanguage(locale)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-purple-dark text-white'
                : 'text-gray-600 hover:text-purple-dark hover:bg-gray-200'
            }`}
          >
            {t(locale)}
          </Link>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;

