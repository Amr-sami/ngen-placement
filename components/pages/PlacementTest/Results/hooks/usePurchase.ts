'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { BeltLevel } from '../types'
import { beltLevels, getLocalizedBeltValue } from '../types'
import type { PricingResponse, PackagePricing, PackageBeltInfo } from '@/app/api/pricing/route'

type PurchaseOption = 'perBelt' | 'package' | 'organization'

interface StudentInfo {
    email: string
    name: string
    phone: string
}

/** Aggregate stats across multiple belt levels */
function parseStats(belts: BeltLevel[], locale: 'en' | 'ar') {
    let minMonths = 0
    let maxMonths = 0
    let totalHrs = 0
    let totalCls = 0

    belts.forEach(b => {
        const durationEn = b.duration.en
        const durMatch = durationEn.match(/(\d+)(?:-(\d+))?/)
        if (durMatch) {
            const min = parseInt(durMatch[1])
            const max = durMatch[2] ? parseInt(durMatch[2]) : min
            minMonths += min
            maxMonths += max
        }

        const hoursEn = b.totalHours.en
        const hrMatch = hoursEn.match(/(\d+)/)
        if (hrMatch) totalHrs += parseInt(hrMatch[1])

        const classesEn = b.totalClasses.en
        const clsMatch = classesEn.match(/(\d+)/)
        if (clsMatch) totalCls += parseInt(clsMatch[1])
    })

    if (locale === 'ar') {
        return {
            duration: minMonths === maxMonths ? `${minMonths} أشهر` : `${minMonths}-${maxMonths} أشهر`,
            totalHours: `${totalHrs} ساعة`,
            totalClasses: `${totalCls} حصة`
        }
    }

    return {
        duration: minMonths === maxMonths ? `${minMonths} Months` : `${minMonths}-${maxMonths} Months`,
        totalHours: `${totalHrs} hrs`,
        totalClasses: `${totalCls} Classes`
    }
}

export function usePurchase(isOpen: boolean, belt: BeltLevel, userInfo: StudentInfo) {
    const locale = useLocale() as 'en' | 'ar'
    const isRTL = locale === 'ar'

    const [pricing, setPricing] = useState<PricingResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPurchasing, setIsPurchasing] = useState(false)
    const [purchaseError, setPurchaseError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const [selectedOption, setSelectedOption] = useState<PurchaseOption>('perBelt')

    // Localized belt values
    const beltDisplayName = getLocalizedBeltValue(belt, 'beltName', locale)
    const stageDisplay = getLocalizedBeltValue(belt, 'stage', locale)
    const focusDisplay = getLocalizedBeltValue(belt, 'focus', locale)

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
            buyNow: 'Buy Now',
            processing: 'Processing...',
            error: 'Payment failed. Please try again.',
            missingInfo: 'Please complete your profile first.'
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
            buyNow: 'شراء الآن',
            processing: 'جاري المعالجة...',
            error: 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.',
            missingInfo: 'يرجى إكمال ملفك الشخصي أولاً.'
        }
    }[locale]

    // Only render portal on client side
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch pricing from API
    useEffect(() => {
        const fetchPricing = async () => {
            if (!isOpen) return

            setIsLoading(true)
            setPurchaseError(null)
            try {
                const response = await fetch(`/api/pricing?locale=${locale}`)
                if (response.ok) {
                    const data = await response.json()
                    setPricing(data)

                    if (!data.option1_perBelt?.enabled) {
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

    // Derived pricing data
    const getBeltPrice = () => {
        if (!pricing) return null
        return pricing.option1_perBelt.belts.find(
            b => b.code.toLowerCase() === belt.belt.toLowerCase()
        ) ?? null
    }

    const getPackageForBelt = () => {
        if (!pricing) return null
        const beltCode = belt.belt.toLowerCase()
        return pricing.option2_packages.find(pkg =>
            pkg.belts.some(b => b.code.toLowerCase() === beltCode)
        ) ?? null
    }

    const beltPricing = getBeltPrice()
    const packagePricing = getPackageForBelt()
    const currency = pricing?.currency || 'USD'

    // Display stats
    let displayStats = {
        duration: getLocalizedBeltValue(belt, 'duration', locale),
        totalHours: getLocalizedBeltValue(belt, 'totalHours', locale),
        totalClasses: getLocalizedBeltValue(belt, 'totalClasses', locale)
    }

    if (selectedOption === 'package' && packagePricing) {
        const includedBelts = beltLevels.filter(b =>
            packagePricing.belts.some(pb => pb.code.toLowerCase() === b.belt.toLowerCase())
        )
        if (includedBelts.length > 0) {
            displayStats = parseStats(includedBelts, locale)
        }
    }

    const handlePurchase = async () => {
        if (!userInfo.email || !userInfo.name || !userInfo.phone) {
            setPurchaseError(t.missingInfo)
            return
        }

        if (selectedOption !== 'perBelt' || !beltPricing?.beltId) return

        setIsPurchasing(true)
        setPurchaseError(null)

        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    beltId: beltPricing.beltId,
                    customerName: userInfo.name,
                    customerEmail: userInfo.email,
                    customerPhone: userInfo.phone,
                    paymentMethod: 'card',
                    currency,
                    locale
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || t.error)
            }

            if (data.iframeUrl) {
                window.location.href = data.iframeUrl
            } else {
                throw new Error('No payment URL received')
            }
        } catch (error) {
            console.error('Purchase error:', error)
            setPurchaseError(error instanceof Error ? error.message : t.error)
            setIsPurchasing(false)
        }
    }

    return {
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
    }
}
