import Link from 'next/link';
import { getPlacementTests } from '@/lib/actions/admin/operationsActions';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface PlacementTestsTableProps {
    page: number;
    status: string;
}

export default async function PlacementTestsTable({ page, status }: PlacementTestsTableProps) {
    const { tests, pagination } = await getPlacementTests({
        page,
        status,
        limit: 15,
    });

    if (tests.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">No placement tests found</p>
            </div>
        );
    }

    const statusConfig: Record<string, { bg: string; text: string }> = {
        completed: { bg: 'bg-green-500/20', text: 'text-green-400' },
        in_progress: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
        cancelled: { bg: 'bg-red-500/20', text: 'text-red-400' },
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Track</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Attempt</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Score</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Result Belt</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                            <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map((test) => {
                            const statusStyle = statusConfig[test.status] || statusConfig.in_progress;
                            return (
                                <tr key={test.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-white font-medium">{test.userName}</p>
                                            <p className="text-gray-400 text-sm">{test.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-400">
                                        {test.trackName}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-gray-400">#{test.attemptNumber}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyle.bg} ${statusStyle.text}`}>
                                            {test.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {test.scorePercent !== undefined && test.scorePercent !== null ? (
                                            <span className={`font-medium ${test.scorePercent >= 70 ? 'text-green-400' :
                                                    test.scorePercent >= 50 ? 'text-yellow-400' :
                                                        'text-red-400'
                                                }`}>
                                                {test.scorePercent}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {test.resultBeltName ? (
                                            <span className="text-white">
                                                {test.resultBeltName}
                                                {test.resultBeltCode && (
                                                    <span className="text-gray-500 text-xs ml-1">({test.resultBeltCode})</span>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-gray-400 text-sm">
                                        {test.completedAt
                                            ? new Date(test.completedAt).toLocaleDateString()
                                            : new Date(test.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                        {test.userId && (
                                            <Link
                                                href={`/en/admin/users/${test.userId}`}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors inline-block"
                                                title="View User"
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tests
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/en/admin/placement-tests?page=${pagination.page - 1}${status !== 'all' ? `&status=${status}` : ''}`}
                            className={`p-2 rounded-lg transition-colors ${pagination.page === 1
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            aria-disabled={pagination.page === 1}
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <span className="text-sm text-gray-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Link
                            href={`/en/admin/placement-tests?page=${pagination.page + 1}${status !== 'all' ? `&status=${status}` : ''}`}
                            className={`p-2 rounded-lg transition-colors ${pagination.page === pagination.totalPages
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                            aria-disabled={pagination.page === pagination.totalPages}
                        >
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
