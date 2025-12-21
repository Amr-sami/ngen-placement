
import { LucideIcon } from 'lucide-react'

interface InputFieldProps {
  icon: LucideIcon
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  type?: string
  min?: string
  max?: string
  disabled?: boolean
}

export default function InputField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  onBlur,
  type = "text",
  min,
  max,
  disabled = false
}: InputFieldProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        max={max}
        disabled={disabled}
        className="block w-full ps-12 pe-4 py-3.5 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-black/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={placeholder}
        required
      />
    </div>
  )
}