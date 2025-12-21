'use client';

import { useTranslations } from 'next-intl';
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useRTL } from '@/lib/useRTL';

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const isRTL = useRTL();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Map NextAuth errors to user-friendly messages
        const errorMessages: Record<string, string> = {
          'Please enter email and password': t('errors.emptyFields'),
          'No user found with this email': t('errors.userNotFound'),
          'Invalid password': t('errors.invalidPassword'),
          'Please verify your email before logging in': t('errors.emailNotVerified'),
          'Please use your social login method': t('errors.useSocialLogin'),
          'Your account has been suspended': t('errors.accountSuspended'),
        };
        setError(errorMessages[result.error] || result.error);
      } else {
        // Successful login - check for stored return URL, otherwise go to home
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl) {
          sessionStorage.removeItem('returnUrl');
          // Ensure the URL includes locale if it doesn't already
          const redirectPath = returnUrl.startsWith(`/${locale}`)
            ? returnUrl
            : `/${locale}${returnUrl}`;
          router.push(redirectPath);
        } else {
          router.push(`/${locale}`);
        }
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('errors.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto space-y-3"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-red-600 text-sm text-center">
          {error}
        </div>
      )}

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
          disabled={isLoading}
          className={`w-full h-[50px] px-3.5 text-sm rounded-[14px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'
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
          disabled={isLoading}
          className={`w-full h-[50px] px-3.5 text-sm ${isRTL ? 'pl-10' : 'pr-10'
            } rounded-[14px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'
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
          disabled={isLoading}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div
        className={`flex items-center justify-between text-xs sm:text-sm pt-0.5 ${isRTL ? 'flex-row-reverse' : ''
          }`}
      >
        <label
          htmlFor="remember-me"
          className={`flex items-center gap-2 cursor-pointer ${isRTL ? 'flex-row-reverse' : ''
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
            disabled={isLoading}
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
          disabled={isLoading}
          className="w-full h-[45px] rounded-[14px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {isLoading ? '...' : t('login')}
        </button>
        {isLoading && (
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
    </form>
  );
}

