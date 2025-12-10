'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';

interface OTPFormProps {
  verifyAction: (formData: FormData) => Promise<{ ok: boolean }>;
  resendAction: (formData: FormData) => Promise<{ ok: boolean }>;
  email: string;
}

export function OTPForm({ verifyAction, resendAction, email }: OTPFormProps) {
  const t = useTranslations('auth.otp');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const isRTL = useRTL();
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(200);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otpCode);
      
      const result = await verifyAction(formData);
      
      if (result.ok) {
        console.log('OTP verified successfully!');
        setIsVerified(true);
        // Redirect to login page after successful verification
        setTimeout(() => router.push(`/${locale}/auth/login`), 1500);
      } else {
        console.error('OTP verification failed');
        // TODO: Show error message to user
      }
    });
  };

  const handleResend = () => {
    if (countdown > 0) return;

    startResendTransition(async () => {
      const formData = new FormData();
      formData.append('email', email);
      
      const result = await resendAction(formData);
      
      if (result.ok) {
        console.log('OTP resent successfully!');
        setCountdown(200);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        // TODO: Show success message to user
      } else {
        console.error('OTP resend failed');
        // TODO: Show error message to user
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 mt-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* OTP Input Group - Always LTR for number input */}
      <div 
        className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-[460px]"
        dir="ltr"
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            placeholder="-"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={isPending || isVerified}
            className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-xl bg-gray-100 border border-gray-200 text-purple-dark font-bold text-2xl sm:text-4xl text-center outline-none transition-all focus:border-pumpkin focus:ring-2 focus:ring-pumpkin/20 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={isPending || isVerified || otp.join('').length !== 6}
        className="w-full max-w-[463px] h-[55px] rounded-2xl bg-pumpkin hover:bg-pumpkin/90 text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? '...' : isVerified ? t('verified') : t('verifyButton')}
      </button>

      {/* Resend Code Text */}
      <div className="w-full max-w-[607px] text-center text-base md:text-lg">
        <span className="text-gray-600">
          {t('noCode')}
        </span>
        {' '}
        <span 
          onClick={handleResend}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && countdown === 0) handleResend();
          }}
          role="button"
          tabIndex={countdown > 0 ? -1 : 0}
          className={`${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-pumpkin cursor-pointer hover:underline'} transition-colors`}
        >
          {isResending ? t('resending') : t('resendCode', { seconds: countdown })}
        </span>
      </div>

      {/* Status Messages */}
      {isPending && (
        <span role="status" className="text-xs text-gray-600">
          {t('verifying')}
        </span>
      )}

      {isVerified && (
        <span role="status" className="text-xs text-green">
          ✓ {t('successMessage')}
        </span>
      )}
    </form>
  );
}
