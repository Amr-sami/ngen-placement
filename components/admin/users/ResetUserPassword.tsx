'use client';

import { useState } from 'react';
import { Eye, EyeOff, RefreshCw, Check, Key } from 'lucide-react';
import { adminResetUserPassword } from '@/lib/actions/passwordActions';
import { useRouter } from 'next/navigation';

interface ResetUserPasswordProps {
    userId: string;
    userEmail: string;
}

export default function ResetUserPassword({ userId, userEmail }: ResetUserPasswordProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await adminResetUserPassword(userId, newPassword);
            setSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
            router.refresh();
            // Close after success
            setTimeout(() => {
                setIsOpen(false);
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(password);
        setConfirmPassword(password);
        setShowPassword(true);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
                <Key size={16} />
                <span>Reset Password</span>
            </button>
        );
    }

    return (
        <div className="border border-orange-500/30 rounded-lg p-4 bg-orange-500/10">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                    <Key size={16} className="text-orange-400" />
                    Reset Password
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white text-sm"
                >
                    Cancel
                </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
                Set a new password for <span className="text-white">{userEmail}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                {/* New Password */}
                <div>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 pr-10 text-sm"
                            placeholder="New password (min 8 characters)"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                {/* Generate Password Button */}
                <button
                    type="button"
                    onClick={generatePassword}
                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                    Generate secure password
                </button>

                {/* Error Message */}
                {error && (
                    <div className="p-2 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-2 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-xs flex items-center gap-2">
                        <Check size={14} />
                        Password reset successfully!
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg transition-colors text-sm"
                >
                    {isLoading && <RefreshCw size={14} className="animate-spin" />}
                    <span>Reset Password</span>
                </button>
            </form>
        </div>
    );
}
