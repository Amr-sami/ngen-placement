'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Code2, Brain } from 'lucide-react';

export default function PlacementLanding() {
    const router = useRouter();
    const params = useParams();
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const translations = {
        en: {
            title: 'NGen Placement Test',
            subtitle: 'Choose the assessment that fits you best',
            technicalTitle: 'Technical Test',
            technicalDesc: 'Assess your coding skills and logical thinking to find the perfect starting point in our curriculum.',
            softSkillsTitle: 'Soft Skills Test',
            softSkillsDesc: 'Discover your learning style, personality strengths, and how you best collaborate with others.',
            start: 'Start Test',
        },
        ar: {
            title: 'اختبار تحديد المستوى',
            subtitle: 'اختر التقييم المناسب لك',
            technicalTitle: 'الاختبار التقني',
            technicalDesc: 'قيّم مهاراتك في البرمجة والتفكير المنطقي لتحديد نقطة البداية المثالية في مناهجنا.',
            softSkillsTitle: 'اختبار المهارات الشخصية',
            softSkillsDesc: 'اكتشف أسلوب تعلمك ونقاط قوتك الشخصية وكيف تتعاون مع الآخرين بشكل أفضل.',
            start: 'ابدأ الاختبار',
        },
    };

    const t = translations[locale as 'en' | 'ar'] || translations.en;

    const handleSelect = (type: 'technical' | 'soft_skills') => {
        router.push(`/${locale}/placement-test/survey?type=${type}`);
    };

    return (
        <div
            className="min-h-screen w-full bg-[#1a0b2e] relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-x-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
                    style={{ animationDelay: '2s' }}
                ></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full filter blur-[150px]"></div>
            </div>

            {/* Language Toggle - Fixed Top */}
            <div className="fixed top-4 right-4 left-4 z-50 flex justify-end">
                <LanguageSwitcher />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-4xl"
            >
                {/* Logo & Header */}
                <div className="text-center mb-12">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <Image
                            src="/assets/images/logos/ngen-logo.svg"
                            alt="NGen Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className={`text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                        {t.title}
                    </h1>
                    <p className={`text-purple-200/70 text-lg md:text-xl ${isRTL ? 'font-arabic' : ''}`}>
                        {t.subtitle}
                    </p>
                </div>

                {/* Test Cards */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
                    {/* Technical Test Card */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col items-center text-center cursor-pointer group hover:border-blue-500/40 transition-all duration-300"
                        onClick={() => handleSelect('technical')}
                    >
                        <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                            <Code2 className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className={`text-2xl font-bold text-white mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                            {t.technicalTitle}
                        </h3>
                        <p className={`text-gray-300/80 mb-8 flex-grow leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                            {t.technicalDesc}
                        </p>
                        <button
                            className={`w-full px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all text-lg ${isRTL ? 'font-arabic' : ''}`}
                        >
                            {t.start}
                        </button>
                    </motion.div>

                    {/* Soft Skills Test Card */}
                    <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col items-center text-center cursor-pointer group hover:border-purple-500/40 transition-all duration-300"
                        onClick={() => handleSelect('soft_skills')}
                    >
                        <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                            <Brain className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className={`text-2xl font-bold text-white mb-3 ${isRTL ? 'font-arabic' : ''}`}>
                            {t.softSkillsTitle}
                        </h3>
                        <p className={`text-gray-300/80 mb-8 flex-grow leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
                            {t.softSkillsDesc}
                        </p>
                        <button
                            className={`w-full px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all text-lg ${isRTL ? 'font-arabic' : ''}`}
                        >
                            {t.start}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
