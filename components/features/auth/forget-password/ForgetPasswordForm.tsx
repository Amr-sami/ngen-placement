'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';

interface ForgetPasswordFormProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
}

export function ForgetPasswordForm({ action }: ForgetPasswordFormProps) {
  const t = useTranslations('auth.forgetPassword');
  const router = useRouter();
  const isRTL = useRTL();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      
      const result = await action(formData);
      
      if (result.ok) {
        console.log('Password reset email sent successfully!');
        setIsSubmitted(true);
        // TODO: Show success message and optionally redirect
      } else {
        console.error('Password reset request failed');
        // TODO: Show error message to user
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center" style={{ gap: '21px' }} dir={isRTL ? 'rtl' : 'ltr'}>
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
          disabled={isPending || isSubmitted}
          dir="ltr"
          autoComplete="email"
          aria-invalid={false}
          className={`w-full h-[66px] px-5 rounded-[12px] bg-gray-100 border border-gray-200 text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-pumpkin/60 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
        />
      </div>

      {/* Send Request Button */}
      <button
        type="submit"
        disabled={isPending || isSubmitted || !email}
        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '528px',
          maxWidth: '100%',
          height: '55px',
          padding: '16px 32px',
          borderRadius: '16px',
          fontSize: '16px',
          border: 'none',
          cursor: isPending || isSubmitted || !email ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? '...' : isSubmitted ? t('sent') : t('sendRequest')}
      </button>

      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        disabled={isPending}
        className="border border-pumpkin text-pumpkin hover:bg-pumpkin hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '528px',
          maxWidth: '100%',
          height: '55px',
          padding: '16px 32px',
          borderRadius: '16px',
          backgroundColor: 'transparent',
          fontSize: '16px',
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {t('back')}
      </button>

      {/* Status Messages */}
      {isPending && (
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

