'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';

export default function OrdersHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
            params.set('search', searchValue);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`/en/admin/orders?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        params.set('page', '1');
        router.push(`/en/admin/orders?${params.toString()}`);
    };

    const currentStatus = searchParams.get('status') || 'all';

    return (
        <div className="space-y-4">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-white">Orders & Transactions</h1>
                <p className="text-gray-400 mt-1">
                    View and manage all orders and payment transactions
                </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by email, name, or transaction ID..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                </form>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={18} />
                    <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
                        {['all', 'paid', 'pending', 'failed', 'refunded'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusFilter(status)}
                                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${currentStatus === status
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
