'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, RefreshCcw } from 'lucide-react'
import { useLocale } from 'next-intl'

interface ContactAdminModalProps {
    isOpen: boolean
    onClose: () => void
    defaultSubject?: string
    userEmail?: string
    userName?: string
}

export default function ContactAdminModal({
    isOpen,
    onClose,
    defaultSubject = '',
    userEmail = '',
    userName = '',
}: ContactAdminModalProps) {
    const locale = useLocale()
    const isRTL = locale === 'ar'

    const [formData, setFormData] = useState({
        name: userName,
        email: userEmail,
        subject: defaultSubject,
        message: '',
        type: defaultSubject.includes('Attempt') ? 'extra_attempt' : 'general',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [mounted, setMounted] = useState(false)

    // Translations
    const translations = {
        en: {
            title: 'Contact Admin',
            subtitle: "We'll get back to you soon!",
            name: 'Name',
            namePlaceholder: 'Your name',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            subject: 'Subject',
            subjectPlaceholder: 'Select a subject...',
            message: 'Message',
            messagePlaceholder: 'Tell us how we can help...',
            sending: 'Sending...',
            success: 'Message Sent!',
            error: 'Failed to send. Try again.',
            send: 'Send Message',
            subjects: {
                attempt: 'Request Extra Test Attempt',
                results: 'Question About Results',
                tech: 'Technical Issue',
                other: 'Other'
            }
        },
        ar: {
            title: 'تواصل مع الإدارة',
            subtitle: 'سنقوم بالرد عليك في أقرب وقت ممكن!',
            name: 'الاسم',
            namePlaceholder: 'اسمك الكريم',
            email: 'البريد الإلكتروني',
            emailPlaceholder: 'email@example.com',
            subject: 'الموضوع',
            subjectPlaceholder: 'اختر الموضوع...',
            message: 'الرسالة',
            messagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
            sending: 'جاري الإرسال...',
            success: 'تم إرسال الرسالة!',
            error: 'فشل الإرسال. حاول مرة أخرى.',
            send: 'إرسال الرسالة',
            subjects: {
                attempt: 'طلب محاولة اختبار إضافية',
                results: 'سؤال حول النتائج',
                tech: 'مشكلة تقنية',
                other: 'أخرى'
            }
        }
    }

    const t = translations[locale as 'en' | 'ar'] || translations.en

    useEffect(() => {
        setMounted(true)
    }, [])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const response = await fetch('/api/contact-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error('Failed to send')

            setSubmitStatus('success')
            setTimeout(() => {
                onClose()
                setSubmitStatus('idle')
                setFormData(prev => ({ ...prev, message: '' }))
            }, 2000)
        } catch {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const subjectOptions = [
        { value: 'Request Extra Test Attempt', label: t.subjects.attempt },
        { value: 'Question About Results', label: t.subjects.results },
        { value: 'Technical Issue', label: t.subjects.tech },
        { value: 'Other', label: t.subjects.other },
    ]

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
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`bg-[#1a0b2e] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl ${isRTL ? 'font-arabic' : ''}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <h2 className="text-xl font-bold text-white">{t.title}</h2>
                                    <p className="text-purple-200 text-sm">{t.subtitle}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-purple-200 text-sm mb-2 ${isRTL ? 'text-right' : ''}`}>{t.name}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 ${isRTL ? 'text-right' : ''}`}
                                    placeholder={t.namePlaceholder}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-purple-200 text-sm mb-2 ${isRTL ? 'text-right' : ''}`}>{t.email}</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 ${isRTL ? 'text-right' : ''}`}
                                    placeholder={t.emailPlaceholder}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-purple-200 text-sm mb-2 ${isRTL ? 'text-right' : ''}`}>{t.subject}</label>
                            <select
                                value={formData.subject}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    subject: e.target.value,
                                    type: e.target.value.includes('Attempt') ? 'extra_attempt' : 'general'
                                }))}
                                className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 ${isRTL ? 'text-right' : ''}`}
                                required
                            >
                                <option value="" className="bg-[#1a0b2e]">{t.subjectPlaceholder}</option>
                                {subjectOptions.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-[#1a0b2e]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={`block text-purple-200 text-sm mb-2 ${isRTL ? 'text-right' : ''}`}>{t.message}</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 resize-none ${isRTL ? 'text-right' : ''}`}
                                placeholder={t.messagePlaceholder}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || submitStatus === 'success'}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''} ${submitStatus === 'success'
                                ? 'bg-green-500 text-white'
                                : submitStatus === 'error'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98]'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                    {t.sending}
                                </>
                            ) : submitStatus === 'success' ? (
                                <>✓ {t.success}</>
                            ) : submitStatus === 'error' ? (
                                <>{t.error}</>
                            ) : (
                                <>
                                    <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                                    {t.send}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}