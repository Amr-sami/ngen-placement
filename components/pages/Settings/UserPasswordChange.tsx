'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Check, AlertCircle, Key } from 'lucide-react';
import { changeOwnPassword } from '@/lib/actions/passwordActions';

interface UserPasswordChangeProps {
    locale: string;
}

export default function UserPasswordChange({ locale }: UserPasswordChangeProps) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validate
        if (newPassword !== confirmPassword) {
            setError(locale === 'ar' ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError(locale === 'ar' ? 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await changeOwnPassword({
                currentPassword,
                newPassword,
            });
            setSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                    {locale === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <div className="relative">
                    <input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 pr-12"
                        placeholder={locale === 'ar' ? 'أدخل كلمة المرور الحالية' : 'Enter current password'}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* New Password */}
            <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                    {locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                    <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 pr-12"
                        placeholder={locale === 'ar' ? 'أدخل كلمة المرور الجديدة (8 أحرف على الأقل)' : 'Enter new password (min 8 characters)'}
                        required
                        minLength={8}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                    {locale === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder={locale === 'ar' ? 'أعد إدخال كلمة المرور الجديدة' : 'Re-enter new password'}
                    required
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                    <Check size={16} />
                    {locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!'}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
                {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <Key size={18} />
                )}
                <span>{locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</span>
            </button>
        </form>
    );
}
