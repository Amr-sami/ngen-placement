'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ForgetPasswordForm } from './ForgetPasswordForm';

interface ForgetPasswordCardProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
}

export function ForgetPasswordCard({ action }: ForgetPasswordCardProps) {
  const t = useTranslations('auth.forgetPassword');

  return (
    <div 
      className="flex flex-col items-center"
      style={{
        width: '856px',
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
          width: '856px',
          maxWidth: '100%',
          minHeight: '500px',
          borderRadius: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 16px',
        }}
      >
        {/* Forget Password Frame - Vertical Flow */}
        <div 
          className="flex flex-col items-center"
          style={{
            maxWidth: '100%',
            gap: '11.47px',
          }}
        >
          {/* Main Heading - Forget Password? */}
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

          {/* Description Text */}
          <p
            className="text-gray-600"
            style={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '32px',
              textAlign: 'center',
              maxWidth: '523px',
            }}
          >
            {t('description')}
          </p>
        </div>

        {/* Forget Password Form */}
        <div style={{ marginTop: '85.06px' }}>
          <ForgetPasswordForm action={action} />
        </div>
      </div>
    </div>
  );
}

