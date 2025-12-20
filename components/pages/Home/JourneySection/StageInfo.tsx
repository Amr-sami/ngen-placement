import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react'; // أضفت ArrowRight لشكل الزر
import { TrackKey } from '@/components/general/TracksBelts';
import { TranslationValue } from './constants';
import { useRouter } from 'next/navigation'; // ✅ enable navigation

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

  const router = useRouter();

  // ✅ Redirect to Placement Survey (then your survey will push to /test)
  const handleStartPlacementTest = () => {
    router.push('/placement-test/survey');
  };

  const isPlacementStage = activeStageId === 'placement-test';

  return (
    <div
      key={`${activeStageId}-${activeTrack}`}
      className="w-full text-purple-dark transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-right-4"
    >
      {/* Title with Outcomes/Test Button */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="font-protestRiot text-2xl lg:text-4xl">
            {safeText(`stages.${activeStageId}.title`)}

            {!isPlacementStage && (
              <span className="block text-base md:text-lg text-pumpkin mt-1 font-sans font-bold opacity-90">
                {safeText(`trackSpecific.${activeTrack}.label`)}
              </span>
            )}
          </h3>
        </div>

        {/* Action Button: Show "Take Test" for placement, or "Learn" for others */}
        {isPlacementStage ? (
          <button
            onClick={handleStartPlacementTest}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full font-black text-sm md:text-base shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 animate-bounce-subtle whitespace-nowrap"
          >
            <Sparkles className="w-5 h-5" />
            {safeText('stages.placement-test.cta')}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
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
      <p className="text-sm md:text-base lg:text-lg leading-relaxed mb-6 text-gray-700 font-cairo">
        {getStageContent('longDescription')}
      </p>

      {/* Stats Grid - Hidden or Modified for Placement Test if needed */}
      {!isPlacementStage ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm md:text-base bg-white/50 p-6 rounded-2xl border border-purple-100">
          <div>
            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
              {safeText('card.duration')}
            </span>
            <span className="font-bold text-purple-darker">
              {getStageContent('duration')}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
              {safeText('card.hours')}
            </span>
            <span className="font-bold text-purple-darker">
              {getStageContent('hours')}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
              {safeText('card.classes')}
            </span>
            <span className="font-bold text-purple-darker">
              {getStageContent('classes')}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">
              {safeText('card.models')}
            </span>
            <span className="font-bold text-purple-darker">
              {getStageContent('models')}
            </span>
          </div>
        </div>
      ) : (
        /* عرض مميز لمرحلة تحديد المستوى بدل الـ Stats Grid */
        <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200 text-center">
          <p className="text-purple-900 font-bold mb-2">
            {safeText('stages.placement-test.ready')}
          </p>
          <p className="text-gray-600 text-sm">
            {safeText('stages.placement-test.info')}
          </p>
        </div>
      )}

      {/* Focus Section */}
      {!isPlacementStage && (
        <div className="mt-6 bg-purple-50 p-4 rounded-xl border-l-4 border-pumpkin">
          <span className="font-bold text-purple-dark block mb-1">
            {safeText('card.focus')}:
          </span>
          <span className="text-gray-700">{getStageContent('focus')}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
