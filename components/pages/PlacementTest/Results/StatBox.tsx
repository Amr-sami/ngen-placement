
import { LucideIcon } from 'lucide-react'

interface StatBoxProps {
  icon: LucideIcon
  label: string
  value: string
  color: string
}

export default function StatBox({ icon: Icon, label, value, color }: StatBoxProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center text-center">
      <Icon className={`w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 ${color}`} />
      <span className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
      <span className="text-white text-xs md:text-base font-bold truncate w-full">
        {value}
      </span>
    </div>
  )
}