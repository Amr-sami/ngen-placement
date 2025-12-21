
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { BeltLevel, StoredQuestion, StudentInfo } from './types'
import { beltLevels } from './types'
import ResultsHeader from './ResultsHeader'
import BeltAchievementCard from './BeltAchievementCard'
import ActionButtons from './ActionButtons'
import ReviewModal from './ReviewModal'
import SaveStatusIndicator from './SaveStatusIndicator'

export default function ResultsMain() {
  const router = useRouter()
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

  // Auto-save results to database
  useEffect(() => {
    const saveResults = async () => {
      const alreadySaved = sessionStorage.getItem('resultsSaved')
      if (alreadySaved === 'true' || !studentInfo.email || questions.length === 0) return

      setSaveStatus('saving')
      try {
        const surveyData = sessionStorage.getItem('surveyData')
        const response = await fetch('/api/save-test-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentInfo,
            surveyData: surveyData ? JSON.parse(surveyData) : {},
            questions,
            selectedAnswers,
            score,
            totalQuestions,
            belt: recommendedBelt,
          }),
        })
        if (!response.ok) throw new Error('Failed to save')
        sessionStorage.setItem('resultsSaved', 'true')
        setSaveStatus('success')
      } catch (error) {
        console.error('Error saving results:', error)
        setSaveStatus('error')
      }
    }

    if (studentInfo.email && questions.length > 0 && score >= 0) {
      saveResults()
    }
  }, [studentInfo, questions, selectedAnswers, score, totalQuestions, recommendedBelt])

  const handleRetakeTest = () => {
    sessionStorage.clear()
    router.push('/placement-test/survey')
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
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        {/* Header */}
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
          onRetakeTest={handleRetakeTest}
        />

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewMode}
          currentIndex={currentReviewIndex}
          questions={questions}
          selectedAnswers={selectedAnswers}
          onClose={() => setIsReviewMode(false)}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
        />
      </motion.div>
    </div>
  )
}