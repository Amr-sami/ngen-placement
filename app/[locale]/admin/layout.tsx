import { Metadata } from 'next';
import { requireAdminAccess } from '@/lib/auth/adminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
    title: 'NGEN Admin Dashboard',
    description: 'Admin dashboard for managing NGEN Schools platform',
    robots: { index: false, follow: false }, // Prevent search engines from indexing admin pages
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This will redirect non-admins to 404 or login
    await requireAdminAccess();

    return (
        <div className="flex h-screen bg-gray-900">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
