
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LoadingStateProps {
  loadingProgress: number
}

export default function LoadingState({ loadingProgress }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md text-center"
      >
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
              src="/assets/images/logos/ngen-logo.svg"
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
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-full" />
        </div>

        <p className="text-purple-200 mt-4 font-mono text-sm">
          {loadingProgress < 30
            ? 'Analyzing profile...'
            : loadingProgress < 60
              ? 'Selecting questions...'
              : 'Finalizing AI model...'}{' '}
          ({Math.round(loadingProgress)}%)
        </p>
      </motion.div>
    </div>
  )
}