'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle, RefreshCcw } from 'lucide-react'

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

    // Only render portal on client side
    useEffect(() => {
        setMounted(true)
    }, [])

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
        { value: 'Request Extra Test Attempt', label: '🎯 Request Extra Test Attempt' },
        { value: 'Question About Results', label: '❓ Question About Results' },
        { value: 'Technical Issue', label: '🔧 Technical Issue' },
        { value: 'Other', label: '💬 Other' },
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
                    className="bg-[#1a0b2e] border border-white/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Contact Admin</h2>
                                    <p className="text-purple-200 text-sm">We&apos;ll get back to you soon!</p>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-purple-200 text-sm mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50"
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-purple-200 text-sm mb-2">Subject</label>
                            <select
                                value={formData.subject}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    subject: e.target.value,
                                    type: e.target.value.includes('Attempt') ? 'extra_attempt' : 'general'
                                }))}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                                required
                            >
                                <option value="" className="bg-[#1a0b2e]">Select a subject...</option>
                                {subjectOptions.map(opt => (
                                    <option key={opt.value} value={opt.value} className="bg-[#1a0b2e]">
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-purple-200 text-sm mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                                placeholder="Tell us how we can help..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || submitStatus === 'success'}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${submitStatus === 'success'
                                ? 'bg-green-500 text-white'
                                : submitStatus === 'error'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:scale-[1.02] active:scale-[0.98]'
                                } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : submitStatus === 'success' ? (
                                <>✓ Message Sent!</>
                            ) : submitStatus === 'error' ? (
                                <>Failed to send. Try again.</>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Message
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
