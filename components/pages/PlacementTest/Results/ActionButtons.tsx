
import { MessageCircle, Eye, ShoppingCart } from 'lucide-react'

interface ActionButtonsProps {
  onReviewAnswers: () => void
  onContactAdmin: () => void
  onBuyLevel: () => void
  isLoggedIn: boolean
  beltName?: string
}

export default function ActionButtons({
  onReviewAnswers,
  onContactAdmin,
  onBuyLevel,
  isLoggedIn,
  beltName,
}: ActionButtonsProps) {
  return (
    <div className="space-y-4 mb-10">
      {/* Primary Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
        {/* Review Answers - Only if logged in */}
        {isLoggedIn && (
          <button
            onClick={onReviewAnswers}
            className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Eye className="w-4 h-4 md:w-5 md:h-5" />
            Review Your Answers
          </button>
        )}

        {/* Buy Level Button */}
        <button
          onClick={onBuyLevel}
          className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          Buy {beltName || 'This Level'}
        </button>
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
        {/* Retake Test - Contact Admin Required */}
        <button
          onClick={onContactAdmin}
          className="px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          Retake Test / Contact Us
        </button>
      </div>
    </div>
  )
}