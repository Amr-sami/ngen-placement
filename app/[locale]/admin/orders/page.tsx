import { Suspense } from 'react';
import OrdersTable from '@/components/admin/orders/OrdersTable';
import OrdersHeader from '@/components/admin/orders/OrdersHeader';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        status?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    return (
        <div className="space-y-6">
            <OrdersHeader />

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
                <OrdersTable
                    page={parseInt(params.page || '1')}
                    search={params.search || ''}
                    status={params.status || 'all'}
                />
            </Suspense>
        </div>
    );
}
