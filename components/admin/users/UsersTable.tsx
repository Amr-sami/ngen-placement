import Link from 'next/link';
import { getUsers } from '@/lib/actions/admin/userActions';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import UserStatusBadge from '@/components/admin/users/UserStatusBadge';
import UserQuickActions from '@/components/admin/users/UserQuickActions';

interface UsersTableProps {
    page: number;
    search: string;
    status: string;
}

export default async function UsersTable({ page, search, status }: UsersTableProps) {
    const { users, pagination } = await getUsers({
        page,
        search,
        status,
        limit: 15,
    });

    if (users.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">
                    {search ? `No users found matching "${search}"` : 'No users found'}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">User</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Placement Test</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Joined</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Last Login</th>
                            <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                <td className="py-4 px-6">
                                    <div>
                                        <p className="text-white font-medium">{user.fullName || 'Unknown'}</p>
                                        <p className="text-gray-400 text-sm">{user.email}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <UserStatusBadge status={user.status} />
                                </td>
                                <td className="py-4 px-6">
                                    {user.placementTest ? (
                                        <div className="text-sm">
                                            <span className={user.placementTest.hasTaken ? 'text-green-400' : 'text-gray-400'}>
                                                {user.placementTest.hasTaken ? 'Taken' : 'Not Taken'}
                                            </span>
                                            <span className="text-gray-500 ml-2">
                                                ({user.placementTest.attemptsUsed}/{user.placementTest.totalAttempts} attempts)
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 text-sm">-</span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-gray-400 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-gray-400 text-sm">
                                    {user.lastLoginAt
                                        ? new Date(user.lastLoginAt).toLocaleDateString()
                                        : 'Never'}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/en/admin/users/${user.id}`}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <UserQuickActions userId={user.id} currentStatus={user.status} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/en/admin/users?page=${pagination.page - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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
                            href={`/en/admin/users?page=${pagination.page + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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
