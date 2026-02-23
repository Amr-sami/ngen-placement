
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import type { BeltLevel, StoredQuestion, StudentInfo } from './types'
import { beltLevels } from './types'
import ResultsHeader from './ResultsHeader'
import BeltAchievementCard from './BeltAchievementCard'
import ActionButtons from './ActionButtons'
import ReviewModal from './ReviewModal'
import SaveStatusIndicator from './SaveStatusIndicator'
import ContactAdminModal from './ContactAdminModal'
import LoginPromptCard from './LoginPromptCard'

export default function ResultsMain() {
  const { data: session, status: sessionStatus } = useSession()
  const t = useTranslations('placementTest.results')

  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [recommendedBelt, setRecommendedBelt] = useState<BeltLevel>(beltLevels[0])
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    age: '',
    phone: '',
    email: ''
  })
  const [questions, setQuestions] = useState<StoredQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Modal states
  const [showContactModal, setShowContactModal] = useState(false)

  // Load data from sessionStorage
  useEffect(() => {
    const storedScore = sessionStorage.getItem('testScore')
    const storedTotal = sessionStorage.getItem('totalQuestions')
    const storedStudentInfo = sessionStorage.getItem('studentInfo')
    const storedQuestions = sessionStorage.getItem('questions')
    const storedSelectedAnswers = sessionStorage.getItem('selectedAnswers')

    if (storedScore) {
      const scoreValue = parseInt(storedScore)
      setScore(scoreValue)
      const belt = beltLevels.find(
        level => scoreValue >= level.scoreRange[0] && scoreValue <= level.scoreRange[1]
      ) || beltLevels[beltLevels.length - 1]
      setRecommendedBelt(belt)
    }
    if (storedTotal) setTotalQuestions(parseInt(storedTotal))
    if (storedStudentInfo) setStudentInfo(JSON.parse(storedStudentInfo))
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions))
    if (storedSelectedAnswers) setSelectedAnswers(JSON.parse(storedSelectedAnswers))
  }, [])

  // Auto-save results to database when logged in
  useEffect(() => {
    const saveResults = async () => {
      if (sessionStatus !== 'authenticated') return

      const alreadySaved = sessionStorage.getItem('resultsSaved_v2')
      if (alreadySaved === 'true' || questions.length === 0) return

      setSaveStatus('saving')
      try {
        const surveyData = sessionStorage.getItem('surveyData')
        const testId = sessionStorage.getItem('testId')
        const selectedTrack = sessionStorage.getItem('selectedTrack') || 'general'

        const response = await fetch('/api/placement-test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            testId,
            surveyData: surveyData ? JSON.parse(surveyData) : {},
            questions,
            selectedAnswers,
            score,
            totalQuestions,
            belt: recommendedBelt,
            track: selectedTrack,
          }),
        })

        if (!response.ok) throw new Error('Failed to save')

        const data = await response.json()

        // Check if server treated us as guest despite being logged in (session expired/invalid)
        if (data.isGuest && sessionStatus === 'authenticated') {
          // Session is invalid on server side. 
          // Don't mark as saved, set status to error so user sees indicator.
          console.error('Session expired during save - treated as guest')
          setSaveStatus('error')
          return
        }

        sessionStorage.setItem('resultsSaved_v2', 'true')
        setSaveStatus('success')
      } catch (error) {
        console.error('Error saving results:', error)
        setSaveStatus('error')
      }
    }

    if (questions.length > 0 && score >= 0 && recommendedBelt) {
      saveResults()
    }

    // Clear sessionStorage for test type selection so user can choose again
    sessionStorage.removeItem('selectedTrack');
  }, [sessionStatus, questions, selectedAnswers, score, totalQuestions, recommendedBelt])

  // Recover result from server if local storage empty
  useEffect(() => {
    if (sessionStatus !== 'authenticated') return
    const storedScore = sessionStorage.getItem('testScore')
    if (storedScore) return // we have local data

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')
        if (!res.ok) return
        const data = await res.json()
        if (data.placementTest?.resultBeltName) {
          // Restore Belt
          const belt = beltLevels.find(b => b.belt === data.placementTest.resultBeltName)
          if (belt) setRecommendedBelt(belt)

          // Restore Score
          if (data.placementTest.resultScore !== undefined) setScore(data.placementTest.resultScore)
          if (data.placementTest.resultTotalQuestions !== undefined) setTotalQuestions(data.placementTest.resultTotalQuestions)
        }
      } catch (e) {
        console.error('Error recovering results:', e)
      }
    }
    fetchProfile()
  }, [sessionStatus])



  const handleContactAdmin = () => {
    setShowContactModal(true)
  }

  const handleReviewAnswers = () => {
    setIsReviewMode(true)
    setCurrentReviewIndex(0)
  }

  const handlePreviousQuestion = () => {
    setCurrentReviewIndex(prev => Math.max(0, prev - 1))
  }

  const handleNextQuestion = () => {
    setCurrentReviewIndex(prev => Math.min(questions.length - 1, prev + 1))
  }



  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-x-hidden">

      {/* Background Decor with Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main glow matching belt color */}
        <div className={`absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] ${recommendedBelt.color} opacity-20 rounded-full filter blur-[150px] animate-pulse`}></div>
        <div className="absolute top-[-5%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/20 rounded-full filter blur-[80px] md:blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/20 rounded-full filter blur-[80px] md:blur-[100px]"></div>
      </div>

      {/* Save Status Indicator */}
      <SaveStatusIndicator status={saveStatus} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative z-10"
      >
        {/* Header - Always visible */}
        <ResultsHeader
          studentName={studentInfo.name}
          score={score}
          totalQuestions={totalQuestions}
        />

        {/* Achievement Card */}
        <BeltAchievementCard belt={recommendedBelt} score={score} />



        {/* Action Buttons */}
        <ActionButtons
          onReviewAnswers={handleReviewAnswers}
          onContactAdmin={handleContactAdmin}
          hasQuestions={questions.length > 0}
        />

        {/* Review Modal - Only for logged in users */}
        <ReviewModal
          isOpen={isReviewMode}
          currentIndex={currentReviewIndex}
          questions={questions}
          selectedAnswers={selectedAnswers}
          onClose={() => setIsReviewMode(false)}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
        />

        {/* Contact Admin Modal */}
        <ContactAdminModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          defaultSubject="Request to Retake Test"
          userEmail={session?.user?.email || studentInfo.email}
          userName={session?.user?.name || studentInfo.name}
        />

      </motion.div>
    </div>
  )
}