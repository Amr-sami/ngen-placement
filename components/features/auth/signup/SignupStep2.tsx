'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';

interface SignupStep2Props {
  email: string;
  password: string;
  confirmPassword: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  isStep2Valid: boolean;
  isPending: boolean;
  showPasswordError: boolean;
  onBack: () => void;
}

export default function SignupStep2({
  email,
  password,
  confirmPassword,
  setEmail,
  setPassword,
  setConfirmPassword,
  isStep2Valid,
  isPending,
  showPasswordError,
  onBack,
}: SignupStep2Props) {
  const t = useTranslations('auth.signup');
  const isRTL = useRTL();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const textAlignClass = isRTL ? 'text-right' : 'text-left';
  const rowDirectionClass = isRTL ? 'flex-row-reverse' : '';
  const baseInputClasses =
    'w-full h-[50px] px-3.5 text-sm rounded-[14px] bg-gray-100 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 transition-shadow';
  const defaultBorderClasses = 'border border-gray-200';
  const passwordEyePadding = isRTL ? 'pl-10' : 'pr-10';

  const translations = {
    back: isRTL ? 'رجوع' : 'Back',
  };

  return (
    <div className="space-y-2.5">
      {/* Email Input */}
      <div>
        <input
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder={`${t('email')} *`}
          required
          dir="ltr"
          disabled={isPending}
          className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass} disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder={`${t('password')} *`}
          required
          dir="ltr"
          disabled={isPending}
          className={`${baseInputClasses} ${defaultBorderClasses} ${textAlignClass} ${passwordEyePadding} disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute ${isRTL ? 'left-3' : 'right-3'
            } top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity outline-none`}
        >
          <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
        </button>
      </div>

      {/* Password hint */}
      <p className={`text-[11px] text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('passwordHint') || 'Password must be at least 8 characters'}
      </p>

      {/* Confirm Password Input */}
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
          placeholder={`${t('confirmPassword')} *`}
          required
          dir="ltr"
          disabled={isPending}
          className={`${baseInputClasses} ${textAlignClass} ${passwordEyePadding} disabled:opacity-50 disabled:cursor-not-allowed ${showPasswordError
              ? 'border-2 border-red-500 focus-visible:ring-red-500/60'
              : `${defaultBorderClasses} focus-visible:ring-pumpkin/60`
            }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className={`absolute ${isRTL ? 'left-3' : 'right-3'
            } top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity outline-none`}
        >
          <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
        </button>
      </div>

      {showPasswordError && (
        <div
          className={`text-red-500 text-[11px] flex items-center gap-1 -mt-1 ${rowDirectionClass}`}
        >
          <span>⚠️</span>
          <span>{t('passwordMismatch')}</span>
        </div>
      )}

      {/* Buttons Row */}
      <div className={`flex gap-3.5 pt-2 ${rowDirectionClass}`}>
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex-1 h-[45px] text-sm rounded-[14px] bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {translations.back}
        </button>
        <button
          type="submit"
          disabled={isPending || !isStep2Valid}
          className="flex-1 h-[45px] text-sm rounded-[14px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none"
        >
          {isPending ? '...' : t('createAccount')}
        </button>
      </div>

      {isPending && (
        <div className="text-center">
          <span role="status" className="text-[11px] text-gray-600">
            {t('creatingAccount')}
          </span>
        </div>
      )}
    </div>
  );
}