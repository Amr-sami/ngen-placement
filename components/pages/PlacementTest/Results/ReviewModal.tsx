
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'

import type { StoredQuestion } from './types'

interface ReviewModalProps {
  isOpen: boolean
  currentIndex: number
  questions: StoredQuestion[]
  selectedAnswers: (number | null)[]
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function ReviewModal({
  isOpen,
  currentIndex,
  questions,
  selectedAnswers,
  onClose,
  onPrevious,
  onNext,
}: ReviewModalProps) {
  if (!isOpen) return null

  const currentQuestion = questions[currentIndex]
  const correctIndex = currentQuestion?.ans_idx ?? currentQuestion?.correctAnswer ?? null
  const userAnswerIndex = selectedAnswers[currentIndex]

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 shadow-2xl mb-20"
      >
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
          <div>
            <h2 className="text-white text-lg md:text-2xl font-bold">Answer Review</h2>
            <p className="text-purple-300 text-[10px] md:text-xs uppercase tracking-widest font-bold">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Close
            </span>
          </button>
        </div>

        {currentQuestion && (
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-white text-base md:text-xl font-bold leading-relaxed">
              {currentQuestion.question}
            </h3>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isCorrect = correctIndex === idx
                const isUserSelection = userAnswerIndex === idx

                return (
                  <div 
                    key={idx} 
                    className={`p-3 md:p-4 rounded-xl border-2 flex justify-between items-start md:items-center gap-3 transition-all ${
                      correctIndex === idx 
                        ? 'bg-green-500/20 border-green-500' 
                        : userAnswerIndex === idx 
                          ? 'bg-red-500/20 border-red-500' 
                          : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs md:text-sm ${
                        isCorrect 
                          ? 'bg-green-500 text-white' 
                          : isUserSelection 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/10 text-white'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm md:text-base text-white font-medium">
                        {option}
                      </span>
                    </div>
                    <div className="flex-shrink-0 pt-1 md:pt-0">
                      {isCorrect && (
                        <span className="bg-green-500 text-[8px] md:text-[10px] px-2 py-1 rounded font-black uppercase text-white">
                          Correct
                        </span>
                      )}
                      {userAnswerIndex === idx && correctIndex !== idx && (
                        <span className="bg-red-500 text-[8px] md:text-[10px] px-2 py-1 rounded font-black uppercase text-white">
                          Your Pick
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {currentQuestion.justification && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs md:text-sm text-blue-100">
                <p className="font-bold text-blue-400 mb-1 flex items-center gap-2">
                  <Info className="w-3 h-3 md:w-4 md:h-4" /> Why this is correct:
                </p>
                {currentQuestion.justification}
              </div>
            )}

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
              <button 
                disabled={currentIndex === 0} 
                onClick={onPrevious} 
                className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <span className="text-white/40 text-xs font-bold tracking-[0.2em]">
                {currentIndex + 1} / {questions.length}
              </span>
              <button 
                disabled={currentIndex === questions.length - 1} 
                onClick={onNext} 
                className="p-2 text-white hover:bg-white/10 rounded-full disabled:opacity-20 transition-all"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}