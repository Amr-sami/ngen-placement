import { Metadata } from 'next';
import { requireAdminAccess } from '@/lib/auth/adminAuth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
    title: 'NGEN Admin Dashboard',
    description: 'Admin dashboard for managing NGEN Schools platform',
    robots: { index: false, follow: false }, // Prevent search engines from indexing admin pages
};

// Paths that restricted users (support/sales) are allowed to access
const RESTRICTED_ALLOWED_PATHS = ['/admin/placement-tests', '/admin/evaluations'];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect non-admins to 404 or login
    const session = await requireAdminAccess();

    // Server-side guard: redirect restricted users from unauthorized pages
    if (session.user.role === 'support' || session.user.role === 'sales') {
        const headersList = await headers();
        const pathname = headersList.get('x-pathname') || '';
        const locale = pathname.split('/')[1] || 'en';

        // Check if current path is allowed for restricted roles
        const isAllowed = RESTRICTED_ALLOWED_PATHS.some(p =>
            pathname.includes(p)
        );

        if (!isAllowed) {
            redirect(`/${locale}/admin/placement-tests`);
        }
    }

    return (
        <div className="flex h-screen bg-gray-900">
            <AdminSidebar userRole={session.user.role} />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
