interface UserStatusBadgeProps {
    status: string;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
        active: {
            bg: 'bg-green-500/20',
            text: 'text-green-400',
            label: 'Active',
        },
        pending: {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-400',
            label: 'Pending',
        },
        suspended: {
            bg: 'bg-red-500/20',
            text: 'text-red-400',
            label: 'Suspended',
        },
        deleted: {
            bg: 'bg-gray-500/20',
            text: 'text-gray-400',
            label: 'Deleted',
        },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.label}
        </span>
    );
}
