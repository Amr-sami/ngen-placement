'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

interface UseContactFormArgs {
    isOpen: boolean
    onClose: () => void
    defaultSubject: string
    userEmail: string
    userName: string
}

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
} as const

export function useContactForm({
    isOpen,
    onClose,
    defaultSubject,
    userEmail,
    userName,
}: UseContactFormArgs) {
    const locale = useLocale() as 'en' | 'ar'
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

    const t = translations[locale] || translations.en

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

    const updateField = (field: string, value: string) => {
        if (field === 'subject') {
            setFormData(prev => ({
                ...prev,
                subject: value,
                type: value.includes('Attempt') ? 'extra_attempt' : 'general'
            }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const subjectOptions = [
        { value: 'Request Extra Test Attempt', label: t.subjects.attempt },
        { value: 'Question About Results', label: t.subjects.results },
        { value: 'Technical Issue', label: t.subjects.tech },
        { value: 'Other', label: t.subjects.other },
    ]

    return {
        locale,
        isRTL,
        formData,
        isSubmitting,
        submitStatus,
        mounted,
        t,
        subjectOptions,
        handleSubmit,
        updateField,
    }
}
