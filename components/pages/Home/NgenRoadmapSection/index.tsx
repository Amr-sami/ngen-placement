"use client";

import React, { useState, useRef, useEffect } from "react";
import FeatureCard from "../../../general/Cards/FeatureCard";
import { H2 } from "@/components/general/Heading";
import arrow1 from "@/public/assets/images/arrow-1.svg";
import arrow2 from "@/public/assets/images/arrow-2.svg";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TrackKey =
  | "dataScience"
  | "programming"
  | "artificialIntelligence"
  | "creativeArts"
  | "robotics"
  | "cybersecurity";

type RoadmapTrack = {
  id: string;
  trackKey: TrackKey;
  image: string;
  variant?: "image-left" | "image-right";
};

const TRACKS_DATA: RoadmapTrack[] = [
  {
    id: "artificial-intelligence",
    trackKey: "artificialIntelligence",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "programming",
    trackKey: "programming",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
  {
    id: "data-science",
    trackKey: "dataScience",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "cybersecurity",
    trackKey: "cybersecurity",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
  {
    id: "robotics",
    trackKey: "robotics",
    image: "/assets/images/placeholder.svg",
    variant: "image-left",
  },
  {
    id: "creative-arts",
    trackKey: "creativeArts",
    image: "/assets/images/placeholder-1.svg",
    variant: "image-right",
  },
];

function HomepageNgenRoadmapSection() {
  const t = useTranslations("home.roadmap");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  // Desktop drag states
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragRotation, setDragRotation] = useState(0);

  // Mobile swipe states
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cards, setCards] = useState(TRACKS_DATA);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Auto-play for desktop 3D carousel
  useEffect(() => {
    if (isDesktop && isAutoPlaying && !isDraggingDesktop) {
      autoPlayTimer.current = setInterval(() => {
        nextCard();
      }, 3000);
    }

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isDesktop, isAutoPlaying, currentIndex, isDraggingDesktop]);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS_DATA.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS_DATA.length) % TRACKS_DATA.length);
  };

  // Desktop drag handlers for circular motion
  const handleDesktopDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDraggingDesktop(true);
    setIsAutoPlaying(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragRotation(0);
  };

  const handleDesktopDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingDesktop) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    setDragRotation(diff * 0.3); // Sensitivity: adjust multiplier for more/less sensitive drag
  };

  const handleDesktopDragEnd = () => {
    if (!isDraggingDesktop) return;

    // If dragged enough, move to next/prev card
    if (Math.abs(dragRotation) > 50) {
      if (dragRotation > 0) {
        prevCard();
      } else {
        nextCard();
      }
    }

    setIsDraggingDesktop(false);
    setDragRotation(0);

    // Resume auto-play after 3 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  const handleMouseEnter = () => {
    if (isDesktop && !isDraggingDesktop) setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (isDesktop && !isDraggingDesktop) setIsAutoPlaying(true);
  };

  // Mobile swipe handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDesktop) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isDesktop) return;
    e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isDesktop) return;
    e.preventDefault();

    const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2);

    if (distance > 150) {
      setCards((prev) => [...prev.slice(1), prev[0]]);
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    if (isDesktop) return;
    if (dragOffset.x === 0 && dragOffset.y === 0) {
      setCards((prev) => [...prev.slice(1), prev[0]]);
    }
  };

  return (
    <section className="bg-purple-lighter py-6 md:py-10 lg:py-20 relative overflow-hidden">
      <Image
        src={arrow1}
        alt="arrow"
        className="absolute top-0 ltr:right-0 rtl:left-0 hidden ltr:-translate-x-[5%] rtl:translate-x-[5%] translate-y-[5%] lg:block z-0 rtl:scale-x-[-1]"
      />
      <Image
        src={arrow2}
        alt="arrow"
        className="absolute bottom-0 ltr:right-1/4 rtl:left-1/4 translate-y-1/2 hidden lg:block z-0 rtl:scale-x-[-1]"
      />
      <div className="container mx-auto px-5 flex flex-col gap-4 md:gap-7 lg:gap-12 relative z-10">
        <div className="flex flex-col gap-2">
          <H2>{t("title")}</H2>
          <p className="text-gray-tertiary text-sm md:text-base lg:text-lg max-w-3xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Desktop: 3D Circular Carousel with Drag */}
        {isDesktop ? (
          <div
            className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleDesktopDragStart}
            onMouseMove={handleDesktopDragMove}
            onMouseUp={handleDesktopDragEnd}
            onTouchStart={handleDesktopDragStart}
            onTouchMove={handleDesktopDragMove}
            onTouchEnd={handleDesktopDragEnd}
          >
            <div
              className="relative w-full h-full"
              style={{
                perspective: '2000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {TRACKS_DATA.map((track, index) => {
                const baseAngle = ((index - currentIndex) * 360) / TRACKS_DATA.length;
                const angle = baseAngle + dragRotation;
                const isCurrent = index === currentIndex;

                return (
                  <div
                    key={track.id}
                    className="absolute top-1/2 left-1/2 w-full max-w-2xl"
                    style={{
                      transform: `
                        translate(-50%, -50%)
                        rotateY(${angle}deg)
                        translateZ(${isCurrent ? '500px' : '400px'})
                        scale(${isCurrent ? 1 : 0.7})
                      `,
                      transition: isDraggingDesktop ? 'none' : 'all 0.7s ease-out',
                      opacity: isCurrent ? 1 : 0.4,
                      zIndex: isCurrent ? 10 : 1,
                      pointerEvents: 'none',
                    }}
                  >
                    <FeatureCard
                      title={t(`tracks.${track.trackKey}.title`)}
                      description={t(`tracks.${track.trackKey}.description`)}
                      image={track.image}
                      variant={track.variant}
                    />
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevCard}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
            <button
              onClick={nextCard}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {TRACKS_DATA.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                    ? 'bg-purple-600 w-8'
                    : 'bg-purple-300 hover:bg-purple-400'
                    }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Mobile/Tablet: Stack Swipe */
          <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center touch-none">
            {cards.map((track, index) => {
              const isTop = index === 0;
              const zIndex = cards.length - index;
              const scale = 1 - index * 0.05;
              const yOffset = index * 20;

              return (
                <div
                  key={track.id}
                  className="absolute w-full max-w-4xl select-none"
                  style={{
                    zIndex,
                    transform: isTop && isDragging
                      ? `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`
                      : `scale(${scale}) translateY(${yOffset}px)`,
                    transition: isDragging && isTop ? 'none' : 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    opacity: index > 2 ? 0 : 1 - index * 0.2,
                    pointerEvents: isTop ? 'auto' : 'none',
                    cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  }}
                  onMouseDown={isTop ? handleDragStart : undefined}
                  onMouseMove={isTop ? handleDragMove : undefined}
                  onMouseUp={isTop ? handleDragEnd : undefined}
                  onMouseLeave={isTop ? handleDragEnd : undefined}
                  onTouchStart={isTop ? handleDragStart : undefined}
                  onTouchMove={isTop ? handleDragMove : undefined}
                  onTouchEnd={isTop ? handleDragEnd : undefined}
                  onClick={isTop ? handleCardClick : undefined}
                >
                  <FeatureCard
                    title={t(`tracks.${track.trackKey}.title`)}
                    description={t(`tracks.${track.trackKey}.description`)}
                    image={track.image}
                    variant={track.variant}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Instruction Text */}
        {/* <p className="text-center text-gray-tertiary text-sm md:text-base">
          {isDesktop ? (
            <>🖱️ Drag the carousel or use arrows to explore! (Auto-plays every 3 seconds)</>
          ) : (
            <>👆 Click or swipe the card to see the next one!</>
          )}
        </p> */}
      </div>
    </section>
  );
}

export default HomepageNgenRoadmapSection;