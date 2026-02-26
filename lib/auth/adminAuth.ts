import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

/** Roles allowed to access the admin panel */
const ADMIN_ROLES = ['superadmin', 'support'] as const;

/**
 * Require admin-level access (superadmin OR support) for a page.
 * Redirects to login if not authenticated, or 404 if not an admin role.
 * 
 * @returns The session object if the user has admin access
 */
export async function requireAdminAccess() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') || '/en/auth/login';
        const locale = pathname.split('/')[1] || 'en';
        redirect(`/${locale}/auth/login`);
    }

    if (!ADMIN_ROLES.includes(session.user.role as any)) {
        redirect('/404');
    }

    return session;
}

/**
 * Require super admin access for a page or action.
 * Redirects to login if not authenticated, or 404 if not a super admin.
 * Use this for write operations (create, update, delete).
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
 * Check if the current user is a support user.
 * Does not redirect, just returns a boolean.
 */
export async function isSupport(): Promise<boolean> {
    const session = await getServerSession(authOptions);
    return session?.user?.role === 'support';
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

