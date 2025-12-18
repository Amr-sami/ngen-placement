'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AuthLogo } from '../shared/AuthLogo';
import { useRTL } from '@/lib/useRTL';

interface VerifyEmailCardProps {
  email?: string;
  locale: string;
  isSuccess?: boolean;
  errorType?: string;
}

export function VerifyEmailCard({ email, locale, isSuccess, errorType }: VerifyEmailCardProps) {
  const t = useTranslations('auth.verifyEmail');
  const isRTL = useRTL();

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (!email) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        setResendError(result.error || 'Failed to resend email');
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      console.error('Resend error:', err);
      setResendError('An unexpected error occurred');
    } finally {
      setIsResending(false);
    }
  };

  // Get error message based on error type
  const getErrorMessage = () => {
    switch (errorType) {
      case 'invalid_token':
        return 'The verification link is invalid. Please request a new one.';
      case 'expired_token':
        return 'The verification link has expired. Please request a new one.';
      case 'user_not_found':
        return 'User not found. Please try signing up again.';
      case 'server_error':
        return 'An error occurred. Please try again later.';
      case 'missing_params':
        return 'Invalid verification link.';
      default:
        return errorType || 'An error occurred during verification.';
    }
  };

  return (
    <div className="w-full flex flex-col items-center" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Logo */}
      <div className="mb-12">
        <AuthLogo />
      </div>

      {/* Main Container Rectangle */}
      <div
        className="w-full max-w-[887px] rounded-[60px] flex flex-col items-center justify-center py-16 px-8 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          minHeight: '500px'
        }}
      >
        {/* Inner Group Container - Vertical Flow */}
        <div className="flex flex-col items-center text-center gap-6 w-full max-w-[528px]">

          {/* Success State */}
          {isSuccess && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
                Email Verified!
              </h1>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Your email has been verified successfully. You can now log in to your account.
              </p>
              <Link
                href={`/${locale}/auth/login`}
                className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all w-full max-w-[528px] h-[55px] rounded-[16px] flex items-center justify-center text-base"
              >
                Go to Login
              </Link>
            </>
          )}

          {/* Error State */}
          {errorType && !isSuccess && (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
                Verification Failed
              </h1>
              <p className="text-red-600 text-base md:text-lg leading-relaxed">
                {getErrorMessage()}
              </p>
              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all w-full max-w-[528px] h-[55px] rounded-[16px] flex items-center justify-center text-base disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              )}
              <Link
                href={`/${locale}/auth/login`}
                className="text-pumpkin hover:text-pumpkin/80 font-medium underline"
              >
                Back to Login
              </Link>
            </>
          )}

          {/* Pending Verification State (just registered) */}
          {!isSuccess && !errorType && (
            <>
              <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
                {t('title')}
              </h1>

              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                {t('description')}
              </p>

              {email && (
                <p className="text-gray-800 font-medium">
                  Email sent to: <span className="text-pumpkin">{email}</span>
                </p>
              )}

              {/* Resend Button */}
              <div className="flex flex-col items-center gap-3 w-full">
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || resendSuccess}
                  className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all w-full max-w-[528px] h-[55px] rounded-[16px] flex items-center justify-center text-base disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : resendSuccess ? 'Email Sent!' : 'Resend Verification Email'}
                </button>

                {resendSuccess && (
                  <span className="text-green-600 text-sm">
                    ✓ A new verification email has been sent to your inbox.
                  </span>
                )}

                {resendError && (
                  <span className="text-red-600 text-sm">
                    {resendError}
                  </span>
                )}
              </div>

              {/* Security Notice Frame */}
              <div
                className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{
                  width: '528px',
                  maxWidth: '100%',
                  minHeight: '88px',
                  gap: '10px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 204, 0, 0.13)',
                  border: '1px solid #F9D158',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Shield Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    marginRight: isRTL ? '0' : '12px',
                    marginLeft: isRTL ? '12px' : '0',
                    marginTop: '2px',
                  }}
                >
                  <Image
                    src="/assets/auth/email-icon.svg"
                    alt=""
                    width={26}
                    height={26}
                    style={{
                      opacity: 1,
                    }}
                  />
                </div>

                {/* Security Text */}
                <div
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    lineHeight: '24px',
                    textAlign: isRTL ? 'right' : 'left',
                    color: '#B77C50',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {t('securityNotice.title')}
                  </span>
                  <span style={{ fontWeight: 400 }}>
                    {' '}{t('securityNotice.message')}
                  </span>
                </div>
              </div>

              {/* Back to Login Link */}
              <Link
                href={`/${locale}/auth/login`}
                className="text-pumpkin hover:text-pumpkin/80 font-medium underline"
              >
                Back to Login
              </Link>
            </>
          )}

          {/* Divider Line */}
          <div
            style={{
              width: '496px',
              maxWidth: '100%',
              height: '0px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              marginTop: '8px',
              marginBottom: '8px'
            }}
          />

          {/* Footer - All Rights Reserved (Inside Container) */}
          <footer
            style={{
              maxWidth: '100%',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#0C1128',
            }}
          >
            {t('footer')}
          </footer>
        </div>
      </div>
    </div>
  );
}
