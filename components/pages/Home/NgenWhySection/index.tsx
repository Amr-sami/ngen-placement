'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function EnhancedWhySection() {
  const t = useTranslations('whySection');
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const DATA = [
    {
      id: 0,
      title: t('features.aiPathway.title'),
      description: t('features.aiPathway.description'),
      imageUrl: '/assets/images/soft-skills-image.svg',
      theme: { bg: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-200' },
    },
    {
      id: 1,
      title: t('features.projectBased.title'),
      description: t('features.projectBased.description'),
      imageUrl: '/assets/images/insights-image.svg',
      theme: { bg: 'from-orange-400 to-pink-500', ring: 'ring-orange-200' },
    },
    {
      id: 2,
      title: t('features.softSkills.title'),
      description: t('features.softSkills.description'),
      imageUrl: '/assets/images/courses-parents-image.svg',
      theme: { bg: 'from-purple-400 to-indigo-500', ring: 'ring-purple-200' },
    },
    {
      id: 3,
      title: t('features.entrepreneurship.title'),
      description: t('features.entrepreneurship.description'),
      imageUrl: '/assets/images/games-image.svg',
      theme: { bg: 'from-rose-400 to-red-500', ring: 'ring-rose-200' },
    },
    {
      id: 4,
      title: t('features.trackGrowth.title'),
      description: t('features.trackGrowth.description'),
      imageUrl: '/assets/images/teachers-image.svg',
      theme: { bg: 'from-blue-400 to-cyan-500', ring: 'ring-blue-200' },
    },
    {
      id: 5,
      title: t('features.parentDashboard.title'),
      description: t('features.parentDashboard.description'),
      imageUrl: '/assets/images/soft-skills-image.svg',
      theme: { bg: 'from-emerald-400 to-teal-500', ring: 'ring-emerald-200' },
    },
  ];

  const nextCard = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % DATA.length);
  }, [DATA.length]);

  const prevCard = () => {
    setActiveTab((prev) => (prev - 1 + DATA.length) % DATA.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextCard, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextCard]);

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-0 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 opacity-10 bg-gradient-to-br ${DATA[activeTab].theme.bg}`} />
        <div className={`absolute top-1/2 right-0 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 opacity-10 bg-gradient-to-br ${DATA[activeTab].theme.bg}`} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
            {t('title')}{' '}
            <span className={`bg-gradient-to-r ${DATA[activeTab].theme.bg} bg-clip-text text-transparent transition-all duration-700`}>
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Main Content - Stacked Layout */}
        <div className="space-y-6">
          
          {/* Visual Card */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs md:max-w-sm">
              <div className={`absolute -inset-2 bg-gradient-to-br ${DATA[activeTab].theme.bg} rounded-2xl opacity-5 blur-lg`} />
              
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${DATA[activeTab].theme.bg} rounded-2xl rotate-1 opacity-10 transition-all duration-700`} />
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg transition-all duration-700" />
                
                <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-white/60">
                  <div key={activeTab} className="relative aspect-square w-full animate-fade-scale">
                    <img
                      src={DATA[activeTab].imageUrl}
                      alt={DATA[activeTab].title}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Below */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h3 key={activeTab} className="text-xl md:text-2xl font-bold text-slate-900 animate-fade-in">
              {DATA[activeTab].title}
            </h3>

            <p key={`desc-${activeTab}`} className="text-sm md:text-base text-slate-600 animate-fade-in-delayed">
              {DATA[activeTab].description}
            </p>

            {/* Controls */}
            <div className="flex flex-col items-center gap-3 pt-2">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevCard}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  className="p-2 rounded-lg bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                  aria-label={t('previous')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextCard}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  className={`p-2 rounded-lg bg-gradient-to-br ${DATA[activeTab].theme.bg} text-white shadow-md hover:shadow-lg transition-all active:scale-95`}
                  aria-label={t('next')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {DATA.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { 
                      setActiveTab(i); 
                      setIsAutoPlaying(false);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeTab === i ? `w-10 bg-gradient-to-r ${item.theme.bg}` : 'w-6 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`${t('next')} ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delayed {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-delayed { animation: fade-in-delayed 0.3s ease-out 0.08s forwards; }
        .animate-fade-scale { animation: fade-scale 0.3s ease-out forwards; }
      `}</style>
    </section>
  );
}