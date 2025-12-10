'use client';

import { useTranslations } from 'next-intl';
import { useState, ChangeEvent, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRTL } from '@/lib/useRTL';

interface SignupFormProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export function SignupForm({ action, locale }: SignupFormProps) {
  const t = useTranslations('auth.signup');
  const router = useRouter();
  const isRTL = useRTL();
  
  // Controlled inputs for UI state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Client-side validation: Check if passwords match
  const passwordsMatch = password === confirmPassword;
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (formData: FormData) => {
    // Client-side validation before submission
    if (!passwordsMatch) {
      console.error('Passwords do not match');
      return;
    }
    
    startTransition(async () => {
      const result = await action(formData);
      
      if (result.ok) {
        console.log('Signup successful!');
        // Redirect to verify email page with email
        router.push(`/${locale}/auth/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        console.error('Signup failed');
        // TODO: Show error message to user
      }
    });
  };

  const handleSocialSignup = (provider: 'google' | 'apple' | 'facebook') => {
    // TODO: Implement OAuth flow
    console.log(`Signup with ${provider}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form action={handleSubmit} className="w-full max-w-[641px] mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* First Name & Last Name Row */}
      <div className={`flex gap-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1">
          <label htmlFor="firstName" className="sr-only">
            {t('firstName')}
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            placeholder={t('firstName')}
            disabled={isPending}
            className={`w-full h-[60px] px-4 rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="lastName" className="sr-only">
            {t('lastName')}
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            placeholder={t('lastName')}
            disabled={isPending}
            className={`w-full h-[60px] px-4 rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Password & Confirm Password Row */}
      <div className={`flex gap-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Password Input */}
        <div className="relative flex-1">
          <label htmlFor="password" className="sr-only">
            {t('password')}
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            dir="ltr"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder={t('password')}
            disabled={isPending}
            className={`w-full h-[60px] px-4 ${isRTL ? 'pl-12' : 'pr-12'} rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
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
              width={28}
              height={20}
            />
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative flex-1">
          <label htmlFor="confirmPassword" className="sr-only">
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            dir="ltr"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder={t('confirmPassword')}
            disabled={isPending}
            aria-invalid={showPasswordError}
            aria-describedby={showPasswordError ? 'password-error' : undefined}
            className={`w-full h-[60px] px-4 ${isRTL ? 'pl-12' : 'pr-12'} rounded-[16px] bg-gray-100 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'} ${
              showPasswordError 
                ? 'border-2 border-red-500 focus-visible:ring-red-500/60' 
                : 'border border-gray-200 focus-visible:ring-pumpkin/60'
            }`}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleConfirmPasswordVisibility();
              }
            }}
            disabled={isPending}
            aria-pressed={showConfirmPassword}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Image
              src="/assets/auth/eye.svg"
              alt=""
              width={28}
              height={20}
            />
          </button>
        </div>
      </div>
      
      {/* Password Match Error Message */}
      {showPasswordError && (
        <div 
          id="password-error" 
          role="alert" 
          className={`text-red-500 text-sm -mt-3 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <span aria-hidden="true">⚠️</span>
          <span>{t('passwordMismatch')}</span>
        </div>
      )}

      {/* Phone Number & Country Row */}
      <div className={`flex gap-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex-1">
          <label htmlFor="phoneNumber" className="sr-only">
            {t('phoneNumber')}
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            required
            dir="ltr"
            value={phoneNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            placeholder={t('phoneNumber')}
            disabled={isPending}
            className={`w-full h-[60px] px-4 rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="country" className="sr-only">
            {t('country')}
          </label>
          <input
            id="country"
            name="country"
            type="text"
            autoComplete="country-name"
            required
            value={country}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
            placeholder={t('country')}
            disabled={isPending}
            className={`w-full h-[60px] px-4 rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

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
          className={`w-full h-[60px] px-4 rounded-[16px] bg-gray-100 border border-gray-200 placeholder:text-gray-500 text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-pumpkin/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
        />
      </div>

      {/* Buttons Row */}
      <div className={`flex gap-[23px] pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          type="submit"
          disabled={isPending || !passwordsMatch}
          className="flex-1 h-[48px] rounded-[16px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {isPending ? '...' : t('createAccount')}
        </button>
        <Link
          href={`/${locale}/auth/login`}
          className="flex-1 flex items-center justify-center h-[48px] rounded-[16px] bg-transparent border border-pumpkin text-pumpkin hover:bg-pumpkin hover:text-white font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-2 outline-none"
        >
          {t('login')}
        </Link>
      </div>
      
      {isPending && (
        <div className="text-center">
          <span role="status" className="text-xs text-gray-600">
            {t('creatingAccount')}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center py-5">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-xs sm:text-sm text-gray-600">
          {t('or')}
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social Signup */}
      <div className="flex items-center justify-center gap-[25px]">
        <button
          type="button"
          onClick={() => handleSocialSignup('google')}
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
          onClick={() => handleSocialSignup('apple')}
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
          onClick={() => handleSocialSignup('facebook')}
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

