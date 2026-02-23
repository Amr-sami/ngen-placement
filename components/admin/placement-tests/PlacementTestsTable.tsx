import Link from 'next/link';
import { getPlacementTests } from '@/lib/actions/admin/operationsActions';
import { ExternalLink } from 'lucide-react';
import AdminPagination from '@/components/admin/ui/AdminPagination';

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
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Type</th>
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
                                            {(test.userPhone || test.userCountry) && (
                                                <p className="text-gray-500 text-xs mt-0.5">
                                                    {test.userPhone && <span>{test.userPhone}</span>}
                                                    {test.userPhone && test.userCountry && <span> • </span>}
                                                    {test.userCountry && <span>{test.userCountry}</span>}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${test.testType === 'soft_skills'
                                            ? 'bg-purple-500/20 text-purple-400'
                                            : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {test.testType === 'soft_skills' ? 'Soft Skills' : 'Technical'}
                                        </span>
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
                                    <td className="py-4 px-6 text-right space-x-2">
                                        <Link
                                            href={`/en/admin/placement-tests/${test.id}`}
                                            className="p-2 text-blue-400 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors inline-block"
                                            title="View Details"
                                        >
                                            <ExternalLink size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <AdminPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                baseUrl="/en/admin/placement-tests"
                searchParams={{ status }}
                itemLabel="tests"
            />
        </div>
    );
}
