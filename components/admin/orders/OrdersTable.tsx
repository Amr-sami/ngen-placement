import Link from 'next/link';
import { getOrders } from '@/lib/actions/admin/operationsActions';
import { Eye } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import AdminPagination from '@/components/admin/ui/AdminPagination';

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
                            <th className="text-right py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
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
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-end">
                                        <Link
                                            href={`/en/admin/orders/${order.id}`}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <AdminPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                baseUrl="/en/admin/orders"
                searchParams={{ search, status }}
                itemLabel="orders"
            />
        </div>
    );
}
