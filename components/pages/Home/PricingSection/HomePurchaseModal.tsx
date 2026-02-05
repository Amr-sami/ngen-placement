'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Check, Package as PackageIcon, Zap, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { formatPrice } from '@/hooks/useUserLocation';
import type { BeltLevel } from '@/components/pages/PlacementTest/Results/types';
import type { PricingResponse, BeltPricing, PackagePricing, PackageBeltInfo } from '@/app/api/pricing/route';

// Define the types for the purchase item
export type PurchaseItem =
    | { type: 'package'; data: PackagePricing }
    | { type: 'belt'; data: BeltPricing; beltLevel: BeltLevel | null };

type Props = {
    isOpen: boolean;
    onClose: () => void;
    item: PurchaseItem | null;
    pricing: PricingResponse | null;
    currency: 'USD' | 'EGP';
};

// Form state type
interface PurchaseFormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'card' | 'wallet';
}

interface FormErrors {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    general?: string;
}

// Translations
const translations = {
    en: {
        secureBundle: 'SECURE YOUR BUNDLE',
        levelUp: 'LEVEL UP',
        bestValue: 'Best Value Offer',
        includes: 'Includes',
        levelsOfMastery: 'Levels of Mastery',
        save: 'Save',
        today: 'Today',
        whatsIncluded: "What's Included",
        start: 'Start',
        recommended: 'Recommended',
        dontMiss: "Don't miss this offer!",
        upgradeTo: 'Upgrade to',
        getLevels: 'Get',
        forMassiveDiscount: 'levels for a massive discount. Master the complete track and save big.',
        packagePrice: 'Package Price',
        youSave: 'You Save',
        switchToPackage: 'SWITCH TO PACKAGE',
        readyToMaster: 'Ready to master this level? Proceed below.',
        proceedToPayment: 'Proceed to Payment',
        processing: 'Processing...',
        secureEncryption: 'Secure 256-bit SSL Encryption',
        // Form labels
        fullName: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        enterName: 'Enter your full name',
        enterEmail: 'your@email.com',
        enterPhone: '+20 123 456 7890',
        paymentMethod: 'Payment Method',
        card: 'Card',
        wallet: 'Wallet',
        // Validation
        nameRequired: 'Name is required',
        nameMin: 'Name must be at least 2 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        phoneRequired: 'Phone number is required',
        phoneMin: 'Phone must be at least 10 digits',
        // Package notice
        packageNotice: 'Package purchases coming soon! Please select individual belts.',
    },
    ar: {
        secureBundle: 'احصل على الباقة',
        levelUp: 'ارتقِ بمستواك',
        bestValue: 'أفضل عرض',
        includes: 'يشمل',
        levelsOfMastery: 'مستويات',
        save: 'وفّر',
        today: 'اليوم',
        whatsIncluded: 'ما يشمله العرض',
        start: 'ابدأ',
        recommended: 'موصى به',
        dontMiss: 'لا تفوّت هذا العرض!',
        upgradeTo: 'ترقية إلى',
        getLevels: 'احصل على',
        forMassiveDiscount: 'مستويات بخصم كبير. أتقن المسار الكامل ووفّر أكثر.',
        packagePrice: 'سعر الباقة',
        youSave: 'توفيرك',
        switchToPackage: 'التحويل للباقة',
        readyToMaster: 'مستعد لإتقان هذا المستوى؟ تابع أدناه.',
        proceedToPayment: 'المتابعة للدفع',
        processing: 'جاري المعالجة...',
        secureEncryption: 'تشفير SSL آمن 256-bit',
        // Form labels
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        enterName: 'أدخل اسمك الكامل',
        enterEmail: 'your@email.com',
        enterPhone: '+20 123 456 7890',
        paymentMethod: 'طريقة الدفع',
        card: 'بطاقة',
        wallet: 'محفظة',
        // Validation
        nameRequired: 'الاسم مطلوب',
        nameMin: 'الاسم يجب أن يكون حرفين على الأقل',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
        phoneRequired: 'رقم الهاتف مطلوب',
        phoneMin: 'الهاتف يجب أن يكون 10 أرقام على الأقل',
        // Package notice
        packageNotice: 'شراء الباقات قريباً! يرجى اختيار الأحزمة الفردية.',
    }
};

export default function HomePurchaseModal({ isOpen, onClose, item, pricing, currency }: Props) {
    const params = useParams();
    const router = useRouter();
    const locale = (params?.locale as 'en' | 'ar') || 'en';
    const isRTL = locale === 'ar';
    const t = translations[locale] || translations.en;

    // State to switch between belt and package view (temporary - resets on close)
    const [viewPackage, setViewPackage] = useState(false);

    // Form state
    const [formData, setFormData] = useState<PurchaseFormData>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        paymentMethod: 'card',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for form inputs
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Reset view and form when modal closes or item changes
    useEffect(() => {
        if (!isOpen) {
            setViewPackage(false);
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                paymentMethod: 'card',
            });
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen || !item) return null;

    // Find upsell package if user selected a single belt
    const upsellPackage = item.type === 'belt' && pricing?.option2_packages
        ? pricing.option2_packages.find(p => p.belts.some(b => b.code === item.data.code))
        : null;

    // Handle switch to package
    const handleSwitchToPackage = () => {
        setViewPackage(true);
    };

    // Determine what to show - package view or belt view
    const showingPackage = item.type === 'package' || (item.type === 'belt' && viewPackage && upsellPackage);
    const currentPackage = item.type === 'package' ? item.data : upsellPackage;

    // Get the beltId for purchase
    const getBeltId = (): string | null => {
        if (item.type === 'belt' && item.data.beltId) {
            return item.data.beltId;
        }
        return null;
    };

    // Get the price based on what's being purchased
    const getPurchasePrice = (): number => {
        if (showingPackage && currentPackage) {
            return currentPackage.skippedBeltsValue > 0
                ? currentPackage.adjustedFinalPrice
                : currentPackage.finalPrice;
        }
        if (item.type === 'belt') {
            return item.data.finalPrice;
        }
        return 0;
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = t.nameRequired;
        } else if (formData.customerName.trim().length < 2) {
            newErrors.customerName = t.nameMin;
        }

        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = t.emailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
            newErrors.customerEmail = t.emailInvalid;
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = t.phoneRequired;
        } else if (formData.customerPhone.replace(/\D/g, '').length < 10) {
            newErrors.customerPhone = t.phoneMin;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Package purchases not yet supported
        if (showingPackage) {
            setErrors({ general: t.packageNotice });
            return;
        }

        const beltId = getBeltId();
        if (!beltId) {
            setErrors({ general: 'Unable to identify product. Please try again.' });
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    beltId,
                    customerName: formData.customerName.trim(),
                    customerEmail: formData.customerEmail.trim().toLowerCase(),
                    customerPhone: formData.customerPhone.trim(),
                    paymentMethod: formData.paymentMethod,
                    currency,
                    locale,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || data.error || 'Failed to create order';
                setErrors({ general: errorMessage });
                return;
            }

            // Direct redirect to Paymob for the "Enhanced Unified Checkout" experience
            if (data.iframeUrl) {
                window.location.href = data.iframeUrl;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            setErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle input change
    const handleInputChange = (field: keyof PurchaseFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field error when typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#2e165f]/60 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={`relative w-full max-w-2xl bg-[#FDFDFF] rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${isRTL ? 'font-arabic' : ''}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="relative h-24 bg-[#2e165f] flex items-center justify-center overflow-hidden shrink-0">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl translate-x-10 translate-y-10"></div>
                            </div>
                            <h2 className="relative z-10 text-white font-black text-2xl italic tracking-wider">
                                {showingPackage ? t.secureBundle : t.levelUp}
                            </h2>
                            <button
                                onClick={onClose}
                                className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">

                            {/* --- PACKAGE VIEW --- */}
                            {showingPackage && currentPackage && (
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">
                                            <Zap className="w-4 h-4 fill-orange-600" />
                                            {t.bestValue}
                                        </div>
                                        <h3 className="text-3xl font-black text-[#2e165f] mb-2">{currentPackage.name}</h3>
                                        <p className="text-slate-500 font-medium">{t.includes} {currentPackage.belts.length} {t.levelsOfMastery}</p>
                                    </div>

                                    {/* Price Tag */}
                                    <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                                        <div className="flex items-center justify-center gap-3 mb-1">
                                            <span className="text-5xl font-black text-[#2e165f]">
                                                {formatPrice(currentPackage.skippedBeltsValue > 0 ? currentPackage.adjustedFinalPrice : currentPackage.finalPrice, currency)}
                                            </span>
                                            <span className="text-lg text-slate-400 line-through decoration-red-400 decoration-2 font-bold">
                                                {formatPrice(currentPackage.skippedBeltsValue > 0 ? currentPackage.adjustedBaseTotal : currentPackage.baseTotal, currency)}
                                            </span>
                                        </div>
                                        <p className="text-green-500 font-black text-sm uppercase tracking-wide">
                                            {t.save} {Math.round(currentPackage.discountPercent)}% {t.today}
                                        </p>
                                    </div>

                                    {/* What's Included */}
                                    <div className="space-y-3">
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{t.whatsIncluded}</p>
                                        {currentPackage.belts.map((belt: PackageBeltInfo) => (
                                            <div key={belt.code} className={`flex items-center gap-3 p-3 rounded-2xl ${belt.status === 'passed' ? 'bg-slate-100 opacity-60' : 'bg-white border border-slate-100 shadow-sm'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${belt.status === 'passed' ? 'bg-slate-300' : 'bg-[#2e165f]/10'}`}>
                                                    <Check className={`w-4 h-4 ${belt.status === 'passed' ? 'text-white' : 'text-[#2e165f]'}`} />
                                                </div>
                                                <span className={`font-bold ${belt.status === 'passed' ? 'text-slate-400 line-through' : 'text-[#2e165f]'}`}>
                                                    {belt.name}
                                                </span>
                                                {belt.status === 'starting' && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-lg font-bold">{t.start}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {/* --- SINGLE BELT VIEW --- */}
                            {item.type === 'belt' && !viewPackage && (
                                <div className="space-y-8">
                                    <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div
                                            className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg text-white"
                                            style={{ backgroundColor: item.beltLevel?.color || '#333' }}
                                        >
                                            <Trophy className="w-10 h-10" />
                                        </div>
                                        <div className={isRTL ? 'text-right' : ''}>
                                            <h3 className="text-2xl font-black text-[#2e165f] mb-1">{item.data.belt}</h3>
                                            <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                <span className="text-3xl font-black text-[#2e165f]">
                                                    {formatPrice(item.data.finalPrice, currency)}
                                                </span>
                                                {item.data.basePrice > item.data.finalPrice && (
                                                    <span className="text-sm text-slate-400 line-through">
                                                        {formatPrice(item.data.basePrice, currency)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPSELL SECTION */}
                                    {upsellPackage && (
                                        <div className="relative overflow-hidden bg-gradient-to-br from-[#2e165f] to-[#4c249f] rounded-[2.5rem] p-6 text-white shadow-xl shadow-purple-900/20">
                                            <div className="relative z-10">
                                                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                                    <div className="bg-yellow-400 text-[#2e165f] text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                                                        <Zap className="w-3 h-3 fill-[#2e165f]" />
                                                        {t.recommended}
                                                    </div>
                                                    <span className="text-purple-200 text-sm font-bold">{t.dontMiss}</span>
                                                </div>

                                                <h4 className="text-xl font-black mb-2">{t.upgradeTo} {upsellPackage.name}</h4>
                                                <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                                                    {t.getLevels} <strong>{upsellPackage.belts.length}</strong> {t.forMassiveDiscount}
                                                </p>

                                                <div className={`flex items-center justify-between bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 mb-5`}>
                                                    <div>
                                                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold">{t.packagePrice}</p>
                                                        <p className="text-2xl font-black text-white">{formatPrice(upsellPackage.skippedBeltsValue > 0 ? upsellPackage.adjustedFinalPrice : upsellPackage.finalPrice, currency)}</p>
                                                    </div>
                                                    <div className={isRTL ? 'text-left' : 'text-right'}>
                                                        <p className="text-xs text-purple-200 uppercase tracking-wide font-bold">{t.youSave}</p>
                                                        <p className="text-xl font-black text-green-400">{Math.round(upsellPackage.discountPercent)}%</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleSwitchToPackage}
                                                    className="w-full py-4 bg-white text-[#2e165f] rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
                                                >
                                                    <PackageIcon className="w-4 h-4" />
                                                    {t.switchToPackage}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {!upsellPackage && (
                                        <p className="text-slate-500 text-sm">
                                            {t.readyToMaster}
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Footer with Form */}
                        <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 space-y-4">
                            {/* General Error */}
                            {errors.general && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                    {errors.general}
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.fullName}</label>
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        value={formData.customerName}
                                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                                        placeholder={t.enterName}
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.customerName ? 'border-red-300 bg-red-50' : 'border-slate-200'} bg-white text-[#2e165f] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2e165f]/20 focus:border-[#2e165f] transition-all disabled:opacity-50`}
                                    />
                                    {errors.customerName && <p className="text-xs text-red-500">{errors.customerName}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.email}</label>
                                    <input
                                        type="email"
                                        value={formData.customerEmail}
                                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                                        placeholder={t.enterEmail}
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.customerEmail ? 'border-red-300 bg-red-50' : 'border-slate-200'} bg-white text-[#2e165f] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2e165f]/20 focus:border-[#2e165f] transition-all disabled:opacity-50`}
                                    />
                                    {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.phone}</label>
                                    <input
                                        type="tel"
                                        value={formData.customerPhone}
                                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                        placeholder={t.enterPhone}
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.customerPhone ? 'border-red-300 bg-red-50' : 'border-slate-200'} bg-white text-[#2e165f] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2e165f]/20 focus:border-[#2e165f] transition-all disabled:opacity-50`}
                                    />
                                    {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone}</p>}
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.paymentMethod}</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => !isSubmitting && handleInputChange('paymentMethod', 'card')}
                                            disabled={isSubmitting}
                                            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${formData.paymentMethod === 'card' ? 'border-[#2e165f] bg-[#2e165f] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:opacity-50`}
                                        >
                                            💳 {t.card}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => !isSubmitting && handleInputChange('paymentMethod', 'wallet')}
                                            disabled={isSubmitting}
                                            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${formData.paymentMethod === 'wallet' ? 'border-[#2e165f] bg-[#2e165f] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:opacity-50`}
                                        >
                                            📱 {t.wallet}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-5 rounded-2xl bg-[#2e165f] text-white font-black text-base shadow-xl shadow-purple-900/10 flex items-center justify-center gap-2 hover:bg-[#3d1d7a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t.processing}
                                    </>
                                ) : (
                                    <>
                                        {t.proceedToPayment} • {formatPrice(getPurchasePrice(), currency)}
                                    </>
                                )}
                            </button>
                            <p className="text-center text-slate-400 text-xs font-bold">
                                🔒 {t.secureEncryption}
                            </p>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
