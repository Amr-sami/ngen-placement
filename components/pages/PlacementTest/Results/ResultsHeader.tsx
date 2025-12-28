'use client'

import Image from 'next/image'
import { Trophy, Lock } from 'lucide-react'
import { useLocale } from 'next-intl'

interface ResultsHeaderProps {
  studentName: string
  score: number | null
  totalQuestions: number | null
}

export default function ResultsHeader({ studentName, score, totalQuestions }: ResultsHeaderProps) {
  const locale = useLocale()
  const isRTL = locale === 'ar'
  
  const firstName = studentName.split(' ')[0] || (isRTL ? 'مستكشف' : 'Explorer')
  const isHidden = score === null || totalQuestions === null

  // Translations
  const translations = {
    en: {
      title: 'Placement Test Results',
      loginToSee: 'Log in to see your full breakdown',
      fantasticWork: `Fantastic work, ${firstName}!`,
      score: 'Score',
      hidden: 'Hidden'
    },
    ar: {
      title: 'نتائج اختبار تحديد المستوى',
      loginToSee: 'سجل دخولك لرؤية التفاصيل الكاملة',
      fantasticWork: `عمل رائع يا ${firstName}!`,
      score: 'النتيجة',
      hidden: 'مخفي'
    }
  }

  const t = translations[locale as 'en' | 'ar'] || translations.en

  return (
    <div 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-8 gap-4 bg-white/5 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 backdrop-blur-md ${isRTL ? 'font-arabic' : ''}`}
    >
      {/* Logo and Greeting */}
      <div className={`flex items-center gap-3 md:gap-4 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
        <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
          <Image
            src="/assets/images/logos/ngen-logo.svg"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">{t.title}</h1>
          <p className="text-purple-300 text-sm md:text-base">
            {isHidden ? t.loginToSee : t.fantasticWork}
          </p>
        </div>
      </div>

      {/* Score Section */}
      <div className="flex items-center gap-3 bg-white/5 sm:bg-transparent p-2 rounded-xl w-full sm:w-auto justify-center">
        <div className={isRTL ? 'text-left' : 'text-right'}>
          <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            {t.score}
          </p>
          {isHidden ? (
            <p className={`text-white/50 text-xl md:text-2xl font-black flex items-center gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <Lock className="w-5 h-5" /> {t.hidden}
            </p>
          ) : (
            <p className="text-white text-xl md:text-2xl font-black">
              {score} / {totalQuestions}
            </p>
          )}
        </div>
        
        {/* Trophy/Lock Icon Box */}
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex-shrink-0 ${isHidden ? 'bg-white/10' : 'bg-gradient-to-br from-orange-400 to-pink-500'} flex items-center justify-center shadow-lg`}>
          {isHidden ? (
            <Lock className="text-white/50 w-6 h-6 md:w-8 md:h-8" />
          ) : (
            <Trophy className="text-white w-6 h-6 md:w-8 md:h-8" />
          )}
        </div>
      </div>
    </div>
  )
}