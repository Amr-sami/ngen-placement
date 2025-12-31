/**
 * Localization Types and Utilities
 * 
 * This module provides types and helper functions for handling
 * multilingual content in the database.
 */

export type Locale = 'en' | 'ar';

/**
 * A field that supports multiple languages
 */
export interface LocalizedString {
    en: string;
    ar: string;
}

/**
 * Create a localized string with default values
 */
export function createLocalizedString(en: string = '', ar: string = ''): LocalizedString {
    return { en, ar };
}

/**
 * Get the value for the current locale from a localized field
 * Falls back to English if the requested locale is not available
 */
export function getLocalizedValue(
    field: LocalizedString | string | undefined | null,
    locale: Locale
): string {
    // Handle null/undefined
    if (!field) return '';

    // Handle legacy string format (for backward compatibility)
    if (typeof field === 'string') return field;

    // Handle LocalizedString object
    const value = field[locale];

    // Fall back to English if the requested locale is empty
    if (!value && locale !== 'en') {
        return field.en || '';
    }

    return value || '';
}

/**
 * Get localized value with fallback chain
 * Order: requested locale -> other locale -> fallback
 */
export function getLocalizedValueWithFallback(
    field: LocalizedString | string | undefined | null,
    locale: Locale,
    fallback: string = ''
): string {
    const value = getLocalizedValue(field, locale);
    if (value) return value;

    // If primary locale empty, try the other locale
    if (typeof field === 'object' && field) {
        const otherLocale = locale === 'en' ? 'ar' : 'en';
        if (field[otherLocale]) return field[otherLocale];
    }

    return fallback;
}

/**
 * Check if a localized field has content in the specified locale
 */
export function hasLocalizedContent(
    field: LocalizedString | string | undefined | null,
    locale: Locale
): boolean {
    if (!field) return false;
    if (typeof field === 'string') return field.length > 0;
    return (field[locale]?.length ?? 0) > 0;
}

/**
 * Mongoose schema definition for a localized string field
 * Usage: name: LocalizedStringSchema
 */
export const LocalizedStringSchemaDefinition = {
    en: { type: String, default: '' },
    ar: { type: String, default: '' },
};

/**
 * Helper to transform database objects with localized fields for API responses
 */
export function localizeDocument<T extends Record<string, unknown>>(
    doc: T,
    locale: Locale,
    localizedFields: string[]
): T {
    const result = { ...doc };

    for (const field of localizedFields) {
        if (result[field] && typeof result[field] === 'object') {
            const localizedField = result[field] as LocalizedString;
            // Replace the localized object with the string value for the locale
            (result as Record<string, unknown>)[`${field}_localized`] = getLocalizedValue(localizedField, locale);
        }
    }

    return result;
}

/**
 * Default supported locales
 */
export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar'];

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'en';
