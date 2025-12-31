'use client';

import { useLocale } from 'next-intl';
import { LocalizedString, getLocalizedValue, Locale } from '@/lib/localization';

/**
 * Hook to get the current locale for use with localized database content
 */
export function useCurrentLocale(): Locale {
    const locale = useLocale();
    return (locale === 'ar' ? 'ar' : 'en') as Locale;
}

/**
 * Hook to get a localized value from a LocalizedString field
 * 
 * @example
 * const locale = useCurrentLocale();
 * const trackName = useLocalizedValue(track.name, locale);
 */
export function useLocalizedValue(
    field: LocalizedString | string | undefined | null,
    locale?: Locale
): string {
    const currentLocale = useCurrentLocale();
    return getLocalizedValue(field, locale || currentLocale);
}

/**
 * Hook that returns a function to localize fields
 * Useful when you need to localize multiple fields
 * 
 * @example
 * const localize = useLocalizer();
 * return (
 *   <div>
 *     <h1>{localize(belt.name)}</h1>
 *     <p>{localize(belt.description)}</p>
 *   </div>
 * );
 */
export function useLocalizer() {
    const locale = useCurrentLocale();

    return function localize(field: LocalizedString | string | undefined | null): string {
        return getLocalizedValue(field, locale);
    };
}

/**
 * Utility type for components that need locale
 */
export interface WithLocaleProps {
    locale?: Locale;
}
