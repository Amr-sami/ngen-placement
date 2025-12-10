'use client';

import { useTranslations } from 'next-intl';
import { useState, ChangeEvent, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LoginFormProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export function LoginForm({ action, locale }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const isRTL = locale === 'ar';
  
  // Controlled inputs for UI state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await action(formData);
      
      if (result.ok) {
        console.log('Login successful!');
        // TODO: Handle successful login (e.g., redirect)
      } else {
        console.error('Login failed');
        // TODO: Show error message to user
      }
    });
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    // TODO: Implement OAuth flow
    console.log(`Login with ${provider}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form action={handleSubmit} className="space-y-4 w-full max-w-[528px] mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
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
          className={`w-full h-[67px] px-4 rounded-[12px] bg-white/80 border border-purple-light placeholder:text-purple-dark/50 text-purple-dark outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
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
          className={`w-full h-[67px] px-4 ${isRTL ? 'pl-12' : 'pr-12'} rounded-[12px] bg-white/80 border border-purple-light placeholder:text-purple-dark/50 text-purple-dark outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
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
          className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Image
            src="/assets/auth/eye.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className={`flex items-center justify-between text-xs sm:text-sm pt-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <label htmlFor="remember-me" className={`flex items-center gap-2 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
            disabled={isPending}
            className="w-4 h-4 rounded border-purple-light text-pumpkin focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-pumpkin"
          />
          <span className="text-purple-dark/80 select-none">
            {t('rememberMe')}
          </span>
        </label>
        <Link
          href={`/${locale}/auth/forget-password`}
          className="text-purple-dark/80 hover:text-pumpkin transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
        >
          {t('forgotPassword')}
        </Link>
      </div>

      {/* Login Button */}
      <div className="flex flex-col items-center gap-2 pt-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-[326px] h-[55px] rounded-[16px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {isPending ? '...' : t('login')}
        </button>
        {isPending && (
          <span role="status" className="text-xs text-purple-dark/60">
            {isRTL ? 'جاري تسجيل الدخول...' : 'Logging in...'}
          </span>
        )}
      </div>

      {/* Sign Up Button */}
      <div className="flex justify-center pt-3">
        <Link
          href={`/${locale}/auth/signup`}
          className="flex items-center justify-center w-full md:w-[326px] h-[55px] rounded-[16px] bg-transparent border border-pumpkin text-pumpkin hover:bg-pumpkin hover:text-white font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {t('signup')}
        </Link>
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-5">
        <div className="flex-1 border-t border-purple-light"></div>
        <span className="px-3 text-xs sm:text-sm text-purple-dark/60">
          {t('or')}
        </span>
        <div className="flex-1 border-t border-purple-light"></div>
      </div>

      {/* Social Login */}
      <div className="flex items-center justify-center gap-[25px]">
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={isPending}
          aria-label={t('with.google')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/assets/auth/google.svg"
            alt=""
            width={48}
            height={48}
          />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('apple')}
          disabled={isPending}
          aria-label={t('with.apple')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/assets/auth/apple.svg"
            alt=""
            width={48}
            height={48}
          />
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isPending}
          aria-label={t('with.facebook')}
          className="hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/assets/auth/facebook.svg"
            alt=""
            width={48}
            height={48}
          />
        </button>
      </div>
    </form>
  );
}

