'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { OTPForm } from './OTPForm';

interface OTPCardProps {
  verifyAction: (formData: FormData) => Promise<{ ok: boolean }>;
  resendAction: (formData: FormData) => Promise<{ ok: boolean }>;
  email: string;
}

export function OTPCard({ verifyAction, resendAction, email }: OTPCardProps) {
  const t = useTranslations('auth.otp');

  return (
    <div 
      className="flex flex-col items-center"
      style={{
        width: '854px',
        maxWidth: '100%',
        gap: '40px',
      }}
    >
      {/* Logo */}
      <div>
        <Image
          src="/assets/images/logos/ngen-logo.svg"
          alt="NGen Schools"
          width={225}
          height={62}
          priority
        />
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
        <div 
          className="flex flex-col items-center"
          style={{
            width: '607px',
            maxWidth: '100%',
            gap: '24px',
          }}
        >
          {/* Main Heading - Please check your Email ! */}
          <h1 
            className="text-gray-900"
            style={{
              fontWeight: 700,
              fontSize: '36px',
              lineHeight: '1.2',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            {t('title')}
          </h1>

          {/* Description Text with Email */}
          <p
            className="text-gray-600"
            style={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '32px',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
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

