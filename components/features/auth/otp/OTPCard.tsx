'use client';

import { useTranslations } from 'next-intl';
import { OTPForm } from './OTPForm';
import { AuthLogo } from '../shared/AuthLogo';
import { useRTL } from '@/lib/useRTL';

interface OTPCardProps {
  verifyAction: (formData: FormData) => Promise<{ ok: boolean }>;
  resendAction: (formData: FormData) => Promise<{ ok: boolean }>;
  email: string;
}

export function OTPCard({ verifyAction, resendAction, email }: OTPCardProps) {
  const t = useTranslations('auth.otp');
  const isRTL = useRTL();

  return (
    <div 
      className="flex flex-col items-center"
      style={{
        width: '854px',
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
          width: '854px',
          maxWidth: '100%',
          minHeight: '500px',
          borderRadius: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 16px',
        }}
      >
        {/* Content Container */}
        <div className="flex flex-col items-center text-center gap-6 w-full max-w-[607px]">
          {/* Main Heading - Please check your Email ! */}
          <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
            {t('title')}
          </h1>

          {/* Description Text with Email */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t('description', { email })}
          </p>

          {/* OTP Form */}
          <OTPForm 
            verifyAction={verifyAction}
            resendAction={resendAction}
            email={email}
          />
        </div>
      </div>
    </div>
  );
}
