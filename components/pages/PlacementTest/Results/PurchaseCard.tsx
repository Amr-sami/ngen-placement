'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Tag, Package, MessageCircle } from 'lucide-react'
import type { BeltLevel } from './types'
import { formatPrice } from '@/lib/hooks/useUserLocation'
import type { PricingResponse } from '@/app/api/pricing/route'

interface PurchaseCardProps {
    isOpen: boolean
    onClose: () => void
    belt: BeltLevel
}

type PurchaseOption = 'perBelt' | 'package' | 'organization';

export default function PurchaseCard({ isOpen, onClose, belt }: PurchaseCardProps) {
    const [pricing, setPricing] = useState<PricingResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const [selectedOption, setSelectedOption] = useState<PurchaseOption>('perBelt')

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
                const response = await fetch('/api/pricing')
                if (response.ok) {
                    const data = await response.json()
                    setPricing(data)
                }
            } catch (error) {
                console.error('Error fetching pricing:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPricing()
    }, [isOpen])

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

    // Get belt pricing from API response
    const getBeltPrice = () => {
        if (!pricing) return null
        const beltData = pricing.option1_perBelt.belts.find(
            b => b.belt.toLowerCase().includes(belt.belt.toLowerCase())
        )
        return beltData
    }

    // Get package that contains this belt
    const getPackageForBelt = () => {
        if (!pricing) return null
        const beltCode = belt.belt.toLowerCase()
        return pricing.option2_packages.find(pkg =>
            pkg.belts.some(b => b.toLowerCase().includes(beltCode))
        )
    }

    const beltPricing = getBeltPrice()
    const packagePricing = getPackageForBelt()
    const currency = pricing?.currency || 'USD'

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
                    className="bg-[#1a0b2e] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
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
                                className="absolute top-0 right-0 p-2 hover:bg-white/10 rounded-full transition-colors"
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
                                {belt.belt} Belt
                            </h2>
                            <p className="text-purple-200 text-sm">
                                {belt.stage} Stage • {belt.focus}
                            </p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="p-5 border-t border-white/10">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-purple-200 text-sm">Loading pricing...</p>
                            </div>
                        ) : (
                            <>
                                {/* Option Tabs */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setSelectedOption('perBelt')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'perBelt'
                                            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                            : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                            }`}
                                    >
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        Per Belt
                                    </button>
                                    {packagePricing && (
                                        <button
                                            onClick={() => setSelectedOption('package')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'package'
                                                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <Package className="w-4 h-4 inline mr-1" />
                                            Package
                                        </button>
                                    )}
                                    {!pricing?.option3_organization?.hidden && (
                                        <button
                                            onClick={() => setSelectedOption('organization')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${selectedOption === 'organization'
                                                ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                                                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                                }`}
                                        >
                                            <MessageCircle className="w-4 h-4 inline mr-1" />
                                            Org
                                        </button>
                                    )}
                                </div>

                                {/* Per Belt Option */}
                                {selectedOption === 'perBelt' && beltPricing && (
                                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-5 mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Tag className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400 text-xs font-bold uppercase tracking-wider">
                                                {belt.belt} Belt • {pricing?.option1_perBelt.discountPercent}% Off
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-4xl font-black text-white">
                                                {formatPrice(beltPricing.finalPrice, currency)}
                                            </span>
                                        </div>
                                        <p className="text-center text-green-300/60 text-xs mt-2">
                                            Base: {formatPrice(beltPricing.basePrice, currency)}
                                        </p>
                                    </div>
                                )}

                                {/* Package Option */}
                                {selectedOption === 'package' && packagePricing && (
                                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-5 mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Package className="w-4 h-4 text-purple-400" />
                                            <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">
                                                {packagePricing.name} • {packagePricing.discountPercent}% Off
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-4xl font-black text-white">
                                                {formatPrice(packagePricing.finalPrice, currency)}
                                            </span>
                                        </div>
                                        <p className="text-center text-purple-300/60 text-xs mt-2">
                                            Includes: {packagePricing.belts.join(', ')}
                                        </p>
                                    </div>
                                )}

                                {/* Organization Option */}
                                {selectedOption === 'organization' && (
                                    <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-5 mb-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <MessageCircle className="w-4 h-4 text-orange-400" />
                                            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">
                                                Organizations / Schools
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-2xl font-black text-white">
                                                Custom Pricing
                                            </span>
                                        </div>
                                        <p className="text-center text-orange-300/60 text-xs mt-2">
                                            Bulk enrollment & custom curriculum
                                        </p>
                                    </div>
                                )}

                                {/* Course Details */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{belt.duration}</p>
                                        <p className="text-purple-300 text-xs">Duration</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{belt.totalHours}</p>
                                        <p className="text-purple-300 text-xs">Hours</p>
                                    </div>
                                    <div className="text-center p-2 bg-white/5 rounded-lg">
                                        <p className="text-white font-bold text-sm">{belt.totalClasses}</p>
                                        <p className="text-purple-300 text-xs">Classes</p>
                                    </div>
                                </div>

                                {/* Purchase Button */}
                                <button
                                    disabled
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500/50 to-emerald-600/50 text-white/70 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    Coming Soon
                                </button>

                                <p className="text-center text-purple-300/60 text-xs mt-2">
                                    Payment options will be available soon
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
