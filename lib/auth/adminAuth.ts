import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

/** Roles allowed to access the admin panel */
const ADMIN_ROLES = ['superadmin', 'support'] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * Re-validate role + status against Mongo rather than trusting the JWT.
 * JWT claims are frozen at login; if a superadmin is demoted or suspended
 * their old token would keep working until it expires.
 */
async function loadActiveAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { session: null, role: null as AdminRole | null, isActive: false };

    await connectToDatabase();
    const user = await User.findById(session.user.id).select('role status');

    const isActive = !!user && user.status === 'active' && ADMIN_ROLES.includes(user.role as AdminRole);
    return { session, role: isActive ? (user!.role as AdminRole) : null, isActive };
}

async function redirectToLogin(): Promise<never> {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '/en/auth/login';
    const locale = pathname.split('/')[1] || 'en';
    redirect(`/${locale}/auth/login`);
    // Unreachable — redirect() throws. Satisfies the `never` return type.
    throw new Error('unreachable');
}

/**
 * Require admin-level access (superadmin OR support) for a page.
 * Redirects to login if not authenticated, or 404 if not an admin role.
 */
export async function requireAdminAccess() {
    const { session, isActive } = await loadActiveAdmin();

    if (!session?.user) {
        await redirectToLogin();
    }

    if (!isActive) {
        redirect('/404');
    }

    return session!;
}

/**
 * Require super admin access. Use for write operations.
 */
export async function requireSuperAdmin() {
    const { session, role } = await loadActiveAdmin();

    if (!session?.user) {
        await redirectToLogin();
    }

    if (role !== 'superadmin') {
        redirect('/404');
    }

    return session!;
}

export async function isSuperAdmin(): Promise<boolean> {
    const { role } = await loadActiveAdmin();
    return role === 'superadmin';
}

export async function isSupport(): Promise<boolean> {
    const { role } = await loadActiveAdmin();
    return role === 'support';
}

export async function getAdminSession() {
    const { session, role } = await loadActiveAdmin();
    return role === 'superadmin' ? session : null;
}
