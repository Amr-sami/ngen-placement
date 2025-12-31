'use client'

import React, { useState } from 'react'
import Logo from '../Logo'
import Image from 'next/image'
import { sendEmail } from '@/lib/resend'
import { IoLogoWhatsapp } from 'react-icons/io'
import { useLocale } from 'next-intl'

import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'

const MESSAGES = { en: enMessages, ar: arMessages } as const

const ContactUs = () => {
  const locale = useLocale() as 'en' | 'ar'
  const isRTL = locale === 'ar'

  const contact = (MESSAGES[locale]?.contact ?? MESSAGES.en.contact)

  // Always use default labels for consistency across all pages
  const pageKey = 'default' as const

  const t = {
    title: contact.title,
    getInTouch: contact.getInTouch,
    subTitle: contact.subTitle,

    firstName: contact.fields.firstName[pageKey],
    lastName: contact.fields.lastName[pageKey],
    emailLabel: contact.fields.emailLabel[pageKey],
    companyLabel: contact.fields.companyLabel[pageKey],
    studentsLabel: contact.fields.studentsLabel[pageKey],

    messageLabel: contact.fields.messageLabel,

    placeholderFirst: contact.fields.placeholders.first,
    placeholderLast: contact.fields.placeholders.last,
    placeholderEmail: contact.fields.placeholders.emailDefault,
    placeholderCompany: contact.fields.placeholders.companyDefault,
    placeholderStudents: contact.fields.placeholders.students,
    placeholderMsg: contact.fields.placeholders.message,

    sendBtn: contact.buttons.send,
    sendingBtn: contact.buttons.sending,

    whatsapp: contact.whatsapp.label,

    successMsg: contact.messages.success,
    errorMsg: contact.messages.error,

    reqFirst: contact.validation.reqFirst,
    reqLast: contact.validation.reqLast,
    reqEmail: contact.validation.reqEmail,
    invEmail: contact.validation.invEmail,

    ourLocations: contact.ourLocations,
    locations: contact.locations,
  }

  const contactDetails = {
    email: 'Info@ngenschools.com',
    whatsappLink: 'https://wa.me/201055023774',
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
    companyName: '',
    numberOfStudents: '',
    message: '',
  })

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    companyMail: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name as keyof typeof errors]) setErrors({ ...errors, [name]: '' })
    if (submitStatus.success !== undefined) setSubmitStatus({})
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      firstName: formData.firstName.trim() === '' ? t.reqFirst : '',
      lastName: formData.lastName.trim() === '' ? t.reqLast : '',
      companyMail:
        formData.companyMail.trim() === '' ? t.reqEmail : !isValidEmail(formData.companyMail) ? t.invEmail : '',
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some(error => error !== '')) return

    setIsSubmitting(true)
    try {
      await sendEmail(formData)
      setSubmitStatus({ success: true, message: t.successMsg })
      setFormData({ firstName: '', lastName: '', companyMail: '', companyName: '', numberOfStudents: '', message: '' })
      setTimeout(() => setSubmitStatus({}), 5000)
    } catch (error) {
      console.error('Email sending error:', error)
      setSubmitStatus({ success: false, message: t.errorMsg })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
      <h3 className="font-bold text-xl text-purple-dark font-protestRiot mb-8 xl:mb-10 md:text-2xl xl:text-3xl">
        {t.title}
      </h3>

      <div className="flex flex-col lg:flex-row p-4 sm:p-6 rounded-3xl border border-solid border-gray-200 gap-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* FORM CONTAINER */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 basis-4/6 p-4 sm:p-6 lg:p-8 rounded-2xl">
          <h5 className={`font-bold text-pumpkin text-xl xl:text-2xl mb-2 ${isRTL ? 'text-right' : ''}`}>
            {t.getInTouch}
          </h5>
          <p className={`text-gray-600 text-sm mb-6 ${isRTL ? 'text-right' : ''}`}>{t.subTitle}</p>

          {submitStatus.message && (
            <div
              className={`mb-4 p-4 rounded-xl font-medium text-sm flex items-center gap-3 animate-fadeIn ${submitStatus.success
                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                : 'bg-red-50 text-red-700 border-2 border-red-200'
                }`}
            >
              <span className="text-lg">{submitStatus.success ? '✓' : '✕'}</span>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* First Name */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="firstName">
                {t.firstName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t.placeholderFirst}
                className={`w-full text-sm py-3 px-4 border-2 ${errors.firstName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'
                  } rounded-xl outline-none transition-all duration-200 bg-white`}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="lastName">
                {t.lastName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t.placeholderLast}
                className={`w-full text-sm py-3 px-4 border-2 ${errors.lastName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'
                  } rounded-xl outline-none transition-all duration-200 bg-white`}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="companyMail">
                {t.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyMail"
                name="companyMail"
                value={formData.companyMail}
                onChange={handleChange}
                placeholder={t.placeholderEmail}
                className={`w-full text-sm py-3 px-4 border-2 ${errors.companyMail ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-400'
                  } rounded-xl outline-none transition-all duration-200 bg-white`}
                disabled={isSubmitting}
              />
              {errors.companyMail && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.companyMail}
                </p>
              )}
            </div>

            {/* Company / Phone */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="companyName">
                {t.companyLabel}
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder={t.placeholderCompany}
                className="w-full text-sm py-3 px-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl outline-none transition-all duration-200 bg-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Count */}
            <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="numberOfStudents">
                {t.studentsLabel}
              </label>
              <input
                type="text"
                id="numberOfStudents"
                name="numberOfStudents"
                value={formData.numberOfStudents}
                onChange={handleChange}
                placeholder={t.placeholderStudents}
                className="w-full text-sm py-3 px-4 border-2 border-gray-200 focus:border-blue-400 rounded-xl outline-none transition-all duration-200 bg-white"
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
              <label className="block text-purple-dark mb-2 text-sm font-bold" htmlFor="message">
                {t.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.placeholderMsg}
                className="w-full p-3 px-4 border-2 border-gray-200 focus:border-blue-400 text-sm rounded-xl outline-none transition-all duration-200 resize-none bg-white"
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit */}
            <div className={`${isRTL ? 'lg:mr-auto' : 'lg:ml-auto'} lg:col-span-2`}>
              <button
                type="submit"
                className={`w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t.sendingBtn}
                  </span>
                ) : (
                  t.sendBtn
                )}
              </button>
            </div>
          </form>
        </div>

        {/* DETAILS CONTAINER */}
        <div className="flex-1 flex flex-col items-center gap-6 w-full">
          <div className="bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 py-6 w-full flex items-center justify-center rounded-2xl border border-gray-200 shadow-sm">
            <Logo width={300} height={80} classNames="max-w-full" />
          </div>

          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blueberry to-blue-900 p-6 lg:p-8 shadow-lg">
            <h5 className={`mb-6 text-white font-bold text-2xl lg:text-3xl ${isRTL ? 'text-right' : ''}`}>
              {t.ourLocations}
            </h5>

            <div className={`text-white space-y-5 mb-8 ${isRTL ? 'text-right' : ''}`}>
              {t.locations.map((location, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b border-white/20 last:border-b-0">
                  <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-200">
                    <Image
                      src="/Location.svg"
                      width={20}
                      height={20}
                      alt="location"
                      className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`}
                    />
                    <span className="text-sm leading-relaxed font-semibold">{location.address}</span>
                  </div>

                  {location.phones.map((phone, phoneIdx) => (
                    <div
                      key={phoneIdx}
                      className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-200 ml-8 rtl:mr-8 rtl:ml-0"
                    >
                      <Image
                        src="/telephone.svg"
                        width={18}
                        height={18}
                        alt="phone"
                        className={`flex-shrink-0 mt-1 opacity-80 ${isRTL ? 'order-last' : ''}`}
                      />
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm hover:underline" dir="ltr">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-200 pt-2">
                <Image
                  src="/envlope.svg"
                  width={20}
                  height={20}
                  alt="mail"
                  className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`}
                />
                <a href={`mailto:${contactDetails.email}`} className="text-sm hover:underline font-semibold">
                  {contactDetails.email}
                </a>
              </div>
            </div>

            <div className="mb-6">
              <a
                href={contactDetails.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd59] text-white py-3.5 px-5 rounded-xl transition-all duration-300 w-full shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
              >
                <IoLogoWhatsapp size={24} className={isRTL ? 'order-last' : ''} />
                <span className="text-sm">{t.whatsapp}</span>
              </a>
            </div>

            <div className="flex justify-center items-center mt-6 space-x-5 rtl:space-x-reverse">
              <a href="https://www.facebook.com/ngenschools" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110">
                <Image src="/fb.png" width={38} height={38} alt="facebook" />
              </a>
              <a href="https://www.linkedin.com/company/ngenschools/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110">
                <Image src="/linkedin.svg" width={38} height={38} alt="linkedin" />
              </a>
              <a href="https://www.instagram.com/ngenschools/" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110">
                <Image src="/instagram.svg" width={38} height={38} alt="instagram" />
              </a>
              <a href="https://www.tiktok.com/@ngenschools" target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-110">
                <Image src="/tiktok-round-white-icon.webp" width={38} height={38} alt="tiktok" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
