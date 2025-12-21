import React from 'react'

interface StatusBadgeProps {
    type: 'success' | 'warning' | 'error' | 'info'
    label: string
}

const typeStyles = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

export default function StatusBadge({ type, label }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${typeStyles[type]}`}
        >
            {label}
        </span>
    )
}
