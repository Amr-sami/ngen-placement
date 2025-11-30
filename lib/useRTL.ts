import { useParams } from 'next/navigation';
import { type Locale, localeDirections } from '@/i18n';

/**
 * Hook to detect if the current locale uses RTL (Right-to-Left) direction
 * @returns {boolean} true if the current locale is RTL, false otherwise
 * @example
 * const isRTL = useRTL();
 * <div className={isRTL ? 'flex-row-reverse' : 'flex-row'}>...</div>
 */
export function useRTL(): boolean {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  return localeDirections[locale] === 'rtl';
}

/**
 * Hook to get the current locale
 * @returns {Locale} The current locale ('en' or 'ar')
 */
export function useLocale(): Locale {
  const params = useParams();
  return (params?.locale as Locale) || 'en';
}



