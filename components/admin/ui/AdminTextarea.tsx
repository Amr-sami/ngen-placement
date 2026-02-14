
import React from 'react';

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export function AdminTextarea({ label, error, className, rows = 3, ...props }: AdminTextareaProps) {
    return (
        <div className="w-full">
            <label className="block text-sm text-gray-400 mb-1">
                {label} {props.required && '*'}
            </label>
            <textarea
                rows={rows}
                className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors ${className || ''}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}
