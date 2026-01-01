import Link from 'next/link';
import { getOrders } from '@/lib/actions/admin/operationsActions';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';

interface OrdersTableProps {
    page: number;
    search: string;
    status: string;
}

export default async function OrdersTable({ page, search, status }: OrdersTableProps) {
    const { orders, pagination } = await getOrders({
        page,
        search,
        status,
        limit: 15,
    });

    if (orders.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">
                    {search ? `No orders found matching "${search}"` : 'No orders found'}
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
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Customer</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Product</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                                <td className="py-4 px-6">
                                    <div>
                                        <p className="text-white font-medium">{order.customerName}</p>
                                        <p className="text-gray-400 text-sm">{order.customerEmail}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-sm">
                                        {order.belt ? (
                                            <>
                                                <span className="text-white">{order.belt}</span>
                                                <span className="text-gray-500 ml-1">({order.beltCode})</span>
                                            </>
                                        ) : order.track ? (
                                            <span className="text-white">{order.track}</span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="text-white font-medium">
                                        {order.amount.toLocaleString()} {order.currency}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td className="py-4 px-6 text-gray-400 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6">
                                    {order.transactionId ? (
                                        <span className="text-gray-400 text-sm font-mono">
                                            {order.transactionId.slice(0, 12)}...
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 text-sm">-</span>
                                    )}
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
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/en/admin/orders?page=${pagination.page - 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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
                            href={`/en/admin/orders?page=${pagination.page + 1}${search ? `&search=${search}` : ''}${status !== 'all' ? `&status=${status}` : ''}`}
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
