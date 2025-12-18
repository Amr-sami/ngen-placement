'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';

interface ForgetPasswordFormProps {
  locale: string;
}

export function ForgetPasswordForm({ locale }: ForgetPasswordFormProps) {
  const t = useTranslations('auth.forgetPassword');
  const router = useRouter();
  const isRTL = useRTL();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to send reset email');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center" style={{ gap: '21px' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Error Message */}
      {error && (
        <div
          className="text-red-600 text-sm text-center p-3 rounded-[12px] bg-red-50 border border-red-200"
          style={{ width: '528px', maxWidth: '100%' }}
        >
          {error}
        </div>
      )}

      {/* Email Input */}
      <div style={{ width: '528px', maxWidth: '100%' }}>
        <label htmlFor="email" className="sr-only">
          {t('email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email')}
          required
          disabled={isLoading || isSubmitted}
          dir="ltr"
          autoComplete="email"
          aria-invalid={false}
          className={`w-full h-[66px] px-5 rounded-[12px] bg-gray-100 border border-gray-200 text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-pumpkin/60 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
        />
      </div>

      {/* Send Request Button */}
      <button
        type="submit"
        disabled={isLoading || isSubmitted || !email}
        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '528px',
          maxWidth: '100%',
          height: '55px',
          padding: '16px 32px',
          borderRadius: '16px',
          fontSize: '16px',
          border: 'none',
          cursor: isLoading || isSubmitted || !email ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? '...' : isSubmitted ? t('sent') : t('sendRequest')}
      </button>

      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        disabled={isLoading}
        className="border border-pumpkin text-pumpkin hover:bg-pumpkin hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '528px',
          maxWidth: '100%',
          height: '55px',
          padding: '16px 32px',
          borderRadius: '16px',
          backgroundColor: 'transparent',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {t('back')}
      </button>

      {/* Status Messages */}
      {isLoading && (
        <span role="status" style={{ fontSize: '12px', color: '#55606B', marginTop: '8px' }}>
          {t('sending')}
        </span>
      )}

      {isSubmitted && (
        <span role="status" style={{ fontSize: '12px', color: '#10B981', marginTop: '8px' }}>
          ✓ {t('successMessage')}
        </span>
      )}
    </form>
  );
}
