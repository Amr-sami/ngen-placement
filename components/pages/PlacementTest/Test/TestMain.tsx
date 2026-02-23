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
import SoftSkillsMain from '../SoftSkills/SoftSkillsMain'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { Code2, Brain, Cpu, Database, Shield, BarChart3, Terminal, Bot, Layers } from 'lucide-react'

export default function TestMain() {
  const router = useRouter()
  const t = useTranslations('placementTest')
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const { data: session } = useSession()

  const [testStep, setTestStep] = useState<'technical' | 'soft_skills'>('technical')
  const [specificTrack, setSpecificTrack] = useState<string | null>(null)
  const [showTrackSelection, setShowTrackSelection] = useState(false)

  // Technical Test State
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])

  // Determine test type from sessionStorage
  useEffect(() => {
    const track = sessionStorage.getItem('selectedTrack');
    if (track === 'soft_skills') {
      setTestStep('soft_skills');
    } else if (track === 'technical') {
      // User chose "technical" from landing page → show track selection
      setTestStep('technical');
      setShowTrackSelection(true);
    } else {
      // A specific track was already chosen (e.g. 'general', 'data_science')
      setTestStep('technical');
      setSpecificTrack(track || 'general');
    }
  }, []);

  const handleTrackSelect = (track: string) => {
    sessionStorage.setItem('selectedTrack', track);
    setSpecificTrack(track);
    setShowTrackSelection(false);
  };

  // --- Technical Test Logic: Fetching Questions ---
  useEffect(() => {
    if (testStep !== 'technical' || !specificTrack) return;

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

      // Ensure any previous test save flags are cleared so this test can save
      sessionStorage.removeItem('resultsSaved_v2')

      startProgress()

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            survey_results: surveyResults,
            language: locale,
            selectedTrack: specificTrack
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
  }, [router, locale, t, testStep, specificTrack])

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
        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>
        <SoftSkillsMain
          ageGroup={ageGroup}
          onComplete={() => router.push('/')}
        />
      </div>
    );
  }

  // --- Render Track Selection (Step A for Technical) ---
  if (showTrackSelection) {
    const trackTranslations = {
      en: {
        title: 'Choose Your Track',
        subtitle: 'Select the technical track you want to be assessed on',
        general: 'General',
        generalDesc: 'Comprehensive assessment across all topics',
        data_science: 'Data Science',
        data_scienceDesc: 'Machine learning, statistics, and data modeling',
        computer_fundamentals: 'Computer Fundamentals',
        computer_fundamentalsDesc: 'Core computer science concepts and basics',
        cybersecurity: 'Cybersecurity',
        cybersecurityDesc: 'Network security, encryption, and digital safety',
        data_analysis: 'Data Analysis',
        data_analysisDesc: 'Data visualization, SQL, and analytical thinking',
        python_programming: 'Python Programming',
        python_programmingDesc: 'Python fundamentals and problem solving',
        robotics: 'Robotics',
        roboticsDesc: 'Robotics, embedded systems, and automation',
      },
      ar: {
        title: 'اختر المسار',
        subtitle: 'حدد المسار التقني الذي تريد تقييمه',
        general: 'عام',
        generalDesc: 'تقييم شامل في جميع المواضيع',
        data_science: 'علم البيانات',
        data_scienceDesc: 'التعلم الآلي والإحصاء ونمذجة البيانات',
        computer_fundamentals: 'أساسيات الحاسب',
        computer_fundamentalsDesc: 'مفاهيم علوم الحاسب الأساسية',
        cybersecurity: 'الأمن السيبراني',
        cybersecurityDesc: 'أمن الشبكات والتشفير والأمان الرقمي',
        data_analysis: 'تحليل البيانات',
        data_analysisDesc: 'تصور البيانات و SQL والتفكير التحليلي',
        python_programming: 'برمجة بايثون',
        python_programmingDesc: 'أساسيات بايثون وحل المشكلات',
        robotics: 'الروبوتات',
        roboticsDesc: 'الروبوتات والأنظمة المدمجة والأتمتة',
      },
    };

    const tt = trackTranslations[locale as 'en' | 'ar'] || trackTranslations.en;

    const tracks = [
      { id: 'general', name: tt.general, desc: tt.generalDesc, icon: Layers, color: 'from-blue-500 to-cyan-500' },
      { id: 'data_science', name: tt.data_science, desc: tt.data_scienceDesc, icon: Brain, color: 'from-purple-500 to-pink-500' },
      { id: 'computer_fundamentals', name: tt.computer_fundamentals, desc: tt.computer_fundamentalsDesc, icon: Cpu, color: 'from-green-500 to-emerald-500' },
      { id: 'cybersecurity', name: tt.cybersecurity, desc: tt.cybersecurityDesc, icon: Shield, color: 'from-red-500 to-orange-500' },
      { id: 'data_analysis', name: tt.data_analysis, desc: tt.data_analysisDesc, icon: BarChart3, color: 'from-yellow-500 to-amber-500' },
      { id: 'python_programming', name: tt.python_programming, desc: tt.python_programmingDesc, icon: Terminal, color: 'from-sky-500 to-blue-500' },
      { id: 'robotics', name: tt.robotics, desc: tt.roboticsDesc, icon: Bot, color: 'from-teal-500 to-cyan-500' },
    ];

    return (
      <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>

        {/* Language Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl relative z-10"
        >
          <div className="text-center mb-10">
            <h1 className={`text-3xl md:text-4xl font-bold text-white mb-3 ${isRTL ? 'font-arabic' : ''}`}>
              {tt.title}
            </h1>
            <p className={`text-purple-200/70 text-lg ${isRTL ? 'font-arabic' : ''}`}>
              {tt.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <motion.button
                  key={track.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTrackSelect(track.id)}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all text-start flex flex-col gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold text-white ${isRTL ? 'font-arabic' : ''}`}>
                    {track.name}
                  </h3>
                  <p className={`text-sm text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                    {track.desc}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
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

      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
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