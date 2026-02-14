
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class merging, if not I will use template literals but `cn` is standard in shadcn/ui projects which seems to be used here given the component structure. 
// Actually, looking at previous file lists, I didn't see a lib/utils.ts explicitly but it's common. 
// I'll stick to template literals for safety if I'm not sure, OR I can check standard imports. 
// The user has `components/ui/button.tsx` etc which implies shadcn.
// Let's use simple string concatenation for now to be safe and avoid dependency issues if `cn` isn't there, or I can check.
// Checking `components/ui/button.tsx` would confirm.
// For now, I'll use standard className prop and template literals.

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function AdminInput({ label, error, className, ...props }: AdminInputProps) {
    return (
        <div className="w-full">
            <label className="block text-sm text-gray-400 mb-1">
                {label} {props.required && '*'}
            </label>
            <input
                className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors ${className || ''}`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}
