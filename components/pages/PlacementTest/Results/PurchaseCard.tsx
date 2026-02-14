'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Tag, Package, MessageCircle, AlertCircle } from 'lucide-react'
import type { BeltLevel, StudentInfo } from './types'
import { formatPrice } from '@/hooks/useUserLocation'
import { usePurchase } from './hooks/usePurchase'

interface PurchaseCardProps {
    isOpen: boolean
    onClose: () => void
    belt: BeltLevel
    userInfo: StudentInfo
}

export default function PurchaseCard({ isOpen, onClose, belt, userInfo }: PurchaseCardProps) {
    const {
        locale,
        isRTL,
        pricing,
        isLoading,
        isPurchasing,
        purchaseError,
        mounted,
        selectedOption,
        setSelectedOption,
        beltDisplayName,
        stageDisplay,
        focusDisplay,
        t,
        beltPricing,
        packagePricing,
        currency,
        displayStats,
        handlePurchase,
    } = usePurchase(isOpen, belt, userInfo)

    if (!isOpen || !mounted) return null

    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`bg-[#1a0b2e] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto ${isRTL ? 'font-arabic' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header with Glow */}
                    <div className="relative p-6 text-center overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-30 blur-[60px]"
                            style={{ backgroundColor: belt.color }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0b2e]"></div>

                        <div className="relative z-10">
                            <button
                                onClick={onClose}
                                className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-2 hover:bg-white/10 rounded-full transition-colors`}
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>

                            <div
                                className="w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center mb-3 shadow-2xl"
                                style={{ backgroundColor: belt.color, borderColor: belt.borderColor }}
                            >
                                <Sparkles className="w-8 h-8" style={{ color: belt.textColor }} />
                            </div>

                            <h2 className="text-xl font-black text-white mb-1">
                                {beltDisplayName}
                            </h2>
                            <p className="text-purple-200 text-sm">
                                {stageDisplay} • {focusDisplay}
                            </p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="p-5 border-t border-white/10">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-purple-200 text-sm">{t.loading}</p>
                            </div>
                        ) : (
                            <>
                                {/* Option Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {/* Per Belt Option Button */}
                                    {pricing?.option1_perBelt?.enabled && (
                                        <button
                                            onClick={() => setSelectedOption('perBelt')}
                                            style={
                                                selectedOption === 'perBelt'
                                                    ? {
                                                        backgroundColor: `${belt.color}33`,
                                                        borderColor: `${belt.color}80`,
                                                        color: belt.color,
                                                    }
                                                    : {}
                                            }
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'perBelt'
                                                ? ''
                                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <Tag className={`w-4 h-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                            {t.perBelt}
                                        </button>
                                    )}

                                    {/* Package Option Button */}
                                    {packagePricing && packagePricing.enabled && !packagePricing.showAsSingleBelt && (
                                        <button
                                            onClick={() => setSelectedOption('package')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'package'
                                                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <Package className={`w-4 h-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                            {t.package}
                                        </button>
                                    )}

                                    {/* Organization Option Button */}
                                    {!pricing?.option3_organization?.hidden && pricing?.option3_organization?.enabled && (
                                        <button
                                            onClick={() => setSelectedOption('organization')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'organization'
                                                ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <MessageCircle className={`w-4 h-4 inline ${isRTL ? 'ml-1' : 'mr-1'}`} />
                                            {t.org}
                                        </button>
                                    )}
                                </div>

                                {/* Per Belt Option */}
                                {selectedOption === 'perBelt' && beltPricing && (
                                    <div
                                        className="rounded-2xl p-5 mb-4 border"
                                        style={{
                                            background: `linear-gradient(135deg, ${belt.color}20, ${belt.color}10)`,
                                            borderColor: `${belt.color}40`,
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Tag className="w-4 h-4" style={{ color: belt.color }} />
                                            <span
                                                className="text-xs font-bold uppercase tracking-wider"
                                                style={{ color: belt.color }}
                                            >
                                                {beltDisplayName} • {pricing?.option1_perBelt.discountPercent}% {t.off}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-4xl font-black text-white">
                                                {formatPrice(beltPricing.finalPrice, currency)}
                                            </span>
                                        </div>
                                        <p className="text-center text-xs mt-2 text-white/60">
                                            {t.base}: {formatPrice(beltPricing.basePrice, currency)}
                                        </p>
                                    </div>
                                )}

                                {/* Package Option */}
                                {selectedOption === 'package' && packagePricing && (
                                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-5 mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-purple-400" />
                                            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">
                                                {packagePricing.name} • {packagePricing.discountPercent}% {t.off}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-4xl font-black text-white">
                                                {formatPrice(packagePricing.skippedBeltsValue > 0 ? packagePricing.adjustedFinalPrice : packagePricing.finalPrice, currency)}
                                            </span>
                                            {packagePricing.skippedBeltsValue > 0 && (
                                                <span className="text-purple-300/60 text-sm line-through ml-2">
                                                    {formatPrice(packagePricing.baseTotal, currency)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            {packagePricing.belts.map(b => (
                                                <p
                                                    key={b.code}
                                                    className={`text-center text-xs ${b.status === 'passed'
                                                        ? 'text-purple-300/40 line-through'
                                                        : b.status === 'starting'
                                                            ? 'font-bold'
                                                            : 'text-purple-300/60'
                                                        }`}
                                                    style={b.status === 'starting' ? { color: belt.color } : {}}
                                                >
                                                    {b.name}
                                                    {b.status === 'passed' && ' ✓'}
                                                    {b.status === 'starting' && ` ← ${t.yourLevel}`}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Organization Option */}
                                {selectedOption === 'organization' && (
                                    <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-5 mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <MessageCircle className="w-4 h-4 text-orange-400" />
                                            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
                                                {t.orgsSchools}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-2xl font-black text-white">
                                                {t.customPricing}
                                            </span>
                                        </div>
                                        <p className="text-center text-orange-300/60 text-xs mt-2">
                                            {t.bulkEnrollment}
                                        </p>
                                    </div>
                                )}

                                {/* Course Details */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{displayStats.duration}</p>
                                        <p className="text-purple-300 text-xs">{t.duration}</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{displayStats.totalHours}</p>
                                        <p className="text-purple-300 text-xs">{t.hours}</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{displayStats.totalClasses}</p>
                                        <p className="text-purple-300 text-xs">{t.classes}</p>
                                    </div>
                                </div>

                                {purchaseError && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{purchaseError}</span>
                                    </div>
                                )}

                                {/* Purchase Button */}
                                {selectedOption === 'perBelt' ? (
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing || !beltPricing?.beltId}
                                        className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all
                                            ${isPurchasing || !beltPricing?.beltId
                                                ? 'opacity-70 cursor-not-allowed'
                                                : 'hover:opacity-90 hover:scale-[1.02]'
                                            }`}
                                        style={{
                                            background: `linear-gradient(to right, ${belt.color}80, ${belt.color}40)`,
                                        }}
                                    >
                                        {isPurchasing ? t.processing : t.buyNow}
                                    </button>
                                ) : selectedOption === 'package' ? (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500/50 to-pink-600/50 text-white/70 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        {t.comingSoon}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500/50 to-red-600/50 text-white/70 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        {t.comingSoon}
                                    </button>
                                )}

                                {selectedOption !== 'perBelt' && (
                                    <p className="text-center text-purple-300/60 text-xs mt-2">
                                        {t.paymentSoon}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}
