import crypto from 'crypto';
import { hashToken } from '@/lib/auth/tokenHash';

export const LEAD_COOKIE_NAME = 'ngen_lead_token';
// Guests come in cold; keep the cookie short enough that an abandoned device
// can't replay a months-old exam, long enough that a user who walks away and
// comes back can still finish submitting.
const LEAD_COOKIE_MAX_AGE_SECONDS = 2 * 60 * 60; // 2 hours

export function generateLeadToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function hashLeadToken(token: string): string {
    return hashToken(token);
}

/**
 * Serialize the lead-token cookie. HttpOnly so JS can't read it, Secure so it
 * only rides over TLS, SameSite=Lax so form POSTs from the same subdomain still
 * work but cross-site CSRF cannot carry it. Path is narrowed so the cookie is
 * only sent to placement-test routes.
 */
// Path is widened from /api/placement-test to /api so that the cookie rides
// along on register (/api/auth/register) and on the dedicated link endpoint
// (/api/placement-test/link-guest). Still HttpOnly + Secure + SameSite=Lax;
// the wider path only exposes the cookie to route handlers under /api, never
// to static assets or the HTML shell.
export function serializeLeadCookie(token: string): string {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return `${LEAD_COOKIE_NAME}=${token}; Path=/api; Max-Age=${LEAD_COOKIE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`;
}

export function clearLeadCookie(): string {
    return `${LEAD_COOKIE_NAME}=; Path=/api; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export function parseLeadTokenFromHeader(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;
    const parts = cookieHeader.split(';');
    for (const part of parts) {
        const [k, ...rest] = part.trim().split('=');
        if (k === LEAD_COOKIE_NAME) {
            return rest.join('=') || null;
        }
    }
    return null;
}
