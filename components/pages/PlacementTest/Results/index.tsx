'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Belt levels data based on the curriculum
const beltLevels = [
  {
    stage: 'Pre-Foundation',
    belt: 'White',
    color: 'bg-gray-200',
    textColor: 'text-gray-800',
    duration: '1 Month',
    totalHours: '12 hrs',
    totalClasses: '8 Classes',
    models: 'Universal',
    focus: 'Digital Awareness & Curiosity',
    scoreRange: [0, 1]
  },
  {
    stage: 'Foundation',
    belt: 'Yellow',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-900',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: 'Universal',
    focus: 'Core Coding & Logical Thinking',
    scoreRange: [2, 2]
  },
  {
    stage: 'Foundation',
    belt: 'Orange',
    color: 'bg-orange-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Creativity & Digital Design',
    scoreRange: [3, 3]
  },
  {
    stage: 'Foundation',
    belt: 'Green',
    color: 'bg-green-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Smart Projects (AI & Robotics)',
    scoreRange: [4, 4]
  },
  {
    stage: 'Specialization',
    belt: 'Blue',
    color: 'bg-blue-500',
    textColor: 'text-white',
    duration: '3-4 Months',
    totalHours: '35 hrs',
    totalClasses: '24 Classes',
    models: '3 Models',
    focus: 'Deep Track Exploration',
    scoreRange: [5, 5]
  }
]

// شكل السؤال اللي مخزّن في sessionStorage
type StoredQuestion = {
  id?: number
  question: string
  options: string[]
  correctAnswer?: number   // من الامتحان الحالي
  ans_idx?: number         // لو جاية من الـ AI agent
  justification?: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [recommendedBelt, setRecommendedBelt] = useState(beltLevels[0])
  const [studentInfo, setStudentInfo] = useState({ name: '', age: '', phone: '', email: '' })

  const [questions, setQuestions] = useState<StoredQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  useEffect(() => {
    // Get test results from sessionStorage
    const storedScore = sessionStorage.getItem('testScore')
    const storedTotal = sessionStorage.getItem('totalQuestions')
    const storedStudentInfo = sessionStorage.getItem('studentInfo')
    const storedQuestions = sessionStorage.getItem('questions')
    const storedSelectedAnswers = sessionStorage.getItem('selectedAnswers')

    if (storedScore) {
      const scoreValue = parseInt(storedScore)
      setScore(scoreValue)
      
      // Determine recommended belt based on score
      const belt = beltLevels.find(
        level => scoreValue >= level.scoreRange[0] && scoreValue <= level.scoreRange[1]
      ) || beltLevels[0]
      
      setRecommendedBelt(belt)
    }

    if (storedTotal) {
      setTotalQuestions(parseInt(storedTotal))
    }

    if (storedStudentInfo) {
      setStudentInfo(JSON.parse(storedStudentInfo))
    }

    if (storedQuestions) {
      try {
        const parsedQuestions: StoredQuestion[] = JSON.parse(storedQuestions)
        setQuestions(parsedQuestions)
      } catch (e) {
        console.error('Error parsing stored questions', e)
      }
    }

    if (storedSelectedAnswers) {
      try {
        const parsedSelected: (number | null)[] = JSON.parse(storedSelectedAnswers)
        setSelectedAnswers(parsedSelected)
      } catch (e) {
        console.error('Error parsing stored selectedAnswers', e)
      }
    }
  }, [])

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  const currentQuestion = questions[currentReviewIndex]
  const correctIndex =
    currentQuestion && typeof currentQuestion.correctAnswer === 'number'
      ? currentQuestion.correctAnswer
      : currentQuestion && typeof currentQuestion.ans_idx === 'number'
        ? currentQuestion.ans_idx
        : null

  const userAnswerIndex =
    selectedAnswers && selectedAnswers.length > currentReviewIndex
      ? selectedAnswers[currentReviewIndex]
      : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-green-400">N</span>
            <span className="text-pink-400">G</span>
            <span className="text-orange-400">e</span>
            <span className="text-blue-400">n</span>
            <span className="text-white"> Placement Results</span>
          </h1>
          <p className="text-purple-200 text-lg">
            Congratulations, {studentInfo.name || 'Student'}!
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-8"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="text-7xl font-bold text-white">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl text-purple-200 mt-2">{percentage}% Correct</div>
            </motion.div>
          </div>

          {/* Belt Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Your Recommended Level
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              {/* Belt Badge */}
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="flex-shrink-0"
              >
                <div className={`w-32 h-32 rounded-full ${recommendedBelt.color} flex items-center justify-center shadow-2xl border-4 border-white/30`}>
                  <span className={`text-3xl font-bold ${recommendedBelt.textColor}`}>
                    {recommendedBelt.belt}
                  </span>
                </div>
              </motion.div>

              {/* Belt Details */}
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {recommendedBelt.belt} Belt
                </h3>
                <p className="text-xl text-purple-200 mb-1">{recommendedBelt.stage}</p>
                <p className="text-lg text-purple-300 font-semibold mb-4 text-balance">
                  {recommendedBelt.focus}
                </p>
              </div>
            </div>

            {/* Program Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-orange-400 font-bold text-lg mb-1">Duration</div>
                <div className="text-white">{recommendedBelt.duration}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-pink-400 font-bold text-lg mb-1">Total Hours</div>
                <div className="text-white">{recommendedBelt.totalHours}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-green-400 font-bold text-lg mb-1">Classes</div>
                <div className="text-white">{recommendedBelt.totalClasses}</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ✅ زر تفعيل وضع المراجعة */}
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-8"
          >
            <button
              onClick={() => setIsReviewMode(prev => !prev)}
              className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-white/20 hover:border-orange-400 transition-all"
            >
              {isReviewMode ? 'Hide Answer Review' : 'Review Your Answers'}
            </button>
          </motion.div>
        )}

        {/* ✅ وضع المراجعة: عرض السؤال + إجابتك + الإجابة الصحيحة + الشرح */}
        {isReviewMode && currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-balance">
                Review Question {currentReviewIndex + 1} of {questions.length}
              </h2>
            </div>

            <p className="text-lg text-purple-200 mb-6 text-balance">
              {currentQuestion.question}
            </p>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = correctIndex === index
                const isUserAnswer = userAnswerIndex === index

                let classes =
                  'w-full p-4 rounded-xl text-left font-medium border-2 transition-all flex items-center justify-between gap-4 '

                if (isCorrect) {
                  classes +=
                    'bg-green-600/80 border-green-300 text-white shadow-lg'
                } else if (isUserAnswer && !isCorrect) {
                  classes +=
                    'bg-red-600/80 border-red-300 text-white shadow-lg'
                } else {
                  classes +=
                    'bg-white/10 border-white/20 text-white'
                }

                return (
                  <div key={index} className={classes}>
                    <span className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-balance">{option}</span>
                    </span>

                    <span className="flex gap-2 text-xs md:text-sm">
                      {isCorrect && (
                        <span className="bg-green-200 text-green-900 px-2 py-1 rounded-full font-semibold">
                          Correct Answer
                        </span>
                      )}
                      {isUserAnswer && (
                        <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded-full font-semibold">
                          Your Answer
                        </span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* شرح + مقارنة إجابتك بالصحيح */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-3">
              <p className="text-sm text-purple-100">
                <span className="font-semibold text-white">Your answer:</span>{' '}
                {typeof userAnswerIndex === 'number'
                  ? currentQuestion.options[userAnswerIndex] ?? 'Not answered'
                  : 'Not answered'}
              </p>
              <p className="text-sm text-purple-100">
                <span className="font-semibold text-white">Correct answer:</span>{' '}
                {typeof correctIndex === 'number'
                  ? currentQuestion.options[correctIndex] ?? '—'
                  : '—'}
              </p>
              {currentQuestion.justification && (
                <p className="text-sm text-purple-100">
                  <span className="font-semibold text-white">Explanation:</span>{' '}
                  {currentQuestion.justification}
                </p>
              )}
            </div>

            {/* أزرار التنقل بين الأسئلة في وضع المراجعة */}
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={currentReviewIndex === 0}
                onClick={() => setCurrentReviewIndex(i => Math.max(0, i - 1))}
                className="px-6 py-2 rounded-xl font-semibold bg-white/10 text-white border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
              >
                ← Previous Question
              </button>
              <button
                disabled={currentReviewIndex === questions.length - 1}
                onClick={() =>
                  setCurrentReviewIndex(i =>
                    Math.min(questions.length - 1, i + 1)
                  )
                }
                className="px-6 py-2 rounded-xl font-semibold bg-white/10 text-white border border-white/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
              >
                Next Question →
              </button>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <button
            onClick={() => router.push('/placement-test')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start Another Test
          </button>
        </motion.div>
      </div>
    </div>
  )
}