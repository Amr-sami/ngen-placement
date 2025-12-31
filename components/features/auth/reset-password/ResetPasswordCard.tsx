'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AuthLogo } from '../shared/AuthLogo';
import { useRTL } from '@/hooks/useRTL';

interface ResetPasswordCardProps {
    locale: string;
    email?: string;
    token?: string;
    isSuccess?: boolean;
    errorMessage?: string;
}

export function ResetPasswordCard({ locale, email, token, isSuccess, errorMessage }: ResetPasswordCardProps) {
    const t = useTranslations('auth.resetPassword');
    const isRTL = useRTL();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(errorMessage || null);
    const [success, setSuccess] = useState(isSuccess || false);

    const passwordsMatch = password === confirmPassword;
    const showPasswordError = confirmPassword.length > 0 && !passwordsMatch;
    const isFormValid = password.length >= 8 && passwordsMatch;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !token) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, token, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to reset password');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Missing or invalid token
    if (!email || !token) {
        return (
            <div className="flex flex-col items-center" style={{ width: '856px', maxWidth: '100%', gap: '40px' }} dir={isRTL ? 'rtl' : 'ltr'}>
                <AuthLogo />
                <div
                    className="flex flex-col items-center justify-center backdrop-blur-sm"
                    style={{
                        width: '856px',
                        maxWidth: '100%',
                        minHeight: '400px',
                        borderRadius: '60px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '40px 16px',
                    }}
                >
                    <div className="text-6xl mb-6">❌</div>
                    <h1 className="text-purple-dark font-bold text-3xl md:text-4xl mb-4">
                        Invalid Reset Link
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 text-center max-w-md">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        href={`/${locale}/auth/forget-password`}
                        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all px-8 py-4 rounded-[16px] text-base"
                    >
                        Request New Reset Link
                    </Link>
                </div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="flex flex-col items-center" style={{ width: '856px', maxWidth: '100%', gap: '40px' }} dir={isRTL ? 'rtl' : 'ltr'}>
                <AuthLogo />
                <div
                    className="flex flex-col items-center justify-center backdrop-blur-sm"
                    style={{
                        width: '856px',
                        maxWidth: '100%',
                        minHeight: '400px',
                        borderRadius: '60px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '40px 16px',
                    }}
                >
                    <div className="text-6xl mb-6">✅</div>
                    <h1 className="text-purple-dark font-bold text-3xl md:text-4xl mb-4">
                        {t('successTitle') || 'Password Reset Successfully!'}
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 text-center max-w-md">
                        {t('successMessage') || 'Your password has been reset successfully. You can now log in with your new password.'}
                    </p>
                    <Link
                        href={`/${locale}/auth/login`}
                        className="bg-pumpkin hover:bg-pumpkin/90 text-white font-bold transition-all px-8 py-4 rounded-[16px] text-base"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Reset form
    return (
        <div className="flex flex-col items-center" style={{ width: '856px', maxWidth: '100%', gap: '40px' }} dir={isRTL ? 'rtl' : 'ltr'}>
            <AuthLogo />
            <div
                className="flex flex-col items-center justify-center backdrop-blur-sm"
                style={{
                    width: '856px',
                    maxWidth: '100%',
                    minHeight: '500px',
                    borderRadius: '60px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '40px 16px',
                }}
            >
                <div className="flex flex-col items-center text-center gap-4 max-w-[523px] mb-8">
                    <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
                        {t('title') || 'Reset Your Password'}
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                        {t('description') || 'Enter your new password below.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4" style={{ width: '528px', maxWidth: '100%' }}>
                    {/* Error Message */}
                    {error && (
                        <div className="w-full p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* New Password */}
                    <div className="relative w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('newPassword') || 'New Password *'}
                            required
                            disabled={isLoading}
                            dir="ltr"
                            className={`w-full h-[66px] px-5 pr-12 rounded-[12px] bg-gray-100 border border-gray-200 text-gray-900 outline-none transition-shadow focus:ring-2 focus:ring-pumpkin/60 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity`}
                        >
                            <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
                        </button>
                    </div>

                    {/* Password hint */}
                    <p className="w-full text-[11px] text-gray-500 text-left">
                        Password must be at least 8 characters
                    </p>

                    {/* Confirm Password */}
                    <div className="relative w-full">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('confirmPassword') || 'Confirm Password *'}
                            required
                            disabled={isLoading}
                            dir="ltr"
                            className={`w-full h-[66px] px-5 pr-12 rounded-[12px] bg-gray-100 text-gray-900 outline-none transition-shadow placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'} ${showPasswordError
                                ? 'border-2 border-red-500 focus:ring-red-500/60'
                                : 'border border-gray-200 focus:ring-pumpkin/60'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity`}
                        >
                            <Image src="/assets/auth/eye.svg" alt="" width={20} height={16} />
                        </button>
                    </div>

                    {showPasswordError && (
                        <div className="w-full text-red-500 text-[11px] flex items-center gap-1">
                            <span>⚠️</span>
                            <span>Passwords do not match</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full h-[55px] bg-pumpkin hover:bg-pumpkin/90 text-white font-bold rounded-[16px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : t('resetButton') || 'Reset Password'}
                    </button>

                    {/* Back to Login */}
                    <Link
                        href={`/${locale}/auth/login`}
                        className="text-pumpkin hover:text-pumpkin/80 font-medium underline"
                    >
                        Back to Login
                    </Link>
                </form>
            </div>
        </div>
    );
}
