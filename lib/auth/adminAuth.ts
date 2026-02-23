import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

/**
 * Require super admin access for a page or action.
 * Redirects to login if not authenticated, or 404 if not a super admin.
 * 
 * @returns The session object if the user is a super admin
 */
export async function requireSuperAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        // Get current locale from headers or default to 'en'
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') || '/en/auth/login';
        const locale = pathname.split('/')[1] || 'en';
        redirect(`/${locale}/auth/login`);
    }

    if (session.user.role !== 'superadmin') {
        // Return 404 to hide the existence of admin routes (security through obscurity)
        redirect('/404');
    }

    return session;
}

/**
 * Require general admin access (superadmin or sales) for a page or action.
 * Redirects to login if not authenticated, or 404 if not authorized.
 * 
 * @returns The session object if the user is authorized
 */
export async function requireAdminAccess() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        // Get current locale from headers or default to 'en'
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') || '/en/auth/login';
        const locale = pathname.split('/')[1] || 'en';
        redirect(`/${locale}/auth/login`);
    }

    if (session.user.role !== 'superadmin' && session.user.role !== 'sales') {
        // Return 404 to hide the existence of admin routes (security through obscurity)
        redirect('/404');
    }

    return session;
}

/**
 * Check if the current user is a super admin.
 * Does not redirect, just returns a boolean.
 * 
 * @returns true if user is super admin, false otherwise
 */
export async function isSuperAdmin(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'superadmin';
}

/**
 * Get the current admin session.
 * Returns null if not logged in or not a super admin.
 * Does not redirect.
 */
export async function getAdminSession() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'superadmin') {
        return null;
    }

    return session;
}
