'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, MessageCircle, ShoppingCart } from 'lucide-react'

interface AttemptLimitCardProps {
    attemptsUsed: number
    totalAllowed: number
    onContactAdmin: () => void
    onBuyLevel: () => void
    beltName?: string
}

export default function AttemptLimitCard({
    attemptsUsed,
    totalAllowed,
    onContactAdmin,
    onBuyLevel,
    beltName,
}: AttemptLimitCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 md:p-8 mb-6"
        >
            <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Maximum Attempts Reached
                </h3>

                {/* Description */}
                <p className="text-purple-200 text-sm md:text-base mb-2">
                    You&apos;ve used all {attemptsUsed} of your {totalAllowed} allowed attempts.
                </p>
                <p className="text-purple-300 text-sm mb-6">
                    You can contact our admin to request additional attempts,
                    or purchase your recommended level directly.
                </p>

                {/* Attempt Counter */}
                <div className="flex items-center gap-2 mb-6">
                    {Array.from({ length: totalAllowed }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${i < attemptsUsed ? 'bg-red-500' : 'bg-white/20'
                                }`}
                        />
                    ))}
                    <span className="text-red-400 text-sm font-bold ml-2">
                        {attemptsUsed}/{totalAllowed} used
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={onContactAdmin}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Request More Attempts
                    </button>
                    <button
                        onClick={onBuyLevel}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:scale-105 transition-all"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Buy {beltName || 'Level'}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
