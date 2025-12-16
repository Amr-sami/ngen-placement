'use client';

import { H2 } from '@/components/general/Heading';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/lib/useRTL';

const DATA = [
  {
    id: 0,
    title: 'Digital-First AI Pathway',
    icon: '🚀',
    description: 'Start your journey into AI with our structured learning path from L1A to L5B!',
    imageUrl: '/assets/images/soft-skills-image.svg',
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  {
    id: 1,
    title: 'Project-Based Learning',
    icon: '🧩',
    description: 'Build real projects and create your own capstone masterpiece!',
    imageUrl: '/assets/images/insights-image.svg',
    bg: 'bg-gradient-to-br from-orange-400 to-pink-500',
  },
  {
    id: 2,
    title: 'Soft Skills Built-In',
    icon: '⭐',
    description: 'Develop teamwork, communication, and problem-solving skills naturally!',
    imageUrl: '/assets/images/courses-parents-image.svg',
    bg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
  },
  {
    id: 3,
    title: 'Entrepreneurship Mindset',
    icon: '💼',
    description: 'Think like a business owner and turn ideas into reality!',
    imageUrl: '/assets/images/games-image.svg',
    bg: 'bg-gradient-to-br from-rose-400 to-red-500',
  },
  {
    id: 4,
    title: 'Track Your Growth',
    icon: '📈',
    description: 'See your progress with detailed reports and achievements!',
    imageUrl: '/assets/images/teachers-image.svg',
    bg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
  },
  {
    id: 5,
    title: 'Parent Dashboard',
    icon: '👪',
    description: 'Parents stay updated with real-time progress and insights!',
    imageUrl: '/assets/images/soft-skills-image.svg',
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  {
    id: 6,
    title: 'Gamified & Fun',
    icon: '🥷',
    description: 'Earn ninja belts, badges, and unlock achievements!',
    imageUrl: '/assets/images/insights-image.svg',
    bg: 'bg-gradient-to-br from-orange-400 to-pink-500',
  },
  {
    id: 7,
    title: 'Friendly Competitions',
    icon: '🏆',
    description: 'Challenge yourself and compete with peers in exciting contests!',
    imageUrl: '/assets/images/courses-parents-image.svg',
    bg: 'bg-gradient-to-br from-purple-400 to-indigo-500',
  },
  {
    id: 8,
    title: 'Pro Tools Made Easy',
    icon: '🧰',
    description: 'Access world-class tools designed specifically for young learners!',
    imageUrl: '/assets/images/games-image.svg',
    bg: 'bg-gradient-to-br from-rose-400 to-red-500',
  },
  {
    id: 9,
    title: 'Expert Trainers',
    icon: '👩🏫',
    description: 'Learn from passionate teachers who love what they do!',
    imageUrl: '/assets/images/teachers-image.svg',
    bg: 'bg-gradient-to-br from-blue-400 to-cyan-500',
  },
  {
    id: 10,
    title: 'Build Your Portfolio',
    icon: '🗂',
    description: 'Create an impressive showcase of your amazing work!',
    imageUrl: '/assets/images/soft-skills-image.svg',
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  {
    id: 11,
    title: 'Always Improving',
    icon: '🎓',
    description: 'Our teachers keep learning to give you the best experience!',
    imageUrl: '/assets/images/insights-image.svg',
    bg: 'bg-gradient-to-br from-orange-400 to-pink-500',
  },
];

// Animated journey elements
const journeyIcons = [''];

// Pre-generated sparkle positions to avoid hydration mismatch
const SPARKLE_POSITIONS = [
  { left: 5, top: 15, delay: 0.4, size: 26 },
  { left: 12, top: 67, delay: 0.2, size: 28 },
  { left: 31, top: 44, delay: 1.3, size: 20 },
  { left: 39, top: 81, delay: 2.1, size: 25 },
  { left: 82, top: 11, delay: 2.5, size: 14 },
  { left: 59, top: 88, delay: 0.8, size: 21 },
  { left: 62, top: 2, delay: 0.9, size: 28 },
  { left: 84, top: 47, delay: 2.5, size: 22 },
  { left: 15, top: 71, delay: 0.5, size: 22 },
  { left: 49, top: 83, delay: 2.2, size: 10 },
  { left: 3, top: 40, delay: 0.9, size: 29 },
  { left: 32, top: 89, delay: 2.7, size: 23 },
  { left: 64, top: 79, delay: 2.9, size: 23 },
  { left: 94, top: 67, delay: 2.1, size: 10 },
  { left: 41, top: 37, delay: 0.3, size: 21 },
];

function HomepageNgenWhySection() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const t = useTranslations('home.sections');
  const isRTL = useRTL();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab((prev) => (prev + 1) % DATA.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextCard = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab((prev) => (prev + 1) % DATA.length);
      setIsTransitioning(false);
    }, 300);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevCard = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab((prev) => (prev - 1 + DATA.length) % DATA.length);
      setIsTransitioning(false);
    }, 300);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToCard = (index: number) => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(index);
      setIsTransitioning(false);
    }, 300);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const activeItem = DATA[activeTab];
  const displayItems = [
    DATA[(activeTab - 1 + DATA.length) % DATA.length],
    activeItem,
    DATA[(activeTab + 1) % DATA.length],
  ];

  return (
    <section id="why-ngen" className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated Journey Path Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wavy path */}
        <svg className="absolute w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#EC4899', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <path
            d="M 0,200 Q 200,100 400,200 T 800,200 T 1200,200 T 1600,200"
            stroke="url(#pathGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="20,10"
            className="animate-dash"
          />
        </svg>

        {/* Floating journey icons along the path */}
        {journeyIcons.map((icon, index) => (
          <div
            key={index}
            className="absolute text-4xl animate-float"
            style={{
              left: `${(index * 8.33) + 5}%`,
              top: `${20 + Math.sin(index * 0.5) * 15}%`,
              animationDelay: `${index * 0.3}s`,
              animationDuration: `${3 + (index % 3)}s`,
            }}
          >
            {icon}
          </div>
        ))}

        {/* Sparkling stars */}
        {SPARKLE_POSITIONS.map((sparkle, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-400 animate-twinkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              fontSize: `${sparkle.size}px`,
            }}
          >
            ✨
          </div>
        ))}

        {/* Floating clouds */}
        <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float-slow">☁️</div>
        <div className="absolute top-32 right-20 text-7xl opacity-20 animate-float-slow" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute bottom-20 left-1/3 text-5xl opacity-25 animate-float-slow" style={{ animationDelay: '2s' }}>☁️</div>
      </div>

      <div className="container mx-auto px-4 md:px-5 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <H2 classNames="mb-2 text-2xl md:text-3xl lg:text-4xl inline-block animate-bounce-gentle">
            {t('whyNgen')} 🎉
          </H2>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Join the adventure! 12 amazing stops on your learning journey! 🚂
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop: 3-Card View */}
          <div className="hidden lg:flex items-center justify-center gap-4 mb-8 h-[450px]">
            {displayItems.map((item, index) => {
              const isActive = item.id === activeTab;
              const isPrev = index === 0;

              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => goToCard(item.id)}
                  className={`
                    relative rounded-3xl overflow-hidden cursor-pointer
                    transition-all duration-700 ease-out
                    ${isActive
                      ? 'w-[600px] h-[400px] shadow-2xl z-10'
                      : 'w-[160px] h-[340px] opacity-60 hover:opacity-80 scale-95 hover:scale-100'
                    }
                  `}
                  style={{
                    transform: isActive
                      ? 'scale(1) rotateY(0deg)'
                      : isPrev
                        ? 'translateX(20px) rotateY(15deg)'
                        : 'translateX(-20px) rotateY(-15deg)',
                  }}
                >
                  <div className={`${item.bg} w-full h-full p-8 flex flex-col text-white relative overflow-hidden`}>
                    {/* Animated background bubbles */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {isActive ? (
                      <div className={isTransitioning ? 'animate-popOut' : 'animate-popIn'}>
                        {/* Active Card - Full Details */}
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <span className="text-7xl animate-bounce-gentle">{item.icon}</span>
                          <h3 className="text-3xl font-bold">{item.title}</h3>
                        </div>
                        <p className="text-xl mb-6 flex-1 relative z-10 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="relative h-52 mt-auto z-10">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className={`object-contain drop-shadow-2xl ${isRTL ? '' : 'scale-x-[-1]'}`}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Side Cards - Icon Only */}
                        <div className="flex flex-col items-center justify-center h-full gap-4 relative z-10">
                          <span className="text-6xl transform transition-all duration-300 hover:scale-125 hover:rotate-12">
                            {item.icon}
                          </span>
                          <p className="text-sm font-bold text-center px-2">
                            {item.title}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Magical shine effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none animate-shine" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile & Tablet: Single Card View */}
          <div className="lg:hidden mb-8">
            <div className="relative h-[400px] sm:h-[450px] md:h-[500px]">
              <div
                className={`${activeItem.bg} w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col text-white relative overflow-hidden shadow-2xl ${isTransitioning ? 'animate-popOut' : 'animate-popIn'}`}
              >
                {/* Animated background bubbles */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Content */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 relative z-10">
                  <span className="text-5xl sm:text-6xl md:text-7xl animate-bounce-gentle">{activeItem.icon}</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{activeItem.title}</h3>
                </div>
                <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 flex-1 relative z-10 leading-relaxed">
                  {activeItem.description}
                </p>
                <div className="relative h-36 sm:h-44 md:h-52 mt-auto z-10">
                  <Image
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    fill
                    className={`object-contain drop-shadow-2xl ${isRTL ? '' : 'scale-x-[-1]'}`}
                  />
                </div>

                {/* Magical shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none animate-shine" />
              </div>
            </div>
          </div>

          {/* Colorful Navigation Arrows */}
          <button
            onClick={prevCard}
            className="absolute left-0 lg:left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-2xl transition-all hover:scale-110 animate-pulse-slow"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextCard}
            className="absolute right-0 lg:right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-20 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-2xl transition-all hover:scale-110 animate-pulse-slow"
            aria-label="Next"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Colorful Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {DATA.map((item) => (
              <button
                key={item.id}
                onClick={() => goToCard(item.id)}
                className={`
                  transition-all duration-500 rounded-full
                  ${activeTab === item.id
                    ? `w-8 sm:w-10 h-3 ${item.bg} shadow-lg animate-bounce-gentle`
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125'
                  }
                `}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>

          {/* Progress with emoji */}
          <div className="text-center mt-4 font-bold text-lg">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Stop {activeTab + 1} of {DATA.length}
            </span>
            {isAutoPlaying && <span className="ml-2 text-sm text-purple-500 animate-pulse">🚂 Riding along...</span>}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes popIn {
          0% { transform: scale(0.8) rotateY(180deg); opacity: 0; }
          60% { transform: scale(1.1) rotateY(-20deg); }
          100% { transform: scale(1) rotateY(0deg); opacity: 1; }
        }
        
        @keyframes popOut {
          0% { transform: scale(1) rotateY(0deg); opacity: 1; }
          100% { transform: scale(0.8) rotateY(-180deg); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-popIn {
          animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-popOut {
          animation: popOut 0.3s ease-in forwards;
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        
        .animate-dash {
          animation: dash 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HomepageNgenWhySection;