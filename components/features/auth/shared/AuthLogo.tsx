'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';

export function AuthLogo() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const t = useTranslations('auth.common');
  const isRTL = useRTL();

  const handleLogoClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    router.push(`/${locale}`);
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLogoClick}
        className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 rounded-lg"
        aria-label={t('goHome')}
      >
        <Image
          src="/assets/images/logos/ngen-logo.svg"
          alt="NGen Schools"
          width={225}
          height={62}
          priority
        />
      </button>

      {/* Confirmation Dialog Overlay */}
      {showConfirmDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleCancel}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-pumpkin/10 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-pumpkin" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>

            {/* Dialog Title */}
            <h2 className="text-purple-dark font-bold text-xl md:text-2xl text-center mb-3">
              {t('leaveConfirm.title')}
            </h2>

            {/* Dialog Message */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              {t('leaveConfirm.message')}
            </p>

            {/* Action Buttons */}
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                {t('leaveConfirm.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-xl bg-pumpkin text-white font-semibold hover:bg-pumpkin/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60"
              >
                {t('leaveConfirm.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



