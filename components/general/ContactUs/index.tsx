'use client'

import React, { useState } from 'react'
import Logo from '../Logo'
import Image from 'next/image'
import { sendEmail } from '@/lib/resend'
import { IoLogoWhatsapp } from 'react-icons/io'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

const ContactUs = () => {
  const pathname = usePathname()
  const locale = useLocale()
  const isRTL = locale === 'ar'

  // Determine labels based on pathname
  const isParentsPage = pathname?.includes('/ngen-for/parents')
  const isSchoolsPage = pathname?.includes('/ngen-for/schools')
  const isCorporatesPage = pathname?.includes('/ngen-for/corporates')

  // Localization Dictionary
  const translations = {
    en: {
      title: 'Contact Us',
      getInTouch: 'Get in Touch',
      subTitle: 'Feel free to drop your message below',
      firstName: isParentsPage ? 'Parent First name' : isSchoolsPage || isCorporatesPage ? 'Focal point First name' : 'First name',
      lastName: isParentsPage ? 'Parent Last name' : isSchoolsPage || isCorporatesPage ? 'Focal point Last name' : 'Last name',
      emailLabel: isParentsPage ? 'Parent Email' : isSchoolsPage ? 'School website' : isCorporatesPage ? 'Company Focal point Email' : 'Email',
      companyLabel: isParentsPage ? 'Parent Mobile Number' : isSchoolsPage ? 'School name' : 'Company name',
      studentsLabel: isParentsPage ? "Number of children" : isSchoolsPage ? "Number of students" : isCorporatesPage ? "Number of targeted employee children" : "Number of students / Employees",
      messageLabel: 'Message',
      placeholderFirst: 'First name',
      placeholderLast: 'Last name',
      placeholderEmail: isSchoolsPage ? "school.edu" : "Your email address",
      placeholderCompany: isParentsPage ? "01xxxxxxxxx" : isSchoolsPage ? "School Name" : "Company name",
      placeholderStudents: 'e.g. 50',
      placeholderMsg: 'Your message',
      sendBtn: 'Send',
      sendingBtn: 'Sending...',
      whatsapp: 'Contact via WhatsApp',
      successMsg: 'Thank you! Your message has been sent successfully.',
      errorMsg: 'An unexpected error occurred. Please try again.',
      reqFirst: 'First name is required',
      reqLast: 'Last name is required',
      reqEmail: 'Email is required',
      invEmail: 'Please enter a valid email',
      locations: [
        '15 Al Lasilki, Infront of Maadi Technology Park Ezbet Fahmy, Maadi, Cairo Egypt',
        'Business Center 1, M Floor, The Meydan Hotel, Nad Al Sheba, Dubai, U.A.E'
      ]
    },
    ar: {
      title: 'اتصل بنا',
      getInTouch: 'تواصل معنا',
      subTitle: 'لا تتردد في ترك رسالتك أدناه',
      firstName: isParentsPage ? 'الاسم الأول لولي الأمر' : isSchoolsPage || isCorporatesPage ? 'الاسم الأول لمسؤول التواصل' : 'الاسم الأول',
      lastName: isParentsPage ? 'الاسم الأخير لولي الأمر' : isSchoolsPage || isCorporatesPage ? 'الاسم الأخير لمسؤول التواصل' : 'الاسم الأخير',
      emailLabel: isParentsPage ? 'البريد الإلكتروني لولي الأمر' : isSchoolsPage ? 'موقع المدرسة الإلكتروني' : isCorporatesPage ? 'البريد الإلكتروني لمسؤول الشركة' : 'البريد الإلكتروني',
      companyLabel: isParentsPage ? 'رقم موبايل ولي الأمر' : isSchoolsPage ? 'اسم المدرسة' : 'اسم الشركة',
      studentsLabel: isParentsPage ? "عدد الأطفال" : isSchoolsPage ? "عدد الطلاب" : isCorporatesPage ? "عدد أطفال الموظفين المستهدفين" : "عدد الطلاب / الموظفين",
      messageLabel: 'الرسالة',
      placeholderFirst: 'الاسم الأول',
      placeholderLast: 'الاسم الأخير',
      placeholderEmail: isSchoolsPage ? "school.edu" : "عنوان بريدك الإلكتروني",
      placeholderCompany: isParentsPage ? "٠١xxxxxxxx" : isSchoolsPage ? "اسم المدرسة" : "اسم الشركة",
      placeholderStudents: 'مثال: ٥٠',
      placeholderMsg: 'رسالتك هنا',
      sendBtn: 'إرسال',
      sendingBtn: 'جاري الإرسال...',
      whatsapp: 'تواصل عبر واتساب',
      successMsg: 'شكراً لك! تم إرسال رسالتك بنجاح.',
      errorMsg: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      reqFirst: 'الاسم الأول مطلوب',
      reqLast: 'الاسم الأخير مطلوب',
      reqEmail: 'البريد الإلكتروني مطلوب',
      invEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      locations: [
        '١٥ اللاسلكي، أمام تكنولوجي بارك المعادي، عزبة فهمي، المعادي، القاهرة مصر',
        'مركز الأعمال ١، الطابق M، فندق الميدان، ند الشبا، دبي، الإمارات العربية المتحدة'
      ]
    }
  }

  const t = translations[locale as 'en' | 'ar'] || translations.en

  // State for form inputs
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
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' })
    }
    if (submitStatus.success !== undefined) {
      setSubmitStatus({})
    }
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      firstName: formData.firstName.trim() === '' ? t.reqFirst : '',
      lastName: formData.lastName.trim() === '' ? t.reqLast : '',
      companyMail: formData.companyMail.trim() === ''
        ? t.reqEmail
        : !isValidEmail(formData.companyMail) ? t.invEmail : '',
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some(error => error !== '')) return

    setIsSubmitting(true)
    try {
      sendEmail(formData)
      setSubmitStatus({ success: true, message: t.successMsg })
      setFormData({ firstName: '', lastName: '', companyMail: '', companyName: '', numberOfStudents: '', message: '' })
    } catch {
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

      <div className="flex flex-col lg:flex-row p-4 sm:p-6 rounded-3xl border border-solid border-gray-200 gap-6">
        {/* FORM CONTAINER */}
        <div className="bg-[#EDECECB5] basis-4/6 p-4 sm:p-6 rounded-[14px]">
          <h5 className={`font-bold text-pumpkin xl:text-2xl mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t.getInTouch}
          </h5>
          <p className={`text-gray-dark lg:text-blueberry text-sm mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t.subTitle}
          </p>

          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* First Name */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="firstName">
                {t.firstName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="firstName" name="firstName"
                value={formData.firstName} onChange={handleChange}
                placeholder={t.placeholderFirst}
                className={`w-full text-sm py-3 px-4 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="lastName">
                {t.lastName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="lastName" name="lastName"
                value={formData.lastName} onChange={handleChange}
                placeholder={t.placeholderLast}
                className={`w-full text-sm py-3 px-4 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="companyMail">
                {t.emailLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="companyMail" name="companyMail"
                value={formData.companyMail} onChange={handleChange}
                placeholder={t.placeholderEmail}
                className={`w-full text-sm py-3 px-4 border ${errors.companyMail ? 'border-red-500' : 'border-gray-300'} rounded-md outline-none`}
                disabled={isSubmitting}
              />
              {errors.companyMail && <p className="text-red-500 text-xs mt-1">{errors.companyMail}</p>}
            </div>

            {/* Company / Phone */}
            <div className={isRTL ? 'text-right' : ''}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="companyName">
                {t.companyLabel}
              </label>
              <input
                type="text" id="companyName" name="companyName"
                value={formData.companyName} onChange={handleChange}
                placeholder={t.placeholderCompany}
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Count */}
            <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="numberOfStudents">
                {t.studentsLabel}
              </label>
              <input
                type="text" id="numberOfStudents" name="numberOfStudents"
                value={formData.numberOfStudents} onChange={handleChange}
                placeholder={t.placeholderStudents}
                className="w-full text-sm py-3 px-4 border border-gray-300 rounded-md outline-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
              <label className="block text-purple-dark mb-1 text-sm font-bold" htmlFor="message">
                {t.messageLabel}
              </label>
              <textarea
                id="message" name="message"
                value={formData.message} onChange={handleChange}
                placeholder={t.placeholderMsg}
                className="w-full p-3 px-6 border text-sm border-gray-300 rounded-md outline-none"
                rows={3} disabled={isSubmitting}
              ></textarea>
            </div>

            {/* Submit */}
            <div className={`${isRTL ? 'lg:mr-auto' : 'lg:ml-auto'} lg:col-span-2`}>
              <button
                type="submit"
                className={`w-full lg:w-[155px] bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-bold ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.sendingBtn : t.sendBtn}
              </button>
            </div>
          </form>
        </div>

        {/* DETAILS CONTAINER */}
        <div className="flex-1 flex flex-col items-center gap-6 w-full">
          <div className="bg-gray-default px-4 sm:px-6 py-[18px] w-full flex items-center justify-center rounded-[14px]">
            <Logo width={300} height={80} classNames="max-w-full" />
          </div>

          <div className="w-full h-full rounded-[14px] bg-blueberry p-6">
            <h5 className={`mb-5 lg:mb-12 text-white font-bold text-3xl ${isRTL ? 'text-right' : ''}`}>
              {t.title}
            </h5>

            <div className={`text-white text-lg space-y-5 mb-6 lg:mb-8 ${isRTL ? 'text-right' : ''}`}>
              {t.locations.map((loc, idx) => (
                <p key={idx} className="flex items-start gap-3">
                  <Image src="/Location.svg" width={20} height={20} alt="location" className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`} />
                  <span className="text-sm">{loc}</span>
                </p>
              ))}

              <p className="flex items-start gap-3">
                <Image src="/envlope.svg" width={20} height={20} alt="mail" className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`} />
                <span className="text-sm">Info@ngenschools.com</span>
              </p>

              <p className="flex items-start gap-3">
                <Image src="/telephone.svg" width={20} height={20} alt="phone" className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`} />
                <span className="text-sm" dir="ltr">+20 105 502 3774</span>
              </p>

              <p className="flex items-start gap-3">
                <Image src="/telephone.svg" width={20} height={20} alt="phone" className={`flex-shrink-0 mt-1 ${isRTL ? 'order-last' : ''}`} />
                <span className="text-sm" dir="ltr">+971 52 654 2044</span>
              </p>
            </div>

            <div className="mb-6">
              <a
                href="https://wa.me/+201055023774"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd59] text-white py-3 px-5 rounded-lg transition-all duration-300 w-full"
              >
                <IoLogoWhatsapp size={22} className={isRTL ? 'order-last' : ''} />
                <span className="font-semibold text-sm">{t.whatsapp}</span>
              </a>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-6 rtl:space-x-reverse">
              <a href="https://www.facebook.com/ngenschools" target="_blank"><Image src="/fb.png" width={35} height={35} alt="facebook" /></a>
              <a href="https://www.linkedin.com/company/ngenschools/" target="_blank"><Image src="/linkedin.svg" width={35} height={35} alt="linkedin" /></a>
              <a href="https://www.instagram.com/ngenschools/" target="_blank"><Image src="/instagram.svg" width={35} height={35} alt="instagram" /></a>
              <a href="https://www.tiktok.com/@ngenschools" target="_blank"><Image src="/tiktok-round-white-icon.webp" width={35} height={35} alt="tiktok" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
