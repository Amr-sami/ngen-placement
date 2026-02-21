// components/pages/PlacementTest/Test/TestMain.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useSession } from 'next-auth/react'
import type { ApiQuestion } from './types'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import TestHeader from './TestHeader'
import QuestionCard from './QuestionCard'
import TestFooter from './TestFooter'
import TestSelection from '../TestSelection'
import SoftSkillsMain from '../SoftSkills/SoftSkillsMain'

export default function TestMain() {
  const router = useRouter()
  const t = useTranslations('placementTest')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const { data: session } = useSession()

  const [testStep, setTestStep] = useState<'technical' | 'soft_skills'>('technical')
  const [userTestStatus, setUserTestStatus] = useState({ hasTakenTechnical: false, hasTakenSoftSkills: false })
  const [statusLoading, setStatusLoading] = useState(true)

  // Technical Test State
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])

  // Load User Status
  useEffect(() => {
    const checkStatus = async () => {
      if (session?.user) {
        try {
          const res = await fetch('/api/placement-test/check-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });
          const data = await res.json();
          setUserTestStatus({
            hasTakenTechnical: data.hasTakenPlacementTest, // Mapping existing field
            hasTakenSoftSkills: data.hasTakenSoftSkillsTest || false
          });
        } catch (e) {
          console.error("Failed to check user status", e);
        }
      }
      setStatusLoading(false);
    };
    checkStatus();
  }, [session]);

  // Check if Soft Skills was selected in Survey
  useEffect(() => {
    const track = sessionStorage.getItem('selectedTrack');
    if (track === 'soft_skills') {
      setTestStep('soft_skills');
    } else {
      setTestStep('technical');
    }
  }, []);

  // Handle test type selection from TestSelection
  const handleTestTypeSelect = (type: 'technical' | 'soft_skills') => {
    sessionStorage.setItem('selectedTrack', type);
    setTestStep(type);
  };

  // --- Technical Test Logic: Fetching Questions ---
  useEffect(() => {
    if (testStep !== 'technical') return;

    let progressTimer: ReturnType<typeof setInterval> | null = null

    const startProgress = () => {
      const duration = 20000
      const interval = 100
      const steps = duration / interval
      let currentStep = 0

      progressTimer = setInterval(() => {
        currentStep++
        setLoadingProgress(prev => {
          const value = Math.max(prev, (currentStep / steps) * 100)
          return Math.min(value, 95)
        })
      }, interval)
    }

    const fetchQuestions = async () => {
      const surveyResults = sessionStorage.getItem('surveyResults')

      if (!surveyResults) {
        router.push('/placement-test/survey')
        return
      }

      startProgress()

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            survey_results: surveyResults,
            language: locale,
            selectedTrack: sessionStorage.getItem('selectedTrack') || 'general'
          }),
        })

        const text = await res.text()
        let data: {
          questions?: ApiQuestion[]
          partial?: boolean
          failed_tracks?: string[]
          message?: string
          detail?: string
          error?: string
          language?: string
        }

        try {
          data = JSON.parse(text)
        } catch {
          console.error('Failed to parse response:', text)
          throw new Error('Received invalid response from server. Please try again.')
        }

        if (!res.ok) {
          console.error('Backend error:', data)

          if (res.status === 503) {
            throw new Error(t('error.overloaded'))
          }

          if (res.status === 500) {
            throw new Error(data?.detail || t('error.server'))
          }

          throw new Error(data?.detail || data?.error || data?.message || t('error.generic'))
        }

        if (data.partial && data.failed_tracks && data.failed_tracks.length > 0) {
          console.warn(`Some tracks failed: ${data.failed_tracks.join(', ')}`)
          console.warn(`Message: ${data.message}`)
        }

        const apiQuestions: ApiQuestion[] = data.questions ?? []

        if (!apiQuestions.length) {
          throw new Error(t('error.noQuestions'))
        }

        console.log(`Successfully loaded ${apiQuestions.length} questions in ${locale}`)

        setQuestions(apiQuestions)
        setSelectedAnswers(new Array(apiQuestions.length).fill(null))
        setLoadingProgress(100)
      } catch (err: unknown) {
        console.error('Error in fetchQuestions:', err)

        const error = err as Error
        if (error.name === 'TypeError' && error.message?.includes('fetch')) {
          setError(t('error.network'))
        } else {
          setError(error.message || t('error.generic'))
        }
      } finally {
        if (progressTimer) clearInterval(progressTimer)
        setIsLoading(false)
      }
    }

    fetchQuestions()

    return () => {
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [router, locale, t, testStep])

  // --- Handlers ---
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    const score = selectedAnswers.reduce<number>((total, answer, index) => {
      if (answer === null) return total
      return answer === questions[index].ans_idx ? total + 1 : total
    }, 0)

    // Store full question data including belt, difficulty_level, and concepts for evaluation
    const storedQuestions = questions.map(q => ({
      question: q.question,
      options: q.choices,
      ans_idx: q.ans_idx,
      justification: q.justification,
      // Include these fields for the evaluator
      belt: q.belt,
      difficulty_level: q.difficulty_level,
      concepts: q.concepts,
    }))

    sessionStorage.setItem('testScore', score.toString())
    sessionStorage.setItem('totalQuestions', questions.length.toString())
    sessionStorage.setItem('questions', JSON.stringify(storedQuestions))
    sessionStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers))

    router.push('/placement-test/results')
  }

  if (statusLoading) return <LoadingState loadingProgress={50} />;

  // --- Render Selection Screen for logged-in users ---
  // Show test selection when user is logged in and hasn't selected a test type yet
  if (session?.user) {
    return (
      <div className="min-h-screen w-full bg-[#1a0b2e] relative py-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>
        <div className="w-full max-w-5xl mx-auto relative z-10">
          <TestSelection
            onSelect={handleTestTypeSelect}
            hasTakenTechnical={userTestStatus.hasTakenTechnical}
            hasTakenSoftSkills={userTestStatus.hasTakenSoftSkills}
          />
        </div>
      </div>
    );
  }

  // --- Render Soft Skills Test ---
  if (testStep === 'soft_skills') {
    // Determine age group from survey data
    let ageGroup: '6-9' | '10-14' | '15-18' = '10-14';
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('surveyData');
      if (stored) {
        const data = JSON.parse(stored);
        const age = parseInt(data.age);
        if (age >= 6 && age <= 9) ageGroup = '6-9';
        else if (age >= 10 && age <= 14) ageGroup = '10-14';
        else if (age >= 15) ageGroup = '15-18';
      }
    }

    return (
      <div className="min-h-screen w-full bg-[#1a0b2e] relative py-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
        </div>
        <SoftSkillsMain
          ageGroup={ageGroup}
          onComplete={() => router.push('/')} // Redirect to home
        />
      </div>
    );
  }

  // --- Render Technical Test (Existing Flow) ---
  if (isLoading) {
    return <LoadingState loadingProgress={loadingProgress} />
  }

  if (error || !questions.length) {
    return (
      <ErrorState
        error={error}
        onRetry={() => router.push('/placement-test/survey')}
      />
    )
  }

  const current = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div
      className={`min-h-screen w-full bg-[#1a0b2e] relative flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col h-full">
        <TestHeader
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          concept={current.concepts?.[0] ?? ''}
          progress={progress}
        />

        {/* Main Card */}
        <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative min-h-0">
          {/* Decoration line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-70"></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full overflow-y-auto custom-scrollbar"
            >
              <QuestionCard
                question={current}
                selectedAnswer={selectedAnswers[currentQuestion]}
                onSelectAnswer={handleAnswerSelect}
              />
            </motion.div>
          </AnimatePresence>

          <TestFooter
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            isAnswerSelected={selectedAnswers[currentQuestion] !== null}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Global CSS for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}