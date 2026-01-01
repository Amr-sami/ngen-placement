import { Suspense } from 'react';
import PlacementTestsTable from '@/components/admin/placement-tests/PlacementTestsTable';
import PlacementTestsHeader from '@/components/admin/placement-tests/PlacementTestsHeader';
import PlacementTestsStats from '@/components/admin/placement-tests/PlacementTestsStats';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}

export default async function PlacementTestsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    return (
        <div className="space-y-6">
            <PlacementTestsHeader />

            {/* Stats */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            }>
                <PlacementTestsStats />
            </Suspense>

            {/* Table */}
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
                <PlacementTestsTable
                    page={parseInt(params.page || '1')}
                    status={params.status || 'all'}
                />
            </Suspense>
        </div>
    );
}
