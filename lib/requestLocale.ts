import { locales, defaultLocale, type Locale } from '@/i18n';

const LOCALE_SET = new Set<string>(locales);

function isLocale(value: string | null | undefined): value is Locale {
    return !!value && LOCALE_SET.has(value);
}

/**
 * Resolve the caller's locale from an incoming request.
 *
 * Precedence:
 *   1. explicit `?locale=` query
 *   2. Referer header (first path segment, e.g. /ar/foo)
 *   3. defaultLocale ('en')
 */
export function getLocaleFromRequest(request: Request): Locale {
    const url = new URL(request.url);
    const queryLocale = url.searchParams.get('locale');
    if (isLocale(queryLocale)) {
        return queryLocale;
    }

    const referer = request.headers.get('referer');
    if (referer) {
        try {
            const segment = new URL(referer).pathname.split('/')[1];
            if (isLocale(segment)) {
                return segment;
            }
        } catch {
            // ignore malformed referer
        }
    }

    return defaultLocale;
}
