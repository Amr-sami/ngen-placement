'use client';

import { useTranslations } from 'next-intl';
import { ForgetPasswordForm } from './ForgetPasswordForm';
import { AuthLogo } from '../shared/AuthLogo';
import { useRTL } from '@/hooks/useRTL';

interface ForgetPasswordCardProps {
  locale: string;
}

export function ForgetPasswordCard({ locale }: ForgetPasswordCardProps) {
  const t = useTranslations('auth.forgetPassword');
  const isRTL = useRTL();

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: '856px',
        maxWidth: '100%',
        gap: '40px',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Logo */}
      <div>
        <AuthLogo />
      </div>

      {/* Main Container Rectangle */}
      <div
        className="flex flex-col items-center justify-center backdrop-blur-sm"
        style={{
          width: '856px',
          maxWidth: '100%',
          minHeight: '500px',
          borderRadius: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 16px',
        }}
      >
        {/* Forget Password Frame - Vertical Flow */}
        <div className="flex flex-col items-center text-center gap-4 max-w-[523px]">
          {/* Main Heading - Forget Password? */}
          <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
            {t('title')}
          </h1>

          {/* Description Text */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Forget Password Form */}
        <div style={{ marginTop: '85.06px' }}>
          <ForgetPasswordForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
