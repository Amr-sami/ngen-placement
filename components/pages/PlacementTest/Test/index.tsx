'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Brain, 
  Target 
} from 'lucide-react'

type ApiQuestion = {
  question_type: string
  difficulty_level: number
  concepts: string[]
  question: string
  choices: string[]
  ans_idx: number
  justification: string
}

// Sample questions data (5 questions)
const SAMPLE_QUESTIONS: ApiQuestion[] = [
  {
    question_type: "multiple_choice",
    difficulty_level: 1,
    concepts: ["Logic", "Pattern Recognition"],
    question: "If APPLE is coded as 1-16-16-12-5, how is ORANGE coded?",
    choices: [
      "15-18-1-14-7-5",
      "14-17-1-13-7-5",
      "16-17-1-14-7-5",
      "15-17-1-14-7-5"
    ],
    ans_idx: 0,
    justification: "Each letter is replaced by its position in the alphabet (A=1, B=2, etc.). O=15, R=18, A=1, N=14, G=7, E=5."
  },
  {
    question_type: "multiple_choice",
    difficulty_level: 2,
    concepts: ["Programming", "Loops"],
    question: "What will be the output of this code? for i in range(3): print(i)",
    choices: [
      "0 1 2",
      "1 2 3",
      "0 1 2 3",
      "1 2"
    ],
    ans_idx: 0,
    justification: "range(3) generates numbers from 0 to 2 inclusive, so it prints 0, 1, and 2."
  },
  {
    question_type: "multiple_choice",
    difficulty_level: 2,
    concepts: ["AI", "Machine Learning"],
    question: "Which of these is NOT a type of machine learning?",
    choices: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Manual Learning"
    ],
    ans_idx: 3,
    justification: "Manual Learning is not a recognized type of machine learning. The main types are Supervised, Unsupervised, and Reinforcement Learning."
  },
  {
    question_type: "multiple_choice",
    difficulty_level: 1,
    concepts: ["Robotics", "Components"],
    question: "What does a robot use to sense its environment?",
    choices: [
      "Sensors",
      "Actuators",
      "Controllers",
      "All of the above"
    ],
    ans_idx: 3,
    justification: "Robots use sensors to perceive the environment, actuators to move/act, and controllers to process information and make decisions."
  },
  {
    question_type: "multiple_choice",
    difficulty_level: 2,
    concepts: ["Cybersecurity", "Basics"],
    question: "Which of these is the strongest password practice?",
    choices: [
      "Using your pet's name",
      "Using the same password everywhere",
      "A combination of letters, numbers, and symbols",
      "Writing it on a sticky note"
    ],
    ans_idx: 2,
    justification: "Strong passwords should include a mix of uppercase, lowercase letters, numbers, and special characters."
  }
]

export default function TestPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])

  useEffect(() => {
    let progressTimer: ReturnType<typeof setInterval> | null = null

    const startProgress = () => {
      const duration = 2000 // 2 seconds for demo
      const interval = 50
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

    const loadQuestions = async () => {
      const surveyResults = sessionStorage.getItem('surveyResults')

      if (!surveyResults) {
        router.push('/placement-test')
        return
      }

      startProgress()

      // Simulate API call with timeout
      setTimeout(() => {
        try {
          // Use sample questions for demo
          setQuestions(SAMPLE_QUESTIONS)
          setSelectedAnswers(new Array(SAMPLE_QUESTIONS.length).fill(null))
          setLoadingProgress(100)
          setIsLoading(false)
        } catch (err: any) {
          console.error('Error loading questions:', err)
          setError('Sorry, something went wrong while generating your placement test. Please try again.')
          setIsLoading(false)
        }
      }, 2000)

      return () => {
        if (progressTimer) clearInterval(progressTimer)
      }
    }

    loadQuestions()
  }, [router])

  // Handlers
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

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          {/* Logo/Icon */}
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8 inline-block"
          >
             <div className="relative w-32 h-32 mx-auto">
               <Image 
                  src="/image.png" 
                  alt="AI Robot" 
                  fill 
                  className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                />
             </div>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
            Building Your Challenge
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </h2>

          <div className="bg-white/10 p-1 rounded-full h-6 backdrop-blur-md border border-white/20 shadow-inner overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"
              style={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Shine effect on bar */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
          </div>
          
          <p className="text-purple-200 mt-4 font-mono text-sm">
            {loadingProgress < 30 ? "Analyzing profile..." : 
             loadingProgress < 60 ? "Selecting questions..." : 
             "Finalizing AI model..."} 
            ({Math.round(loadingProgress)}%)
          </p>
        </motion.div>
      </div>
    )
  }

  // 2. Error State
  if (error || !questions.length) {
    return (
      <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-purple-200 mb-6">{error || 'Unable to generate test.'}</p>
          <button
            onClick={() => router.push('/placement-test')}
            className="w-full py-3 px-6 rounded-xl font-bold bg-white text-purple-900 hover:bg-purple-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // 3. Main Quiz Interface
  const current = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full mix-blend-screen filter blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative z-10 flex flex-col h-[90vh] md:h-auto md:min-h-[600px]"
      >
        
        {/* --- Top Bar: Logo & Progress --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                   <Image src="/image.png" alt="Logo" fill className="object-contain" />
                </div>
                <div>
                   <h1 className="text-white font-bold text-xl tracking-wide">Placement Test</h1>
                   <div className="flex items-center gap-2 text-sm text-purple-300">
                      <Brain className="w-4 h-4" />
                      <span>{current.concepts[0]}</span>
                   </div>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full md:w-64">
                <div className="flex justify-between text-xs text-purple-200 mb-1 font-bold">
                    <span>Progress</span>
                    <span>{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
            </div>
        </div>

        {/* --- Main Card --- */}
        <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Decoration line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-70"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar"
                >
                    {/* Question Difficulty Badge */}
                    <div className="mb-6">
                        <span className={`
                            inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${current.difficulty_level === 1 ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                              current.difficulty_level === 2 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                              'bg-red-500/20 text-red-300 border border-red-500/30'}
                        `}>
                            <Target className="w-3 h-3" />
                            Level {current.difficulty_level}
                        </span>
                    </div>

                    {/* Question Text */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-8">
                        {current.question}
                    </h2>

                    {/* Choices Grid */}
                    <div className="grid grid-cols-1 gap-4 mt-auto">
                        {current.choices.map((option, index) => {
                            const isSelected = selectedAnswers[currentQuestion] === index;
                            
                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`
                                        group relative w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4
                                        ${isSelected 
                                            ? 'bg-gradient-to-r from-orange-500/90 to-pink-600/90 border-transparent shadow-lg shadow-orange-500/20' 
                                            : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/30'
                                        }
                                    `}
                                >
                                    {/* Choice Letter Bubble */}
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors
                                        ${isSelected 
                                            ? 'bg-white text-pink-600' 
                                            : 'bg-white/10 text-white group-hover:bg-white/20'
                                        }
                                    `}>
                                        {String.fromCharCode(65 + index)}
                                    </div>

                                    {/* Choice Text */}
                                    <span className={`text-lg font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                        {option}
                                    </span>

                                    {/* Check Icon (Visible when selected) */}
                                    {isSelected && (
                                        <motion.div 
                                            initial={{ scale: 0 }} 
                                            animate={{ scale: 1 }}
                                            className="ml-auto"
                                        >
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </motion.div>
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* --- Footer Controls --- */}
            <div className="p-6 md:p-8 border-t border-white/10 bg-black/20 flex justify-between items-center gap-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all
                        ${currentQuestion === 0 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'hover:bg-white/10 active:scale-95'
                        }
                    `}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline">Previous</span>
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswers[currentQuestion] === null}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        <span>Finish Test</span>
                        <Sparkles className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === null}
                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        <span>Next Question</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

      </motion.div>

      {/* Global CSS for scrollbar if needed */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3); 
        }
      `}</style>
    </div>
  )
}