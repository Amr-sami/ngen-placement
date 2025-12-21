'use client'

import { motion } from 'framer-motion'
import { LogIn, UserPlus, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface LoginPromptCardProps {
    onClose?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LoginPromptCard(_props: LoginPromptCardProps) {
    const router = useRouter()
    const t = useTranslations('placementTest.results.loginPrompt')

    const handleLogin = () => {
        // Store current path for redirect after login
        sessionStorage.setItem('returnUrl', '/placement-test/results')
        router.push('/auth/login')
    }

    const handleSignup = () => {
        sessionStorage.setItem('returnUrl', '/placement-test/results')
        router.push('/auth/signup')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 mb-6"
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                        <Shield className="w-8 h-8 text-orange-400" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {t('title')}
                    </h3>
                    <p className="text-purple-200 text-sm md:text-base">
                        {t('description')}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleLogin}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                    >
                        <LogIn className="w-5 h-5" />
                        {t('login')}
                    </button>
                    <button
                        onClick={handleSignup}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl text-white font-bold hover:scale-105 transition-all"
                    >
                        <UserPlus className="w-5 h-5" />
                        {t('signup')}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
