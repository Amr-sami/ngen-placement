'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  User,
  MapPin,
  School,
  Cpu,
  MessageCircle,
  Phone,
  Mail,
  Sparkles,
  Globe,
  AlertTriangle,
  LogIn,
} from 'lucide-react'
import type { SurveyFormData } from './types'
import InputField from './InputField'

export default function SurveyForm() {
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const { data: session, status: sessionStatus } = useSession()

  const [formData, setFormData] = useState<SurveyFormData>({
    name: '',
    age: '',
    country: '',
    city: '',
    schoolName: '',
    preferredHouse: '',
    techExperience: '',
    techDetails: '',
    heardAboutUs: '',
    phone: '',
    email: '',
  })

  // State for existing user warning
  const [existingUserWarning, setExistingUserWarning] = useState<{
    show: boolean;
    message: string;
    hasTakenTest: boolean;
  }>({ show: false, message: '', hasTakenTest: false })
  const [isCheckingUser, setIsCheckingUser] = useState(false)

  // State for attempt limit check (for logged-in users)
  const [attemptStatus, setAttemptStatus] = useState<{
    checked: boolean;
    canTake: boolean;
    remainingAttempts: number;
    attemptsUsed: number;
    totalAllowed: number;
    lastResult: { beltName: string; scorePercent: number; takenAt: string } | null;
  }>({
    checked: false,
    canTake: true,
    remainingAttempts: 2,
    attemptsUsed: 0,
    totalAllowed: 2,
    lastResult: null,
  })

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }))
    }
  }, [session])

  // Check attempt status for logged-in users
  useEffect(() => {
    const checkAttemptStatus = async () => {
      if (sessionStatus !== 'authenticated') return

      try {
        const response = await fetch('/api/placement-test/start', {
          method: 'GET',
        })
        const data = await response.json()

        setAttemptStatus({
          checked: true,
          canTake: data.canTake,
          remainingAttempts: data.remainingAttempts || 0,
          attemptsUsed: data.attemptsUsed || 0,
          totalAllowed: data.totalAllowed || 2,
          lastResult: data.lastTestResult || null,
        })
      } catch (error) {
        console.error('Error checking attempt status:', error)
        setAttemptStatus(prev => ({ ...prev, checked: true }))
      }
    }

    checkAttemptStatus()
  }, [sessionStatus])

  // Check if user exists when email is entered
  const checkExistingUser = async (email: string) => {
    if (!email || sessionStatus === 'authenticated') return

    setIsCheckingUser(true)
    try {
      const response = await fetch('/api/placement-test/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })
      const data = await response.json()

      if (data.exists) {
        setExistingUserWarning({
          show: true,
          message: data.message,
          hasTakenTest: data.hasTakenTest,
        })
      } else {
        setExistingUserWarning({ show: false, message: '', hasTakenTest: false })
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const handleChange =
    (field: keyof SurveyFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

        // Clear warning when email changes
        if (field === 'email') {
          setExistingUserWarning({ show: false, message: '', hasTakenTest: false })
        }
      }

  const handleEmailBlur = () => {
    if (formData.email) {
      checkExistingUser(formData.email)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Double-check if user exists before allowing test (catch any bypass attempts)
    if (sessionStatus !== 'authenticated' && formData.email) {
      setIsCheckingUser(true)
      try {
        const response = await fetch('/api/placement-test/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email.toLowerCase().trim() }),
        })
        const data = await response.json()

        if (data.exists) {
          setExistingUserWarning({
            show: true,
            message: data.message,
            hasTakenTest: data.hasTakenTest,
          })
          setIsCheckingUser(false)
          return // Block submission
        }
      } catch (error) {
        console.error('Error checking user:', error)
      }
      setIsCheckingUser(false)
    }

    // ✅ restore original "surveyResults" format (important if TestMain expects it)
    const surveyResults = `*Survey Questions*

*1. Full Name*
-${formData.name}

*2. Age*
-${formData.age}

*3. Country*
-${formData.country}

*4. city*
-${formData.city}

*5. School Name*
-${formData.schoolName}

*6. Which house would you prefer to join?*
-${formData.preferredHouse || 'N/A'}

*7. Have you previously studied anything related to technology?*
-${formData.techExperience || 'No'}

*7.1 If yes, please describe your background in technology.*
-${formData.techDetails || 'N/A'}

*8. How did you hear about us?*
-${formData.heardAboutUs || 'N/A'}
`

    sessionStorage.setItem('surveyResults', surveyResults)

    sessionStorage.setItem(
      'studentInfo',
      JSON.stringify({
        name: formData.name,
        age: formData.age,
        phone: formData.phone,
        email: formData.email,
      }),
    )

    sessionStorage.setItem('surveyData', JSON.stringify(formData))

    router.push(`/${locale}/placement-test/test`)
  }

  const isFormValid =
    formData.name &&
    formData.age &&
    formData.country &&
    formData.city &&
    formData.schoolName &&
    formData.techExperience &&
    formData.heardAboutUs &&
    formData.phone &&
    formData.email &&
    (formData.techExperience === 'No' || formData.techDetails) &&
    !existingUserWarning.show // Block if existing user warning is shown

  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex items-center justify-center p-4 lg:p-8 overflow-x-hidden font-sans">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl relative z-10"
      >
        {/* Attempt Limit Reached Block - Show for logged in users who can't take test */}
        {sessionStatus === 'authenticated' && attemptStatus.checked && !attemptStatus.canTake ? (
          <div className="bg-[#2d1b4d]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Test Limit Reached
              </h1>
              <p className="text-purple-200 text-lg mb-6">
                You have used all {attemptStatus.totalAllowed} of your placement test attempts.
              </p>

              {/* Last Result */}
              {attemptStatus.lastResult && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 inline-block">
                  <p className="text-purple-300 text-sm mb-2">Your Last Result</p>
                  <p className="text-white text-2xl font-bold">
                    {attemptStatus.lastResult.beltName} Belt
                  </p>
                  <p className="text-purple-400 text-sm">
                    Score: {attemptStatus.lastResult.scorePercent}%
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/placement-test/results`)}
                  className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                >
                  View Your Results
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // This would open contact modal - for now redirect to contact
                    router.push(`/${locale}#contact`)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white font-bold hover:scale-105 transition-all"
                >
                  Request More Attempts
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#2d1b4d]/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* --- Header Section --- */}
              <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-5 text-center md:text-left">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                    <Image
                      src="/assets/images/logos/ngen-logo.svg"
                      alt="Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                      Placement Survey
                    </h1>
                    <p className="text-purple-200/70 text-base md:text-lg mt-1">
                      Help us personalize your AI learning journey! 🚀
                    </p>
                  </div>
                </div>

                {/* System Online Badge */}
                <div className="flex items-center gap-2 text-white/60 text-sm font-medium border border-white/10 rounded-full px-5 py-2.5 bg-white/5 backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]"></span>
                  <span className="font-mono">System Online</span>
                </div>
              </div>

              {/* --- Main Content Grid --- */}
              <div className="px-8 md:px-10 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* LEFT COLUMN */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#f9a8d4] flex items-center gap-3 mb-6">
                    <User className="w-5 h-5" /> About You
                  </h3>

                  <div className="flex gap-4">
                    <div className="flex-[3]">
                      <InputField
                        icon={User}
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                      />
                    </div>
                    <div className="flex-1 min-w-[100px]">
                      <InputField
                        icon={Sparkles}
                        placeholder="Age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange('age')}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <InputField
                        icon={Globe}
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange('country')}
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        icon={MapPin}
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange('city')}
                      />
                    </div>
                  </div>

                  <div className="pt-8 space-y-6">
                    <h3 className="text-xl font-semibold text-[#4ade80] flex items-center gap-3">
                      <Phone className="w-5 h-5" /> Parent Contact
                    </h3>
                    <InputField
                      icon={Phone}
                      placeholder="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                    <div className="relative">
                      <InputField
                        icon={Mail}
                        placeholder="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        onBlur={handleEmailBlur}
                      />
                      {isCheckingUser && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Existing User Warning */}
                    <AnimatePresence>
                      {existingUserWarning.show && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-orange-500/20 border border-orange-500/40 rounded-xl p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-orange-200 text-sm font-medium">
                                {existingUserWarning.message}
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  sessionStorage.setItem('returnUrl', '/placement-test/survey')
                                  router.push(`/${locale}/auth/login`)
                                }}
                                className="mt-2 flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors"
                              >
                                <LogIn className="w-4 h-4" />
                                Login to your account
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#60a5fa] flex items-center gap-3 mb-6">
                    <School className="w-5 h-5" /> Education & Interests
                  </h3>

                  <InputField
                    icon={School}
                    placeholder="School Name"
                    value={formData.schoolName}
                    onChange={handleChange('schoolName')}
                  />

                  {/* Tech Toggle */}
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-orange-400" /> Technology Experience?
                    </p>
                    <div className="flex gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, techExperience: 'Yes' }))}
                        className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${formData.techExperience === 'Yes'
                          ? 'bg-[#4ade80] text-white shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                          : 'bg-white/10 text-white/40 hover:bg-white/15'
                          }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, techExperience: 'No', techDetails: '' }))}
                        className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${formData.techExperience === 'No'
                          ? 'bg-[#ef4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : 'bg-white/10 text-white/40 hover:bg-white/15'
                          }`}
                      >
                        No
                      </button>
                    </div>
                    {formData.techExperience === 'Yes' && (
                      <motion.textarea
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        value={formData.techDetails}
                        onChange={handleChange('techDetails')}
                        placeholder="What have you learned? (Scratch, Python, etc.)"
                        className="w-full mt-3 bg-black/30 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#4ade80] transition-colors resize-none"
                        rows={2}
                      />
                    )}
                  </div>

                  <div className="relative group">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300 w-5 h-5 pointer-events-none" />
                    <select
                      value={formData.heardAboutUs}
                      onChange={handleChange('heardAboutUs')}
                      className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/10 rounded-2xl text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-black/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1a0b2e]">
                        How did you hear about us?
                      </option>
                      <option value="Social" className="bg-[#1a0b2e]">
                        📱 Social media
                      </option>
                      <option value="Friend" className="bg-[#1a0b2e]">
                        👫 Friend / Classmate
                      </option>
                      <option value="School" className="bg-[#1a0b2e]">
                        🏫 School
                      </option>
                      <option value="Other" className="bg-[#1a0b2e]">
                        ✨ Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- Submit Button Section --- */}
              <div className="px-8 md:px-10 pb-10">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-gradient-to-r from-[#9b4d44] to-[#9d2e62] hover:brightness-110 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.005] active:scale-[0.995] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl"
                >
                  <span>Generate My Test</span>
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}