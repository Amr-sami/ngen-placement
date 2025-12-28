/**
 * Geolocation helper for detecting user's country from IP address
 * Uses ip-api.com free tier (no API key required, 45 requests/minute limit)
 */

export interface GeoLocationResult {
    country: string;
    countryCode: string;
    city?: string;
    success: boolean;
}

const DEFAULT_RESULT: GeoLocationResult = {
    country: 'Unknown',
    countryCode: 'XX',
    success: false,
};

/**
 * Get country information from an IP address
 * @param ip - The IP address to lookup (supports both IPv4 and IPv6)
 * @returns GeoLocationResult with country info
 */
export async function getCountryFromIP(ip: string): Promise<GeoLocationResult> {
    // Skip localhost and invalid IPs
    if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return DEFAULT_RESULT;
    }

    try {
        // Use ip-api.com free tier (no HTTPS on free tier)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!response.ok) {
            console.error('GeoLocation API error:', response.status);
            return DEFAULT_RESULT;
        }

        const data = await response.json();

        if (data.status !== 'success') {
            return DEFAULT_RESULT;
        }

        return {
            country: data.country || 'Unknown',
            countryCode: data.countryCode || 'XX',
            city: data.city,
            success: true,
        };
    } catch (error) {
        console.error('GeoLocation lookup failed:', error);
        return DEFAULT_RESULT;
    }
}

/**
 * Check if the country code indicates Egypt
 */
export function isEgypt(countryCode: string): boolean {
    return countryCode.toUpperCase() === 'EG';
}

/**
 * Get the appropriate currency based on country code
 */
export function getCurrencyForCountry(countryCode: string): 'EGP' | 'USD' {
    return isEgypt(countryCode) ? 'EGP' : 'USD';
}

/**
 * Extract IP address from request headers (works with various proxies)
 */
export function getIPFromHeaders(headers: Headers): string {
    // Try various headers in order of preference
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first (client)
        return forwardedFor.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    const cfConnectingIP = headers.get('cf-connecting-ip');
    if (cfConnectingIP) {
        return cfConnectingIP.trim();
    }

    return 'unknown';
}
