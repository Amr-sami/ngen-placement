import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    baseUrl: string;
    searchParams?: Record<string, string>;
    itemLabel?: string;
}

export default function AdminPagination({
    page,
    totalPages,
    total,
    limit,
    baseUrl,
    searchParams = {},
    itemLabel = 'items',
}: AdminPaginationProps) {
    if (totalPages <= 1) return null;

    const buildHref = (targetPage: number) => {
        const params = new URLSearchParams();
        params.set('page', String(targetPage));
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value);
            }
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const showingFrom = ((page - 1) * limit) + 1;
    const showingTo = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
                Showing {showingFrom} to {showingTo} of {total} {itemLabel}
            </p>
            <div className="flex items-center gap-2">
                <Link
                    href={buildHref(page - 1)}
                    className={`p-2 rounded-lg transition-colors ${page === 1
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                    aria-disabled={page === 1}
                >
                    <ChevronLeft size={18} />
                </Link>
                <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                </span>
                <Link
                    href={buildHref(page + 1)}
                    className={`p-2 rounded-lg transition-colors ${page === totalPages
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                    aria-disabled={page === totalPages}
                >
                    <ChevronRight size={18} />
                </Link>
            </div>
        </div>
    );
}
