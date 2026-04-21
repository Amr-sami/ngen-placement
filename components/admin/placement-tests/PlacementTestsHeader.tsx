'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Filter } from 'lucide-react';

export default function PlacementTestsHeader() {
    const router = useRouter();
    const locale = useLocale();
    const searchParams = useSearchParams();

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        params.set('page', '1');
        router.push(`/${locale}/admin/placement-tests?${params.toString()}`);
    };

    const currentStatus = searchParams.get('status') || 'all';

    return (
        <div className="space-y-4">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-white">Placement Tests</h1>
                <p className="text-gray-400 mt-1">
                    View all placement test results and statistics
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <Filter className="text-gray-400" size={18} />
                <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
                    {['all', 'completed', 'in_progress', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${currentStatus === status
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
