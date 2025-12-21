
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

interface TestFooterProps {
  currentQuestion: number
  totalQuestions: number
  isAnswerSelected: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export default function TestFooter({
  currentQuestion,
  totalQuestions,
  isAnswerSelected,
  onPrevious,
  onNext,
  onSubmit,
}: TestFooterProps) {
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="p-4 md:p-6 lg:p-8 border-t border-white/10 bg-black/20 flex justify-between items-center gap-3 md:gap-4 flex-shrink-0">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className={`
          flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-white transition-all text-sm md:text-base
          ${currentQuestion === 0 
            ? 'opacity-30 cursor-not-allowed' 
            : 'hover:bg-white/10 active:scale-95'}
        `}
      >
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!isAnswerSelected}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-sm md:text-base"
        >
          <span>Finish Test</span>
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!isAnswerSelected}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-sm md:text-base"
        >
          <span className="hidden sm:inline">Next Question</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  )
}