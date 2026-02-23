
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import LoadingState from '../Test/LoadingState';
import ErrorState from '../Test/ErrorState';
import TestFooter from '../Test/TestFooter';
import { Target, CheckCircle, Sparkles, Mail } from 'lucide-react';

interface SoftSkillsMainProps {
    ageGroup: '6-9' | '10-14' | '15-18';
    onComplete: () => void;
}

const SoftSkillsMain: React.FC<SoftSkillsMainProps> = ({ ageGroup, onComplete }) => {
    const { data: session } = useSession();
    const locale = useLocale();
    const t = useTranslations('placementTest.test');
    const isRTL = locale === 'ar';
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [submitting, setSubmitting] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`/api/soft-skills/questions?ageGroup=${ageGroup}`);
                const data = await res.json();
                if (data.success) {
                    setQuestions(data.data);
                } else {
                    setError('Failed to load questions');
                }
            } catch (err) {
                setError('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [ageGroup]);

    const handleAnswer = (optionIndex: number) => {
        const currentQ = questions[currentQuestionIndex];
        setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleFinalSubmit = () => {
        const currentQ = questions[currentQuestionIndex];
        // Ensure last answer is captured if just clicked
        submitAssessment({ ...answers });
    };

    const submitAssessment = async (finalAnswers: any) => {
        setSubmitting(true);
        try {
            const res = await fetch('/api/soft-skills/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ageGroup,
                    answers: finalAnswers
                })
            });
            const result = await res.json();
            if (result.success) {
                setCompleted(true);
                // onComplete(); // Parent can handle any top-level state updates
            } else {
                setError(result.error || 'Submission failed');
            }
        } catch (err) {
            setError('Error submitting assessment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingState loadingProgress={30} />;
    if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

    if (completed) {
        const thankYouTitle = isRTL ? 'شكراً لك!' : 'Thank You!';
        const thankYouMessage = isRTL
            ? 'شكراً لإكمال تقييم المهارات الشخصية. سنتواصل معك قريباً.'
            : 'Thank you for completing the Soft Skills Assessment. We will contact you shortly.';
        const homeButton = isRTL ? 'العودة للرئيسية' : 'Return to Home';

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-2xl max-w-2xl"
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-12 h-12 text-green-400" />
                    </div>
                    <h2 className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                        {thankYouTitle}
                    </h2>
                    <p className={`text-xl text-gray-300 mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                        {thankYouMessage}
                    </p>
                    <button
                        onClick={onComplete}
                        className={`px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-purple-500/30 ${isRTL ? 'font-arabic' : ''}`}
                    >
                        {homeButton}
                    </button>
                </motion.div>
            </div>
        );
    }

    if (questions.length === 0) return <ErrorState error="No questions found." onRetry={() => window.location.reload()} />;

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Helper to get localized text
    const getQuestionText = () => isRTL ? currentQuestion.question_ar : currentQuestion.question_en;
    const getOptions = () => isRTL ? currentQuestion.options_ar : currentQuestion.options_en;

    // Arabic letters for choices
    const arabicLetters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

    return (
        <div className={`w-full max-w-5xl mx-auto px-4 flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-120px)]`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Header Info Row */}
            <div className="flex-shrink-0 mb-6">
                <div className={`flex items-center justify-between flex-wrap gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20">
                            <Target className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                            <span className={`text-[10px] uppercase tracking-[0.2em] text-pink-300/60 font-bold ${isRTL ? 'font-arabic' : ''}`}>
                                {t('question')}
                            </span>
                            <span className="text-sm font-bold text-white uppercase tracking-wider">
                                {currentQuestionIndex + 1} / {questions.length}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 max-w-xs mx-4">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="flex-1 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative min-h-0">
                {/* Decoration line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-70"></div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 md:p-10"
                    >
                        {/* Question Section */}
                        <div className="space-y-4 mb-8">
                            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-[1.2] tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                {getQuestionText()}
                            </h2>
                            <div className={`h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full ${isRTL ? 'mr-auto ml-0' : 'ml-0 mr-auto'}`} />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {getOptions().map((opt: string, idx: number) => {
                                const isSelected = answers[currentQuestion.id] === idx;
                                const displayLetter = isRTL ? arabicLetters[idx] : String.fromCharCode(65 + idx);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={submitting}
                                        className={`
                                        group relative w-full p-4 md:p-5 lg:p-6 rounded-2xl border transition-all duration-300 flex items-center gap-4 md:gap-6
                                        ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                                        ${isSelected
                                                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)] backdrop-blur-md'
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
                                                    ? 'bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-lg'
                                                    : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'}
                                        ${isRTL ? 'font-arabic' : ''}
                                        `}
                                        >
                                            {displayLetter}
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            <div className={`text-base md:text-lg lg:text-xl font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                                } ${isRTL ? 'font-arabic' : ''}`}>{opt}</div>
                                        </div>

                                        {/* Interaction Indicator */}
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
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <TestFooter
                    currentQuestion={currentQuestionIndex}
                    totalQuestions={questions.length}
                    isAnswerSelected={answers[currentQuestion.id] !== undefined}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSubmit={handleFinalSubmit}
                />
            </div>

            {submitting && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <LoadingState loadingProgress={100} />
                </div>
            )}

            {/* Global CSS for scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default SoftSkillsMain;
