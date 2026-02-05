import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getOrderDetails } from '@/lib/actions/admin/operationsActions';
import OrderStatusBadge from '@/components/admin/orders/OrderStatusBadge';
import OrderStatusChanger from '@/components/admin/orders/OrderStatusChanger';

interface PageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { orderId } = await params;
    const data = await getOrderDetails(orderId);

    if (!data) {
        notFound();
    }

    const { order, transactions } = data;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/en/admin/orders"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} />
                <span>Back to Orders</span>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Order Details
                    </h1>
                    <p className="text-gray-400 mt-1">
                        {order.paymobOrderId ? `Paymob Order: ${order.paymobOrderId}` : `Internal ID: ${order.id}`}
                    </p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CreditCard className="text-purple-400" size={20} />
                            Order Information
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                                <p className="text-white font-medium">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Customer Email</p>
                                <p className="text-white">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Customer Phone</p>
                                <p className="text-white">{order.customerPhone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Amount</p>
                                <p className="text-white font-medium text-lg">
                                    {order.amount.toLocaleString()} {order.currency}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                <p className="text-white capitalize">{order.paymentMethod || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Created At</p>
                                <p className="text-white">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            {order.transactionId && (
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                    <p className="text-white font-mono text-sm bg-gray-900 px-3 py-2 rounded">
                                        {order.transactionId}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Metadata */}
                        {order.metadata && Object.keys(order.metadata).length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <p className="text-sm text-gray-400 mb-2">Metadata</p>
                                <pre className="text-xs text-gray-300 bg-gray-900 p-4 rounded overflow-x-auto">
                                    {JSON.stringify(order.metadata, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Transactions */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="text-purple-400" size={20} />
                            Transaction History ({transactions.length})
                        </h2>

                        {transactions.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">
                                No transactions recorded yet. The customer may not have attempted payment.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((txn) => (
                                    <div
                                        key={txn.id}
                                        className={`p-4 rounded-lg border ${txn.success
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : txn.pending
                                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                                : 'bg-red-500/10 border-red-500/30'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                {txn.success ? (
                                                    <CheckCircle className="text-green-400" size={18} />
                                                ) : txn.pending ? (
                                                    <AlertCircle className="text-yellow-400" size={18} />
                                                ) : (
                                                    <XCircle className="text-red-400" size={18} />
                                                )}
                                                <span className={`font-medium ${txn.success ? 'text-green-400' : txn.pending ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                    {txn.success ? 'Successful' : txn.pending ? 'Pending' : 'Failed'}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-sm">
                                                {new Date(txn.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Paymob Txn ID</p>
                                                <p className="text-white font-mono text-xs">{txn.paymobTxnId}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Amount</p>
                                                <p className="text-white">{txn.amount} {txn.currency}</p>
                                            </div>
                                        </div>

                                        {txn.errorMessage && (
                                            <div className={`mt-3 p-2 rounded text-sm ${txn.success
                                                ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                                                : 'bg-red-500/10 text-red-300 border border-red-500/20'
                                                }`}>
                                                <strong>{txn.success ? 'Message:' : 'Error:'}</strong> {txn.errorMessage}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Panel - 1 column */}
                <div className="space-y-6">
                    {/* Status Changer */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Update Status
                        </h2>
                        <OrderStatusChanger orderId={order.id} currentStatus={order.status} />
                    </div>

                    {/* Quick Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Info</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="text-white capitalize">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Transactions</span>
                                <span className="text-white">{transactions.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Successful</span>
                                <span className="text-green-400">
                                    {transactions.filter(t => t.success).length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Failed</span>
                                <span className="text-red-400">
                                    {transactions.filter(t => !t.success && !t.pending).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
