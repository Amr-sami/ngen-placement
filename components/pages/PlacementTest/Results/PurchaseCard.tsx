'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Sparkles, Tag } from 'lucide-react'
import type { BeltLevel } from './types'

interface PurchaseCardProps {
    isOpen: boolean
    onClose: () => void
    belt: BeltLevel
}

interface BeltPricing {
    price: number
    currency: string
}


export default function PurchaseCard({ isOpen, onClose, belt }: PurchaseCardProps) {
    const [pricing, setPricing] = useState<BeltPricing | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Only render portal on client side
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch belt pricing from database
    useEffect(() => {
        const fetchPricing = async () => {
            if (!isOpen) return

            setIsLoading(true)
            try {
                // TODO: Implement API to fetch belt pricing
                // For now, use placeholder pricing
                // const response = await fetch(`/api/belts/${belt.belt}/pricing`)
                // const data = await response.json()

                // Placeholder pricing - replace with actual API call
                const placeholderPricing: Record<string, BeltPricing> = {
                    'White': { price: 299, currency: 'USD' },
                    'Yellow': { price: 399, currency: 'USD' },
                    'Orange': { price: 499, currency: 'USD' },
                    'Green': { price: 599, currency: 'USD' },
                    'Blue': { price: 699, currency: 'USD' },
                    'Brown': { price: 799, currency: 'USD' },
                    'Black': { price: 999, currency: 'USD' },
                }

                setPricing(placeholderPricing[belt.belt] || { price: 399, currency: 'USD' })
            } catch (error) {
                console.error('Error fetching pricing:', error)
                setPricing({ price: 399, currency: 'USD' })
            } finally {
                setIsLoading(false)
            }
        }

        fetchPricing()
    }, [isOpen, belt.belt])

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
                    className="bg-[#1a0b2e] border border-white/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header with Glow */}
                    <div className="relative p-8 text-center overflow-hidden">
                        {/* Glow Effect */}
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

                            {/* Belt Badge */}
                            <div
                                className="w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center mb-4 shadow-2xl"
                                style={{ backgroundColor: belt.color, borderColor: belt.borderColor }}
                            >
                                <Sparkles className="w-10 h-10" style={{ color: belt.textColor }} />
                            </div>

                            <h2 className="text-2xl font-black text-white mb-1">
                                {belt.belt} Belt
                            </h2>
                            <p className="text-purple-200 text-sm">
                                {belt.stage} Stage • {belt.focus}
                            </p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="p-6 border-t border-white/10">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
                                <p className="text-purple-200 text-sm">Loading pricing...</p>
                            </div>
                        ) : (
                            <>
                                {/* Price Display */}
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Tag className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 text-sm font-bold uppercase tracking-wider">Course Price</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-5xl font-black text-white">
                                            ${pricing?.price || 399}
                                        </span>
                                        <span className="text-purple-200 text-lg ml-2">
                                            {pricing?.currency || 'USD'}
                                        </span>
                                    </div>
                                </div>

                                {/* Course Details */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <p className="text-white font-bold">{belt.duration}</p>
                                        <p className="text-purple-300 text-xs">Duration</p>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <p className="text-white font-bold">{belt.totalHours}</p>
                                        <p className="text-purple-300 text-xs">Hours</p>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-xl">
                                        <p className="text-white font-bold">{belt.totalClasses}</p>
                                        <p className="text-purple-300 text-xs">Classes</p>
                                    </div>
                                </div>

                                {/* Purchase Button - Currently Disabled */}
                                <button
                                    disabled
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500/50 to-emerald-600/50 text-white/70 font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Coming Soon
                                </button>

                                <p className="text-center text-purple-300/60 text-xs mt-3">
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
