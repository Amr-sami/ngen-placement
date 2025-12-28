'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Target, Sparkles } from 'lucide-react'
import { useLocale } from 'next-intl'
import type { ApiQuestion } from './types'

interface QuestionCardProps {
  question: ApiQuestion
  selectedAnswer: number | null
  onSelectAnswer: (index: number) => void
}

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  onSelectAnswer 
}: QuestionCardProps) {
  const locale = useLocale()
  const isRTL = locale === 'ar'

  // Translations
  const translations = {
    en: {
      currentChallenge: 'Current Challenge',
      level: 'Level',
      expert: 'Expert',
      standard: 'Standard'
    },
    ar: {
      currentChallenge: 'التحدي الحالي',
      level: 'المستوى',
      expert: 'خبير',
      standard: 'قياسي'
    }
  }

  const t = translations[locale as 'en' | 'ar'] || translations.en

  // Arabic letters for choices
  const arabicLetters = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div className="p-6 md:p-10 flex flex-col gap-6 md:gap-8 max-w-5xl mx-auto">
      {/* Header Info Row */}
      <div className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
            <span className={`text-[10px] uppercase tracking-[0.2em] text-purple-300/60 font-bold ${isRTL ? 'font-arabic' : ''}`}>
              {t.currentChallenge}
            </span>
            <span className={`text-sm font-bold text-white uppercase tracking-wider ${isRTL ? 'font-arabic' : ''}`}>
              {t.level} {question.difficulty_level || 1}
            </span>
          </div>
        </div>
        
        {/* Difficulty Glow Indicator */}
        <div className={`px-4 py-1 rounded-full text-[11px] font-black uppercase border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${isRTL ? 'font-arabic' : ''} ${
          question.difficulty_level === 3 
            ? 'bg-red-500/20 text-red-400 border-red-500/40' 
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {question.difficulty_level === 3 ? t.expert : t.standard}
        </div>
      </div>

      {/* Question Section */}
      <div className="space-y-4">
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-[1.2] tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
          {question.question}
        </h2>
        <div className={`h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${isRTL ? 'mr-auto ml-0' : 'ml-0 mr-auto'}`} />
      </div>

      {/* Choices Grid */}
      <div className="grid grid-cols-1 gap-4">
        {question.choices.map((option, index) => {
          const isSelected = selectedAnswer === index
          const displayLetter = isRTL ? arabicLetters[index] : String.fromCharCode(65 + index)

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectAnswer(index)}
              whileHover={{ x: isRTL ? -8 : 8 }}
              whileTap={{ scale: 0.995 }}
              className={`
                group relative w-full p-4 md:p-5 lg:p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 md:gap-6
                ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                ${isSelected 
                  ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)] backdrop-blur-md' 
                  : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10 backdrop-blur-sm'}
              `}
            >
              {/* Animated Glow Border (Selected Only) */}
              {isSelected && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-2xl ring-2 ring-pink-500/50 pointer-events-none"
                />
              )}

              {/* Choice Letter Bubble */}
              <div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl flex-shrink-0 transition-all duration-300
                  ${isSelected 
                    ? 'bg-gradient-to-br from-orange-400 to-pink-600 text-white shadow-lg' 
                    : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'}
                  ${isRTL ? 'font-arabic' : ''}
                `}
              >
                {displayLetter}
              </div>

              {/* Choice Text */}
              <div className="flex flex-col flex-1">
                <span
                  className={`text-base md:text-lg lg:text-xl font-semibold transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  } ${isRTL ? 'font-arabic' : ''}`}
                >
                  {option}
                </span>
              </div>

              {/* Interaction Indicators */}
              <div className="flex items-center justify-center w-8 h-8">
                <AnimatePresence mode="wait">
                  {isSelected ? (
                    <motion.div
                      key="selected"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle className="w-6 h-6 text-pink-500 fill-pink-500/20" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Sparkles className="w-5 h-5 text-white/30" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}