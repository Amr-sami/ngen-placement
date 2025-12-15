'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Cpu, 
  Code2, 
  ShieldCheck, 
  Database, 
  Palette, 
  Bot,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type TrackKey = 'programming' | 'artificialIntelligence' | 'cybersecurity' | 'dataScience' | 'robotics' | 'creativeArts';

export const TRACK_KEYS: TrackKey[] = [
  'programming',
  'artificialIntelligence',
  'cybersecurity',
  'dataScience',
  'robotics',
  'creativeArts'
];

interface TracksBeltsProps {
  activeTrack: TrackKey;
  onSelectTrack: (track: TrackKey) => void;
}

const trackConfigs: Record<TrackKey, { 
  icon: any; 
  gradient: string; 
  shadowColor: string;
  emoji: string;
  particles: string[];
}> = {
  programming: { 
    icon: Code2, 
    gradient: 'from-blue-400 via-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/50',
    emoji: '💻',
    particles: ['🚀', '⚡', '✨']
  },
  artificialIntelligence: { 
    icon: Cpu, 
    gradient: 'from-purple-400 via-violet-500 to-purple-600',
    shadowColor: 'shadow-purple-500/50',
    emoji: '🤖',
    particles: ['🧠', '⭐', '🔮']
  },
  cybersecurity: { 
    icon: ShieldCheck, 
    gradient: 'from-red-400 via-rose-500 to-pink-500',
    shadowColor: 'shadow-red-500/50',
    emoji: '🛡️',
    particles: ['🔒', '⚔️', '💎']
  },
  dataScience: { 
    icon: Database, 
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    shadowColor: 'shadow-green-500/50',
    emoji: '📊',
    particles: ['📈', '🎯', '💡']
  },
  robotics: { 
    icon: Bot, 
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    shadowColor: 'shadow-orange-500/50',
    emoji: '🦾',
    particles: ['⚙️', '🔧', '🎮']
  },
  creativeArts: { 
    icon: Palette, 
    gradient: 'from-pink-400 via-rose-500 to-fuchsia-500',
    shadowColor: 'shadow-pink-500/50',
    emoji: '🎨',
    particles: ['🌈', '🎭', '✨']
  },
};

const TracksBelts: React.FC<TracksBeltsProps> = ({ activeTrack, onSelectTrack }) => {
  const t = useTranslations('home.roadmap.tracks');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredTrack, setHoveredTrack] = useState<TrackKey | null>(null);
  const [clickedTrack, setClickedTrack] = useState<TrackKey | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate items per view
  const itemsPerView = isMobile ? 3 : 1;

  // Auto-scroll to active track
  useEffect(() => {
    const activeIndex = TRACK_KEYS.indexOf(activeTrack);
    if (activeIndex !== -1) {
      setCurrentIndex(activeIndex);
    }
  }, [activeTrack]);

  const handleTrackClick = (track: TrackKey) => {
    setClickedTrack(track);
    onSelectTrack(track);
    
    setTimeout(() => {
      setClickedTrack(null);
    }, 600);
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (carouselRef.current) {
      if (isMobile) {
        // On mobile, scroll to show 3 items at a time
        const cardWidth = 110; // Smaller card width for mobile
        const gap = 12;
        const containerWidth = carouselRef.current.offsetWidth;
        const totalCardWidth = cardWidth + gap;
        
        // Center the group of 3 cards
        const scrollPosition = Math.max(0, (index * totalCardWidth) - (containerWidth / 2) + (totalCardWidth * 1.5));
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      } else {
        // Desktop: scroll to center single card
        const cardWidth = 200;
        const gap = 16;
        const containerWidth = carouselRef.current.offsetWidth;
        const scrollPosition = (index * (cardWidth + gap)) - (containerWidth / 2) + (cardWidth / 2);
        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : TRACK_KEYS.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < TRACK_KEYS.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  return (
    <div className="w-full px-4 py-8 overflow-hidden">
      {/* Title Section */}
      <div className="text-center mb-8 animate-bounce-slow">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
          <h3 className="font-bold text-lg md:text-xl text-purple-900">
            Choose Your Adventure! 🎮
          </h3>
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-6xl mx-auto">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-purple-100 text-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 -translate-x-4 md:-translate-x-6"
          aria-label="Previous track"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-purple-100 text-purple-600 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 translate-x-4 md:translate-x-6"
          aria-label="Next track"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Track */}
        <div
          ref={carouselRef}
          className={`flex gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide ${isMobile ? 'px-4' : 'px-12 md:px-16'}`}
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {TRACK_KEYS.map((track, index) => {
            const Config = trackConfigs[track];
            const Icon = Config.icon;
            const isActive = activeTrack === track;
            const isHovered = hoveredTrack === track;
            const isClicked = clickedTrack === track;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={track}
                className={`
                  flex-shrink-0 scroll-snap-align-center transition-all duration-500
                  ${isMobile ? 'w-[110px]' : 'w-[200px]'}
                  ${!isMobile && (isCurrent ? 'scale-100 opacity-100' : 'scale-90 opacity-60')}
                `}
                style={{ scrollSnapAlign: 'center' }}
              >
                <button
                  onClick={() => handleTrackClick(track)}
                  onMouseEnter={() => setHoveredTrack(track)}
                  onMouseLeave={() => setHoveredTrack(null)}
                  className={`
                    relative w-full overflow-hidden rounded-3xl transition-all duration-300
                    ${isActive 
                      ? `scale-105 ${Config.shadowColor} shadow-2xl ring-4 ring-white` 
                      : 'hover:scale-105 hover:shadow-xl'
                    }
                    ${isClicked ? 'animate-wiggle' : ''}
                  `}
                >
                  {/* Gradient Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${Config.gradient} 
                    ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}
                    transition-opacity duration-300
                  `} />

                  {/* Sparkle Particles */}
                  {(isActive || isHovered) && (
                    <>
                      {Config.particles.map((particle, i) => (
                        <span
                          key={i}
                          className="absolute text-2xl animate-float pointer-events-none"
                          style={{
                            top: `${20 + i * 30}%`,
                            left: `${10 + i * 20}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: `${2 + i * 0.5}s`
                          }}
                        >
                          {particle}
                        </span>
                      ))}
                    </>
                  )}

                  {/* Content Container */}
                  <div className={`relative z-10 flex flex-col items-center justify-center ${isMobile ? 'p-3 h-32' : 'p-6 h-48'}`}>
                    {/* Emoji Badge */}
                    <div className={`
                      ${isMobile ? 'text-3xl mb-1' : 'text-5xl mb-3'}
                      ${isActive || isHovered ? 'animate-bounce-gentle' : ''}
                      transition-transform duration-300
                      ${isActive ? 'scale-125' : 'hover:scale-110'}
                    `}>
                      {Config.emoji}
                    </div>

                    {/* Icon */}
                    <div className={`
                      ${isMobile ? 'mb-1' : 'mb-3'} transition-all duration-300
                      ${isActive ? 'scale-110 rotate-12' : 'hover:rotate-6'}
                    `}>
                      <Icon className={`${isMobile ? 'w-5 h-5' : 'w-8 h-8'} text-white drop-shadow-lg`} />
                    </div>

                    {/* Track Name */}
                    <span className={`font-black ${isMobile ? 'text-[10px]' : 'text-sm'} text-white text-center drop-shadow-lg leading-tight px-2`}>
                      {t(`${track}.title`)}
                    </span>

                    {/* Active Badge */}
                    {isActive && (
                      <div className={`absolute -top-2 -right-2 bg-yellow-400 text-purple-900 ${isMobile ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-xs'} rounded-full font-black shadow-lg animate-pulse`}>
                        ⭐ {isMobile ? '' : 'Active'}
                      </div>
                    )}

                    {/* Hover Glow */}
                    <div className={`
                      absolute inset-0 bg-white 
                      ${isHovered ? 'opacity-20' : 'opacity-0'}
                      transition-opacity duration-300
                    `} />
                  </div>

                  {/* Bottom Shine Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Click Ripple Effect */}
                  {isClicked && (
                    <div className="absolute inset-0 bg-white animate-ripple" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {TRACK_KEYS.map((track, index) => (
            <button
              key={track}
              onClick={() => scrollToIndex(index)}
              className={`
                transition-all duration-300 rounded-full
                ${index === currentIndex 
                  ? 'w-8 h-3 bg-purple-600' 
                  : 'w-3 h-3 bg-purple-300 hover:bg-purple-400'
                }
              `}
              aria-label={`Go to ${track}`}
            />
          ))}
        </div>
      </div>

      {/* Fun Message */}
      {activeTrack && (
        <div className="text-center mt-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-purple-200">
            <span className="text-2xl">{trackConfigs[activeTrack].emoji}</span>
            <span className="font-bold text-purple-900">
              Amazing choice! 🎉
            </span>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg) scale(1.05);
          }
          25% {
            transform: rotate(-5deg) scale(1.1);
          }
          75% {
            transform: rotate(5deg) scale(1.1);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 1s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out;
        }

        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TracksBelts;