
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  error: string | null
  onRetry: () => void
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-purple-200 mb-6">{error || 'Unable to generate test.'}</p>
        <button
          onClick={onRetry}
          className="w-full py-3 px-6 rounded-xl font-bold bg-white text-purple-900 hover:bg-purple-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}