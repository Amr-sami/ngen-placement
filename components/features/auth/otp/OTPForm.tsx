'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';

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
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(200);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Add CSS for placeholder styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .otp-input::placeholder {
        font-family: 'Roboto', Arial, sans-serif;
        font-weight: 700;
        font-size: 40px;
        line-height: 26px;
        color: rgba(204, 207, 211, 0.5);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    <form onSubmit={handleSubmit} className="flex flex-col items-center" style={{ gap: '24px', marginTop: '16px' }}>
      {/* OTP Input Group */}
      <div 
        className="flex items-center justify-center"
        style={{
          width: '460px',
          maxWidth: '100%',
          height: '60px',
          gap: '20px',
        }}
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
            className="otp-input"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={isPending || isVerified}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '13px',
              border: '1px solid rgba(204, 207, 211, 0.5)',
              backgroundColor: 'rgba(204, 207, 211, 0.5)',
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '40px',
              lineHeight: '26px',
              textAlign: 'center',
              color: '#0C1128',
              outline: 'none',
              caretColor: '#ff7723',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid #ff7723';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 119, 35, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid rgba(204, 207, 211, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={isPending || isVerified || otp.join('').length !== 6}
        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          width: '463px',
          maxWidth: '100%',
          height: '55px',
          padding: '16px 32px',
          borderRadius: '16px',
          fontSize: '16px',
          border: 'none',
          cursor: isPending || isVerified || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? '...' : isVerified ? t('verified') : t('verifyButton')}
      </button>

      {/* Resend Code Text */}
      <div
        style={{
          width: '607px',
          maxWidth: '100%',
          height: '26px',
          fontSize: '20px',
          lineHeight: '26px',
          textAlign: 'center',
          textTransform: 'capitalize',
        }}
      >
        <span style={{ fontWeight: 400, color: '#0C1128' }}>
          {t('noCode')}
        </span>
        {' '}
        <span 
          onClick={handleResend}
          style={{ 
            fontWeight: 400, 
            color: countdown > 0 ? '#9CA3AF' : '#ff7723',
            cursor: countdown > 0 || isResending ? 'not-allowed' : 'pointer',
            textDecoration: countdown === 0 && !isResending ? 'underline' : 'none',
          }}
        >
          {isResending ? t('resending') : t('resendCode', { seconds: countdown })}
        </span>
      </div>

      {/* Status Messages */}
      {isPending && (
        <span role="status" style={{ fontSize: '12px', color: '#55606B', marginTop: '8px' }}>
          {t('verifying')}
        </span>
      )}

      {isVerified && (
        <span role="status" style={{ fontSize: '12px', color: '#10B981', marginTop: '8px' }}>
          ✓ {t('successMessage')}
        </span>
      )}
    </form>
  );
}

