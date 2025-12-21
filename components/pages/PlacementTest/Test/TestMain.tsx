// Path: /components/pages/PlacementTest/Test/TestMain.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { ApiQuestion } from './types'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'
import TestHeader from './TestHeader'
import QuestionCard from './QuestionCard'
import TestFooter from './TestFooter'

export default function TestMain() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])

  // --- Logic: Fetching Questions ---
  useEffect(() => {
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
          body: JSON.stringify({ survey_results: surveyResults }),
        })

        const text = await res.text()
        let data: any

        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Failed to parse response:', text)
          throw new Error('Received invalid response from server. Please try again.')
        }

        if (!res.ok) {
          console.error('Backend error:', data)

          if (res.status === 503) {
            throw new Error(
              'The AI service is currently overloaded. Please wait a moment and try again.',
            )
          }

          if (res.status === 500) {
            throw new Error(
              data?.detail ||
                'A server error occurred while generating your test. Please try again in a few moments.',
            )
          }

          throw new Error(
            data?.detail ||
              data?.error ||
              data?.message ||
              'Failed to generate questions. Please try again.',
          )
        }

        if (data.partial && data.failed_tracks?.length > 0) {
          console.warn(`Some tracks failed: ${data.failed_tracks.join(', ')}`)
          console.warn(`Message: ${data.message}`)
        }

        const apiQuestions: ApiQuestion[] = data.questions ?? []

        if (!apiQuestions.length) {
          throw new Error(
            'No questions were generated. The service may be experiencing issues. Please try again.',
          )
        }

        console.log(`Successfully loaded ${apiQuestions.length} questions`)

        setQuestions(apiQuestions)
        setSelectedAnswers(new Array(apiQuestions.length).fill(null))
        setLoadingProgress(100)
      } catch (err: any) {
        console.error('Error in fetchQuestions:', err)

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error. Please check your internet connection and try again.')
        } else {
          setError(
            err?.message ||
              'Sorry, something went wrong while generating your placement test. Please try again.',
          )
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
  }, [router])

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

    const storedQuestions = questions.map(q => ({
      question: q.question,
      options: q.choices,
      ans_idx: q.ans_idx,
      justification: q.justification,
    }))

    sessionStorage.setItem('testScore', score.toString())
    sessionStorage.setItem('totalQuestions', questions.length.toString())
    sessionStorage.setItem('questions', JSON.stringify(storedQuestions))
    sessionStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers))

    router.push('/placement-test/results')
  }

  // --- Render States ---
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
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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