
import { RefreshCcw } from 'lucide-react'

interface ActionButtonsProps {
  onReviewAnswers: () => void
  onRetakeTest: () => void
}

export default function ActionButtons({ onReviewAnswers, onRetakeTest }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center mb-10">
      <button
        onClick={onReviewAnswers}
        className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
      >
        Review Your Answers
      </button>
      <button
        onClick={onRetakeTest}
        className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
      >
        Retake Test <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  )
}