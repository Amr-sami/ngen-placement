
import { motion, AnimatePresence } from 'framer-motion'
import { Loader, CheckCircle } from 'lucide-react'

interface SaveStatusIndicatorProps {
  status: 'idle' | 'saving' | 'success' | 'error'
}

export default function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  if (status === 'idle' || status === 'error') return null

  return (
    <AnimatePresence>
      {(status === 'saving' || status === 'success') && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 ${
            status === 'success' ? 'bg-green-500/90' : 'bg-blue-500/90'
          } backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2`}
        >
          {status === 'saving' ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="text-xs md:text-sm font-medium">
            {status === 'saving' ? 'Saving...' : 'Saved!'}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}