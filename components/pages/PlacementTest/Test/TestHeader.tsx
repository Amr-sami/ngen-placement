
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Brain } from 'lucide-react'

interface TestHeaderProps {
  currentQuestion: number
  totalQuestions: number
  concept: string
  progress: number
}

export default function TestHeader({ 
  currentQuestion, 
  totalQuestions, 
  concept,
  progress 
}: TestHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-4 md:mb-8 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 md:w-12 md:h-12">
          <Image 
            src="/assets/images/logos/ngen-logo.svg" 
            alt="Logo" 
            fill 
            className="object-contain" 
          />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg md:text-xl tracking-wide">
            Placement Test
          </h1>
          <div className="flex items-center gap-2 text-xs md:text-sm text-purple-300">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            <span>{concept}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full md:w-64">
        <div className="flex justify-between text-xs text-purple-200 mb-1 font-bold">
          <span>Progress</span>
          <span>
            {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 md:h-3 bg-black/40 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>
    </div>
  )
}