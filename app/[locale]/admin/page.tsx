import { Suspense } from 'react';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivity from '@/components/admin/RecentActivity';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1">
                    Welcome to the NGEN Admin Dashboard. Manage your platform from here.
                </p>
            </div>

            {/* Stats Grid */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
                            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            }>
                <DashboardStats />
            </Suspense>

            {/* Recent Activity */}
            <Suspense fallback={
                <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            }>
                <RecentActivity />
            </Suspense>
        </div>
    );
}
