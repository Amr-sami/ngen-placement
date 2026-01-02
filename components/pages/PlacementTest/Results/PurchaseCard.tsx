'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Tag, Package, MessageCircle } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { BeltLevel } from './types'
import { beltLevels, getLocalizedBeltValue } from './types'
import { formatPrice } from '@/hooks/useUserLocation'
import type { PricingResponse, PackagePricing, PackageBeltInfo } from '@/app/api/pricing/route'

interface PurchaseCardProps {
    isOpen: boolean
    onClose: () => void
    belt: BeltLevel
}

type PurchaseOption = 'perBelt' | 'package' | 'organization';

// Helper to parse numeric values from strings (for English values)
const parseStats = (belts: BeltLevel[], locale: 'en' | 'ar') => {
    let minMonths = 0;
    let maxMonths = 0;
    let totalHrs = 0;
    let totalCls = 0;

    belts.forEach(b => {
        // Parse Duration (e.g., "1 Month", "3-4 Months")
        const durationEn = b.duration.en;
        const durMatch = durationEn.match(/(\d+)(?:-(\d+))?/);
        if (durMatch) {
            const min = parseInt(durMatch[1]);
            const max = durMatch[2] ? parseInt(durMatch[2]) : min;
            minMonths += min;
            maxMonths += max;
        }

        // Parse Hours
        const hoursEn = b.totalHours.en;
        const hrMatch = hoursEn.match(/(\d+)/);
        if (hrMatch) totalHrs += parseInt(hrMatch[1]);

        // Parse Classes
        const classesEn = b.totalClasses.en;
        const clsMatch = classesEn.match(/(\d+)/);
        if (clsMatch) totalCls += parseInt(clsMatch[1]);
    });

    if (locale === 'ar') {
        return {
            duration: minMonths === maxMonths ? `${minMonths} أشهر` : `${minMonths}-${maxMonths} أشهر`,
            totalHours: `${totalHrs} ساعة`,
            totalClasses: `${totalCls} حصة`
        };
    }

    return {
        duration: minMonths === maxMonths ? `${minMonths} Months` : `${minMonths}-${maxMonths} Months`,
        totalHours: `${totalHrs} hrs`,
        totalClasses: `${totalCls} Classes`
    };
}

export default function PurchaseCard({ isOpen, onClose, belt }: PurchaseCardProps) {
    const locale = useLocale() as 'en' | 'ar'
    const isRTL = locale === 'ar'

    const [pricing, setPricing] = useState<PricingResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [selectedOption, setSelectedOption] = useState<PurchaseOption>('perBelt')

    // Get localized values
    const beltDisplayName = getLocalizedBeltValue(belt, 'beltName', locale)
    const stageDisplay = getLocalizedBeltValue(belt, 'stage', locale)
    const focusDisplay = getLocalizedBeltValue(belt, 'focus', locale)

    // Only render portal on client side
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch pricing from API
    useEffect(() => {
        const fetchPricing = async () => {
            if (!isOpen) return

            setIsLoading(true)
            try {
                const response = await fetch(`/api/pricing?locale=${locale}`)
                if (response.ok) {
                    const data = await response.json()
                    setPricing(data)

                    // If "perBelt" is disabled, switch to another available option
                    if (!data.option1_perBelt?.enabled) {
                        // Check if package is available for this belt
                        const beltCode = belt.belt.toLowerCase()
                        const pkg = data.option2_packages?.find((p: PackagePricing) =>
                            p.belts.some((b: PackageBeltInfo) => b.code.toLowerCase() === beltCode)
                        )
                        const isPackageAvailable = pkg && pkg.enabled && !pkg.showAsSingleBelt

                        if (isPackageAvailable) {
                            setSelectedOption('package')
                        } else if (data.option3_organization?.enabled && !data.option3_organization?.hidden) {
                            setSelectedOption('organization')
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching pricing:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPricing()
    }, [isOpen, locale])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen || !mounted) return null

    // Translations
    const t = {
        en: {
            perBelt: 'Per Belt',
            package: 'Package',
            org: 'Org',
            loading: 'Loading pricing...',
            off: 'Off',
            base: 'Base',
            yourLevel: 'Your level',
            customPricing: 'Custom Pricing',
            bulkEnrollment: 'Bulk enrollment & custom curriculum',
            duration: 'Duration',
            hours: 'Hours',
            classes: 'Classes',
            comingSoon: 'Coming Soon',
            paymentSoon: 'Payment options will be available soon',
            orgsSchools: 'Organizations / Schools',
        },
        ar: {
            perBelt: 'لكل حزام',
            package: 'الباقة',
            org: 'مؤسسات',
            loading: 'جاري تحميل الأسعار...',
            off: 'خصم',
            base: 'السعر الأساسي',
            yourLevel: 'مستواك',
            customPricing: 'أسعار مخصصة',
            bulkEnrollment: 'تسجيل جماعي ومنهج مخصص',
            duration: 'المدة',
            hours: 'الساعات',
            classes: 'الحصص',
            comingSoon: 'قريباً',
            paymentSoon: 'خيارات الدفع ستكون متاحة قريباً',
            orgsSchools: 'المؤسسات / المدارس',
        }
    }[locale]

    // Get belt pricing from API response
    const getBeltPrice = () => {
        if (!pricing) return null
        const beltData = pricing.option1_perBelt.belts.find(
            b => b.code.toLowerCase() === belt.belt.toLowerCase()
        )
        return beltData
    }

    // Get package that contains this belt
    const getPackageForBelt = () => {
        if (!pricing) return null
        const beltCode = belt.belt.toLowerCase()
        return pricing.option2_packages.find(pkg =>
            pkg.belts.some(b => b.code.toLowerCase() === beltCode)
        )
    }

    const beltPricing = getBeltPrice()
    const packagePricing = getPackageForBelt()
    const currency = pricing?.currency || 'USD'

    // Calculate package stats
    let displayStats = {
        duration: getLocalizedBeltValue(belt, 'duration', locale),
        totalHours: getLocalizedBeltValue(belt, 'totalHours', locale),
        totalClasses: getLocalizedBeltValue(belt, 'totalClasses', locale)
    };

    if (selectedOption === 'package' && packagePricing) {
        // Find matched belt levels from metadata
        const includedBelts = beltLevels.filter(b =>
            packagePricing.belts.some(pb => pb.code.toLowerCase() === b.belt.toLowerCase())
        );
        if (includedBelts.length > 0) {
            displayStats = parseStats(includedBelts, locale);
        }
    }

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
                                                ? '' // Styles handled by inline style
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

                                {/* Purchase Button */}
                                {selectedOption === 'perBelt' ? (
                                    <button
                                        disabled
                                        className="w-full py-3 rounded-xl text-white/70 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                        style={{
                                            background: `linear-gradient(to right, ${belt.color}80, ${belt.color}40)`,
                                        }}
                                    >
                                        {t.comingSoon}
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

                                <p className="text-center text-purple-300/60 text-xs mt-2">
                                    {t.paymentSoon}
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}
