import { LucideIcon } from 'lucide-react'

interface SettingsInputProps {
    label: string
    icon: LucideIcon
    placeholder?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    disabled?: boolean
    required?: boolean
    className?: string
}

export default function SettingsInput({
    label,
    icon: Icon,
    placeholder,
    value,
    onChange,
    type = 'text',
    disabled = false,
    required = false,
    className
}: SettingsInputProps) {
    return (
        <div className={`space-y-2 ${className || ''}`}>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-500" />
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    )
}
