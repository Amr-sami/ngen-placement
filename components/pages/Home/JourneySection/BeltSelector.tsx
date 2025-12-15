import React from 'react';
import { Flag } from 'lucide-react';
import { JOURNEY_STAGES } from '@/config/journey';
import { TranslationValue } from './constants';

interface BeltSelectorProps {
  activeStageId: string;
  onStageClick: (id: string) => void;
  safeText: (key: string, fallbackKey?: string) => TranslationValue;
}

export function BeltSelector({ activeStageId, onStageClick, safeText }: BeltSelectorProps) {
  return (
    <div className="relative flex items-center justify-center mt-8">
      {/* Dotted line connecting belts */}
      <div className="hidden lg:flex absolute top-12 left-0 w-full items-center justify-between px-[calc(100%/22)] z-0">
        {JOURNEY_STAGES.slice(0, -1).map((_, idx) => (
          <div key={idx} className="flex-1 flex items-center">
            <div className="w-full border-t-4 border-dotted border-gray-300" />
          </div>
        ))}
      </div>

      {/* Belt buttons */}
      <div className="flex lg:grid lg:grid-cols-11 gap-4 overflow-x-auto py-4 px-4 snap-x no-scrollbar w-full">
        {JOURNEY_STAGES.map((stage, idx) => (
          <button
            key={stage.id}
            onClick={() => onStageClick(stage.id)}
            className="flex flex-col items-center gap-3 min-w-[100px] snap-center relative z-10 group cursor-pointer focus:outline-none"
          >
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl
                ${stage.color} ${stage.textColor}
                ${activeStageId === stage.id ? 'ring-4 ring-purple-default scale-110 shadow-xl' : 'ring-2 ring-transparent'}
              `}
            >
              {stage.id === 'placement-test' ? (
                <Flag className="w-8 h-8" />
              ) : (
                <span className="font-bold text-xl">{idx}</span>
              )}
            </div>

            <div className="text-center flex flex-col gap-1">
              <h3
                className={`font-bold text-sm md:text-base whitespace-nowrap transition-colors ${
                  activeStageId === stage.id ? 'text-purple-darker' : ''
                }`}
              >
                {safeText(`stages.${stage.id}.title`)}
              </h3>
              <p className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap px-2 py-1 bg-white/80 rounded-full">
                {safeText(`stages.${stage.id}.description`)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}