import React from 'react';
import { Sparkles } from 'lucide-react';
import { TrackKey } from '@/components/general/TracksBelts';
import { TranslationValue } from './constants';

interface StageInfoProps {
  activeStageId: string;
  activeTrack: TrackKey;
  safeText: (key: string, fallbackKey?: string) => TranslationValue;
  getStageContent: (field: string) => TranslationValue;
  onShowLearn: () => void;
  learnCtaText: string;
}

export function StageInfo({
  activeStageId,
  activeTrack,
  safeText,
  getStageContent,
  onShowLearn,
  learnCtaText,
}: StageInfoProps) {
  return (
    <div
      key={`${activeStageId}-${activeTrack}`}
      className="w-full text-purple-dark transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right-4"
    >
      {/* Title with Outcomes Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="font-protestRiot text-2xl lg:text-4xl">
            {safeText(`stages.${activeStageId}.title`)}

            {activeStageId !== 'placement-test' && (
              <span className="block text-base md:text-lg text-pumpkin mt-1 font-sans font-bold opacity-90">
                {safeText(`trackSpecific.${activeTrack}.label`)}
              </span>
            )}
          </h3>
        </div>

        {/* Learn Button - Only show for non-placement stages */}
        {activeStageId !== 'placement-test' && (
          <button
            onClick={onShowLearn}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pumpkin to-rose text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-gentle whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            {learnCtaText}
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-6 text-gray-700">
        {getStageContent('longDescription')}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm md:text-base bg-white/50 p-6 rounded-2xl border border-purple-100">
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
            {safeText('card.duration')}
          </span>
          <span className="font-bold text-purple-darker">{getStageContent('duration')}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
            {safeText('card.hours')}
          </span>
          <span className="font-bold text-purple-darker">{getStageContent('hours')}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
            {safeText('card.classes')}
          </span>
          <span className="font-bold text-purple-darker">{getStageContent('classes')}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
            {safeText('card.models')}
          </span>
          <span className="font-bold text-purple-darker">{getStageContent('models')}</span>
        </div>
      </div>

      {/* Focus Section */}
      <div className="mt-6 bg-purple-50 p-4 rounded-xl border-l-4 border-pumpkin">
        <span className="font-bold text-purple-dark block mb-1">{safeText('card.focus')}:</span>
        <span className="text-gray-700">{getStageContent('focus')}</span>
      </div>
    </div>
  );
}