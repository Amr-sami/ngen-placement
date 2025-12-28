'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, MessageCircle, ShoppingCart } from 'lucide-react'
import { useLocale } from 'next-intl'

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
    const locale = useLocale()
    const isRTL = locale === 'ar'

    // Translations
    const translations = {
        en: {
            title: 'Maximum Attempts Reached',
            description1: `You've used all ${attemptsUsed} of your ${totalAllowed} allowed attempts.`,
            description2: 'You can contact our admin to request additional attempts, or purchase your recommended level directly.',
            usedLabel: 'used',
            requestBtn: 'Request More Attempts',
            buyBtn: `Buy ${beltName || 'Level'}`,
        },
        ar: {
            title: 'وصلت للحد الأقصى من المحاولات',
            description1: `لقد استخدمت كافة المحاولات (${attemptsUsed} من أصل ${totalAllowed}).`,
            description2: 'يمكنك التواصل مع الإدارة لطلب محاولات إضافية، أو شراء مستواك الموصى به مباشرة.',
            usedLabel: 'مستخدمة',
            requestBtn: 'طلب محاولات إضافية',
            buyBtn: `شراء ${beltName || 'المستوى'}`,
        }
    }

    const t = translations[locale as 'en' | 'ar'] || translations.en

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 md:p-8 mb-6 ${isRTL ? 'font-arabic' : ''}`}
        >
            <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-3xl font-black text-white mb-3">
                    {t.title}
                </h3>

                {/* Description */}
                <div className="max-w-md mx-auto space-y-2 mb-8">
                    <p className="text-white text-sm md:text-lg font-bold">
                        {t.description1}
                    </p>
                    <p className="text-purple-200/70 text-sm md:text-base leading-relaxed">
                        {t.description2}
                    </p>
                </div>

                {/* Attempt Counter Dots */}
                <div className="flex items-center gap-2 mb-8 bg-black/20 px-6 py-3 rounded-full border border-white/5">
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalAllowed }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-500 ${
                                    i < attemptsUsed 
                                        ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                        : 'bg-white/10'
                                }`}
                            />
                        ))}
                    </div>
                    <span className={`text-red-400 text-xs md:text-sm font-black uppercase tracking-wider ${isRTL ? 'mr-4' : 'ml-4'}`}>
                        {attemptsUsed}/{totalAllowed} {t.usedLabel}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={onContactAdmin}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                    >
                        <MessageCircle className="w-5 h-5 text-purple-300" />
                        {t.requestBtn}
                    </button>
                    <button
                        onClick={onBuyLevel}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-black shadow-lg shadow-green-900/20 hover:scale-105 transition-all active:scale-95"
                    >
                        <ShoppingCart className={`w-5 h-5 ${isRTL ? 'scale-x-[-1]' : ''}`} />
                        {t.buyBtn}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}