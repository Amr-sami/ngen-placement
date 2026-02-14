'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, RefreshCcw } from 'lucide-react'
import { useContactForm } from './hooks/useContactForm'

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
    const {
        isRTL,
        formData,
        isSubmitting,
        submitStatus,
        mounted,
        t,
        subjectOptions,
        handleSubmit,
        updateField,
    } = useContactForm({ isOpen, onClose, defaultSubject, userEmail, userName })

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
                                    onChange={e => updateField('name', e.target.value)}
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
                                    onChange={e => updateField('email', e.target.value)}
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
                                onChange={e => updateField('subject', e.target.value)}
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
                                onChange={e => updateField('message', e.target.value)}
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