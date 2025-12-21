import { motion } from 'framer-motion'
import { Award, Info, Clock, BookOpen, Users, Star } from 'lucide-react'
import type { BeltLevel } from './types'
import StatBox from './StatBox'

interface BeltAchievementCardProps {
  belt: BeltLevel
  score: number
}

export default function BeltAchievementCard({ belt, score }: BeltAchievementCardProps) {

//   const glowColor = belt.color.replace('bg-', 'shadow-');

  return (
    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden mb-6 md:mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* --- Left: Belt Visual (Optimized for Mobile Height) --- */}
        <div className={`lg:col-span-5 p-6 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 min-h-[320px] md:min-h-[450px]`}>
          
          {/* Animated Background Aura */}
          <div className={`absolute inset-0 opacity-20 blur-[80px] animate-pulse ${belt.color}`}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
            className="relative z-10"
          >
            {/* The Badge Container */}
            <div className={`relative group`}>
              {/* External Glow Ring */}
              <div className={`absolute -inset-4 rounded-full opacity-40 blur-2xl group-hover:opacity-70 transition-opacity duration-500 ${belt.color}`}></div>
              
              <div className={`w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full ${belt.color} border-[6px] md:border-[12px] ${belt.borderColor} shadow-2xl flex items-center justify-center relative z-10 overflow-hidden`}>
                {/* Shine effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000"></div>
                
                <div className="flex flex-col items-center justify-center p-4">
                  <Award className={`w-10 h-10 md:w-20 md:h-20 mb-1 ${belt.textColor} drop-shadow-md`} />
                  <div className={`h-1 w-12 md:w-20 rounded-full mb-2 bg-black/20`}></div>
                  <span className={`text-sm md:text-2xl font-black uppercase tracking-widest ${belt.textColor}`}>
                    {belt.belt}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 md:mt-10 relative z-10">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h3 className="text-white text-2xl md:text-5xl font-black tracking-tight leading-none">
              {belt.belt} <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Belt</span>
            </h3>
            <p className="text-purple-200/70 font-bold mt-2 text-xs md:text-lg uppercase tracking-[0.3em]">
              {belt.stage} Stage
            </p>
          </div>
        </div>

        {/* --- Right: Belt Stats --- */}
        <div className="lg:col-span-7 p-6 md:p-12 bg-black/30 backdrop-blur-md flex flex-col justify-center">
          
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <Info className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-widest">Learning Focus</span>
            </div>
            <p className="text-white text-xl md:text-4xl font-extrabold leading-tight tracking-tight">
              {belt.focus}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <StatBox 
              icon={Clock} 
              label="Duration" 
              value={belt.duration} 
              color="text-blue-400" 
            />
            <StatBox 
              icon={BookOpen} 
              label="Curriculum" 
              value={belt.totalHours} 
              color="text-green-400" 
            />
            <StatBox 
              icon={Users} 
              label="Structure" 
              value={belt.totalClasses} 
              color="text-pink-400" 
            />
          </div>

          {/* Personalized Message */}
          <div className="mt-8 md:mt-12 p-5 md:p-8 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative group">
            <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
            <p className="text-slate-300 text-sm md:text-lg leading-relaxed italic">
              "Based on your score of <span className="text-white font-bold">{score}</span>, our AI suggests starting at the <span className="text-white font-bold">{belt.belt} level</span> to ensure you have a strong foundation before moving to complex projects."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}