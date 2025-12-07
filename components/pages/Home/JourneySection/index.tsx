'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { H2 } from '@/components/general/Heading';
import { JOURNEY_STAGES } from '@/config/journey';
import { Flag } from 'lucide-react';
import Image from 'next/image';

function JourneySection() {
  const t = useTranslations('home.journey');
  // Start with placement-test selected by default
  const [activeStageId, setActiveStageId] = useState<string>('placement-test');

  const handleStageClick = (id: string) => {
    setActiveStageId(id);
  };

  const activeStage = JOURNEY_STAGES.find(s => s.id === activeStageId);

  return (
    <section className="py-10 lg:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-5 flex flex-col gap-8 lg:gap-12">
        {/* Header */}
        <div className="text-center flex flex-col gap-2 items-center">
          <H2>{t('title')}</H2>
          <p className="text-gray-600 text-lg">{t('subtitle')}</p>
        </div>

        {/* Two-column layout: Map + Belt Info */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left: Journey Map (permanent) */}
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
              <div className="w-full text-purple-dark transition-opacity duration-300 ease-in-out animate-in fade-in">
                {/* Title */}
                <h3 className="font-protestRiot text-2xl lg:text-4xl mb-4">
                  {t(`stages.${activeStageId}.title`)}
                </h3>
                
                {/* Description */}
                <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                  {t(`stages.${activeStageId}.longDescription`)}
                </p>

                {/* Stats as simple text */}
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                  <div>
                    <span className="text-gray-500">{t('card.duration')}: </span>
                    <span className="font-semibold">{t(`stages.${activeStageId}.duration`)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('card.hours')}: </span>
                    <span className="font-semibold">{t(`stages.${activeStageId}.hours`)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('card.classes')}: </span>
                    <span className="font-semibold">{t(`stages.${activeStageId}.classes`)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('card.models')}: </span>
                    <span className="font-semibold">{t(`stages.${activeStageId}.models`)}</span>
                  </div>
                </div>

                {/* Focus */}
                <p className="mt-4 text-sm md:text-base lg:text-lg">
                  <span className="text-gray-500">{t('card.focus')}: </span>
                  <span className="font-semibold">{t(`stages.${activeStageId}.focus`)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Belt circles row */}
        <div className="relative flex items-center justify-center">
          {/* Dotted Connecting Line (Desktop) - centered through circles */}
          {/* py-4 = 16px padding + half of w-16 (32px) = 48px = top-12 */}
          <div className="hidden lg:flex absolute top-12 left-0 w-full items-center justify-between px-[calc(100%/22)] z-0">
            {JOURNEY_STAGES.slice(0, -1).map((_, idx) => (
              <div key={idx} className="flex-1 flex items-center">
                <div className="w-full border-t-4 border-dotted border-gray-300" />
              </div>
            ))}
          </div>

          <div className="flex lg:grid lg:grid-cols-11 gap-4 overflow-x-auto py-4 px-4 snap-x">
            {JOURNEY_STAGES.map((stage, idx) => (
              <button 
                key={stage.id} 
                onClick={() => handleStageClick(stage.id)}
                className="flex flex-col items-center gap-3 min-w-[100px] snap-center relative z-10 group cursor-pointer focus:outline-none"
              >
                {/* Circle/Badge */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl
                  ${stage.color} ${stage.textColor}
                  ${activeStageId === stage.id ? 'ring-4 ring-purple-default scale-110 shadow-xl' : ''}
                `}>
                  {stage.id === 'placement-test' ? (
                    <Flag className="w-8 h-8" />
                  ) : (
                    <span className="font-bold text-xl">{idx}</span>
                  )}
                </div>

                {/* Text */}
                <div className="text-center flex flex-col gap-1">
                  <h3 className={`font-bold text-sm md:text-base whitespace-nowrap transition-colors ${activeStageId === stage.id ? 'text-purple-darker' : ''}`}>
                    {t(`stages.${stage.id}.title`)}
                  </h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {t(`stages.${stage.id}.description`)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
