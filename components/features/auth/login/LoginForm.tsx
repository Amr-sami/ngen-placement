'use client';

import { useTranslations } from 'next-intl';
import { useState, ChangeEvent, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRTL } from '@/lib/useRTL';

interface LoginFormProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export function LoginForm({ action, locale }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const isRTL = useRTL();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await action(formData);

      if (result.ok) {
        console.log('Login successful!');
        // TODO: redirect after login
      } else {
        console.error('Login failed');
        // TODO: show error message
      }
    });
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    console.log(`Login with ${provider}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      action={handleSubmit}
      className="w-full mx-auto space-y-3"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="sr-only">
          {t('email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder={t('email')}
          disabled={isPending}
          className={`w-full h-[50px] px-3.5 text-sm rounded-[14px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <label htmlFor="password" className="sr-only">
          {t('password')}
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          dir="ltr"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder={t('password')}
          disabled={isPending}
          className={`w-full h-[50px] px-3.5 text-sm ${
            isRTL ? 'pl-10' : 'pr-10'
          } rounded-[14px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              togglePasswordVisibility();
            }
          }}
          disabled={isPending}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div
        className={`flex items-center justify-between text-xs sm:text-sm pt-0.5 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <label
          htmlFor="remember-me"
          className={`flex items-center gap-2 cursor-pointer ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRememberMe(e.target.checked)
            }
            disabled={isPending}
            className="w-4 h-4 rounded border-gray-300 text-pumpkin focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-pumpkin"
          />
          <span className="text-gray-600 select-none">{t('rememberMe')}</span>
        </label>
        <Link
          href={`/${locale}/auth/forget-password`}
          className="text-gray-600 hover:text-pumpkin transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
        >
          {t('forgotPassword')}
        </Link>
      </div>

      {/* Login Button */}
      <div className="flex flex-col items-center gap-1 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-[45px] rounded-[14px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {isPending ? '...' : t('login')}
        </button>
        {isPending && (
          <span role="status" className="text-[11px] text-gray-600">
            {t('loggingIn')}
          </span>
        )}
      </div>

      {/* Sign Up Button */}
      <div className="flex justify-center pt-1">
        <Link
          href={`/${locale}/auth/signup`}
          className="flex items-center justify-center w-full h-[45px] rounded-[14px] bg-transparent border border-pumpkin text-pumpkin hover:bg-pumpkin hover:text-white font-bold text-sm transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {t('signup')}
        </Link>
      </div>

      {/* Divider */}
      <div className="relative flex items-center my-3">
        <div className="flex-1 border-t border-gray-300" />
        <span className="px-2.5 text-[11px] text-gray-600">{t('or')}</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      {/* Social Login */}
      <div className="flex items-center justify-center gap-4 pb-1">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={isPending}
          aria-label={t('with.google')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/assets/auth/google.svg" alt="" width={40} height={40} />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('apple')}
          disabled={isPending}
          aria-label={t('with.apple')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/assets/auth/apple.svg" alt="" width={40} height={40} />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isPending}
          aria-label={t('with.facebook')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src="/assets/auth/facebook.svg" alt="" width={40} height={40} />
        </button>
      </div>
    </form>
  );
}
