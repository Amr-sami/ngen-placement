import { MessageCircle, Eye, ShoppingCart } from 'lucide-react'
import { useLocale } from 'next-intl'

interface ActionButtonsProps {
  onReviewAnswers: () => void
  onContactAdmin: () => void
  onBuyLevel: () => void
  isLoggedIn: boolean
  beltName?: string
  hasQuestions?: boolean
}

export default function ActionButtons({
  onReviewAnswers,
  onContactAdmin,
  onBuyLevel,
  isLoggedIn,
  beltName,
  hasQuestions = true,
}: ActionButtonsProps) {
  const locale = useLocale()
  const isRTL = locale === 'ar'

  // Translations
  const translations = {
    en: {
      reviewAnswers: 'Review Your Answers',
      buyLevel: 'Buy',
      thisLevel: 'This Level',
      retakeContact: 'Retake Test / Contact Us'
    },
    ar: {
      reviewAnswers: 'راجع إجاباتك',
      buyLevel: 'شراء',
      thisLevel: 'هذا المستوى',
      retakeContact: 'إعادة الاختبار / اتصل بنا'
    }
  }

  const t = translations[locale as 'en' | 'ar'] || translations.en

  return (
    <div className="space-y-4 mb-10">
      {/* Primary Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
        {/* Review Answers - Only if logged in and has questions */}
        {isLoggedIn && hasQuestions && (
          <button
            onClick={onReviewAnswers}
            className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
          >
            <Eye className="w-4 h-4 md:w-5 md:h-5" />
            {t.reviewAnswers}
          </button>
        )}

        {/* Buy Level Button */}
        {isLoggedIn && (
          <button
            onClick={onBuyLevel}
            className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            {t.buyLevel} {beltName || t.thisLevel}
          </button>
        )}
      </div>

      {/* Secondary Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-stretch sm:items-center">
        {/* Retake Test - Contact Admin Required */}
        <button
          onClick={onContactAdmin}
          className={`px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm md:text-base ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
        >
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          {t.retakeContact}
        </button>
      </div>
    </div>
  )
}