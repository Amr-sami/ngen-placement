import { Suspense } from 'react';
import UsersTable from '@/components/admin/users/UsersTable';
import UsersHeader from '@/components/admin/users/UsersHeader';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
    }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    return (
        <div className="space-y-6">
            <UsersHeader />

            <Suspense fallback={
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-14 bg-gray-700 rounded w-full mb-2"></div>
                        ))}
                    </div>
                </div>
            }>
                <UsersTable
                    page={parseInt(params.page || '1')}
                    search={params.search || ''}
                    status={params.status || 'all'}
                />
            </Suspense>
        </div>
    );
}
