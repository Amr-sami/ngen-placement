'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/lib/actions/admin/operationsActions';

interface OrderStatusChangerProps {
    orderId: string;
    currentStatus: string;
}

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
    { value: 'paid', label: 'Paid', color: 'text-green-400' },
    { value: 'failed', label: 'Failed', color: 'text-red-400' },
    { value: 'refunded', label: 'Refunded', color: 'text-purple-400' },
];

export default function OrderStatusChanger({ orderId, currentStatus }: OrderStatusChangerProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const router = useRouter();

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        if (newStatus !== currentStatus) {
            setShowConfirm(true);
        } else {
            setShowConfirm(false);
        }
        setMessage(null);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            await updateOrderStatus(orderId, status as 'pending' | 'paid' | 'failed' | 'refunded');
            setMessage({ type: 'success', text: 'Status updated successfully!' });
            setShowConfirm(false);
            router.refresh();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update status'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setStatus(currentStatus);
        setShowConfirm(false);
        setMessage(null);
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400">
                Change the order status. Use with caution - this is a manual override.
            </p>

            <div className="space-y-2">
                {statusOptions.map((option) => (
                    <label
                        key={option.value}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${status === option.value
                                ? 'bg-gray-700 border border-purple-500'
                                : 'bg-gray-700/30 border border-transparent hover:bg-gray-700/50'
                            }`}
                    >
                        <input
                            type="radio"
                            name="status"
                            value={option.value}
                            checked={status === option.value}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="sr-only"
                        />
                        <div className={`w-3 h-3 rounded-full ${status === option.value ? 'bg-purple-500' : 'bg-gray-600'
                            }`} />
                        <span className={status === option.value ? option.color : 'text-gray-300'}>
                            {option.label}
                        </span>
                        {option.value === currentStatus && (
                            <span className="ml-auto text-xs text-gray-500">(current)</span>
                        )}
                    </label>
                ))}
            </div>

            {/* Message */}
            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Confirm Buttons */}
            {showConfirm && (
                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        {isLoading ? 'Updating...' : 'Confirm Change'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Warning */}
            <p className="text-xs text-yellow-500/70">
                ⚠️ Manual status changes do not trigger payment gateway actions.
                Use this only to correct sync issues or for testing.
            </p>
        </div>
    );
}
