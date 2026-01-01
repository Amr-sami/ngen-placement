import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getUserById } from '@/lib/actions/admin/userActions';
import UserDetailCard from '@/components/admin/users/UserDetailCard';
import UserActionsPanel from '@/components/admin/users/UserActionsPanel';

interface PageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default async function UserDetailPage({ params }: PageProps) {
    const { userId } = await params;
    const user = await getUserById(userId);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/en/admin/users"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Users</span>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user.profile?.fullName || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`}
                    </h1>
                    <p className="text-gray-400 mt-1">{user.email}</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    <UserDetailCard user={user} />
                </div>

                {/* Actions Panel - 1 column */}
                <div>
                    <UserActionsPanel user={user} />
                </div>
            </div>
        </div>
    );
}
