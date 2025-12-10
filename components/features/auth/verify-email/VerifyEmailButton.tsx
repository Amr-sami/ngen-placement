'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface VerifyEmailButtonProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  email?: string;
  locale: string;
}

export function VerifyEmailButton({ action, email, locale }: VerifyEmailButtonProps) {
  const t = useTranslations('auth.verifyEmail');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    startTransition(async () => {
      const formData = new FormData();
      if (email) {
        formData.append('email', email);
      }
      
      const result = await action(formData);
      
      if (result.ok) {
        console.log('Email verified successfully!');
        setIsVerified(true);
        // Redirect to OTP verification page
        router.push(`/${locale}/auth/otp?email=${encodeURIComponent(email || '')}`);
      } else {
        console.error('Email verification failed');
        // TODO: Show error message to user
      }
    });
  };

  return (
    <div className="flex flex-col items-center" style={{ gap: '12px', width: '528px', maxWidth: '100%' }}>
      <button
        type="button"
        onClick={handleVerify}
        disabled={isPending || isVerified}
        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '528px',
          maxWidth: '100%',
          height: '55px',
          gap: '10px',
          padding: '16px 32px',
          borderRadius: '16px',
          fontSize: '16px',
          border: 'none',
          cursor: isPending || isVerified ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? '...' : isVerified ? t('verified') : t('verifyButton')}
      </button>
      
      {isPending && (
        <span role="status" style={{ fontSize: '12px', color: '#55606B' }}>
          {t('verifying')}
        </span>
      )}

      {isVerified && (
        <span role="status" style={{ fontSize: '12px', color: '#10B981' }}>
          ✓ {t('successMessage')}
        </span>
      )}
    </div>
  );
}

