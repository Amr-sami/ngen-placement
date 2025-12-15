'use client';

import React from 'react';
import Image from 'next/image';

// Components
import { H2 } from '@/components/general/Heading';
import TracksBelts from '@/components/general/TracksBelts';
import { StageInfo } from './StageInfo';
import { BeltSelector } from './BeltSelector';
import { LearnModal } from './LearnModal';

// Config
import { JOURNEY_STAGES } from '@/config/journey';

// Hook
import { useJourney } from './useJourny';

function JourneySection() {
  const {
    activeTrack,
    setActiveTrack,
    activeStageId,
    setActiveStageId,
    showOutcomesModal,
    setShowOutcomesModal,
    safeText,
    getStageContent,
    learningItems,
    t,
  } = useJourney();

  const activeStage = JOURNEY_STAGES.find((s) => s.id === activeStageId);

  return (
    <section id="journey-section" className="py-10 lg:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-5 flex flex-col gap-8 lg:gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2 items-center">
          <H2>{safeText('title')}</H2>
          <p className="text-gray-600 text-lg">{safeText('subtitle')}</p>
        </div>

        {/* Tracks Selector */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <TracksBelts activeTrack={activeTrack} onSelectTrack={setActiveTrack} />
        </div>

        {/* Two-column layout: Map + Belt Info */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left: Journey Map */}
          <div className="w-full lg:w-1/2">
            <Image
              src="/assets/images/journey-map.svg"
              alt="NGen Journey Map"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>

          {/* Right: Belt Info */}
          <div className="w-full lg:w-1/2 flex items-center justify-center min-h-[300px]">
            {activeStage && (
              <StageInfo
                activeStageId={activeStageId}
                activeTrack={activeTrack}
                safeText={safeText}
                getStageContent={getStageContent}
                onShowLearn={() => setShowOutcomesModal(true)}
                learnCtaText={t('learnCta')}
              />
            )}
          </div>
        </div>

        {/* Belt Selector */}
        <BeltSelector
          activeStageId={activeStageId}
          onStageClick={setActiveStageId}
          safeText={safeText}
        />
      </div>

      {/* Learn Modal */}
      <LearnModal
        isOpen={showOutcomesModal}
        onClose={() => setShowOutcomesModal(false)}
        activeStageId={activeStageId}
        learningItems={learningItems}
        safeText={safeText}
        learnCtaText={t('learnCta')}
      />

      {/* CSS Animations */}
      <style jsx>{`
        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </section>
  );
}

export default JourneySection;