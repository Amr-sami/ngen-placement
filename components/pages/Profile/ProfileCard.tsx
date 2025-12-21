import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ProfileCardProps {
    icon: LucideIcon
    title: string
    iconColor?: string
    children: React.ReactNode
}

export default function ProfileCard({
    icon: Icon,
    title,
    iconColor = 'text-white',
    children,
}: ProfileCardProps) {
    return (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-xl bg-white/10 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            {children}
        </div>
    )
}
