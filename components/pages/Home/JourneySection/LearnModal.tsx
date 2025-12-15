import React from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import { LearnItem, LEGACY_OUTCOME_ICONS, DEFAULT_ICONS, TranslationValue } from './constants';

interface LearnModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStageId: string;
  learningItems: LearnItem[];
  safeText: (key: string, fallbackKey?: string) => TranslationValue;
  learnCtaText: string;
}

export function LearnModal({
  isOpen,
  onClose,
  activeStageId,
  learningItems,
  safeText,
  learnCtaText,
}: LearnModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="relative w-full max-w-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pumpkin to-rose text-white rounded-full mb-4">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
              <h3 className="font-black text-xl">{learnCtaText}</h3>
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>

            <p className="text-purple-900 font-bold text-2xl font-protestRiot">
              {safeText(`stages.${activeStageId}.title`)}
            </p>
          </div>

          {/* Learning Items Grid */}
          {learningItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningItems.map((item, index) => {
                const Icon =
                  (item.icon && LEGACY_OUTCOME_ICONS[item.icon]) ||
                  DEFAULT_ICONS[index % DEFAULT_ICONS.length] ||
                  Star;

                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-purple-100 hover:border-pumpkin"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'slideInUp 0.5s ease-out forwards',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pumpkin to-rose flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-black text-lg text-purple-900 mb-2 font-cairo">{item.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed font-cairo">{item.description}</p>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-pumpkin/10 to-transparent rounded-bl-3xl" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-white rounded-2xl p-6 border border-purple-100">
              <p className="text-purple-900 font-bold">قريباً هنضيف "هنتعلم إيه" للمرحلة دي ✨</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🎯</span>
              <p className="text-purple-900 font-bold font-cairo">ابدأ رحلتك دلوقتي واتعلم مهارات المستقبل!</p>
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}