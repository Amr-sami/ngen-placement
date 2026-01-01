interface OrderStatusBadgeProps {
    status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        paid: {
            bg: 'bg-green-500/20',
            text: 'text-green-400',
            label: 'Paid',
        },
        pending: {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-400',
            label: 'Pending',
        },
        failed: {
            bg: 'bg-red-500/20',
            text: 'text-red-400',
            label: 'Failed',
        },
        refunded: {
            bg: 'bg-purple-500/20',
            text: 'text-purple-400',
            label: 'Refunded',
        },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}
