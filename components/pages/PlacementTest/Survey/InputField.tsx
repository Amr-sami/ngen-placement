
import { LucideIcon } from 'lucide-react'

interface InputFieldProps {
  icon: LucideIcon
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  min?: string
  max?: string
}

export default function InputField({ 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  min,
  max
}: InputFieldProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-purple-300 group-focus-within:text-purple-400 transition-colors" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="block w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-black/40 transition-all"
        placeholder={placeholder}
        required
      />
    </div>
  )
}