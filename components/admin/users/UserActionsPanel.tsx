'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, UserCheck, Ban, Trash2, RefreshCw, Mail } from 'lucide-react';
import { updateUserStatus, grantExtraAttempt, verifyUserEmail } from '@/lib/actions/admin/userActions';
import ResetUserPassword from './ResetUserPassword';

interface UserActionsPanelProps {
    user: {
        id: string;
        email: string;
        status: string;
        emailVerified?: boolean;
        placementTest?: {
            allowedAttempts: number;
            attemptsUsed: number;
            extraAttemptsGrantedBySupport?: number;
        } | null;
    };
}

export default function UserActionsPanel({ user }: UserActionsPanelProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleGrantAttempt = async () => {
        setIsLoading('grant');
        try {
            const result = await grantExtraAttempt(user.id, 1);
            router.refresh();
            alert(`Success! New total attempts: ${result.newTotalAttempts}`);
        } catch (error) {
            console.error('Failed to grant attempt:', error);
            alert('Failed to grant extra attempt');
        } finally {
            setIsLoading(null);
        }
    };

    const handleStatusChange = async (status: 'active' | 'pending' | 'suspended' | 'deleted') => {
        setIsLoading(status);
        try {
            await updateUserStatus(user.id, status);
            router.refresh();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update user status');
        } finally {
            setIsLoading(null);
        }
    };

    const handleVerifyEmail = async () => {
        setIsLoading('verify');
        try {
            await verifyUserEmail(user.id);
            router.refresh();
            alert('Email verified successfully!');
        } catch (error) {
            console.error('Failed to verify email:', error);
            alert(error instanceof Error ? error.message : 'Failed to verify email');
        } finally {
            setIsLoading(null);
        }
    };

    const totalAttempts = (user.placementTest?.allowedAttempts || 1) + (user.placementTest?.extraAttemptsGrantedBySupport || 0);
    const remainingAttempts = totalAttempts - (user.placementTest?.attemptsUsed || 0);

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>

            {/* Placement Test Actions */}
            <div className="space-y-3">
                <p className="text-sm text-gray-400">Placement Test</p>
                <div className="text-sm text-gray-300 mb-2">
                    Remaining attempts: <span className="text-white font-medium">{remainingAttempts}</span>
                </div>
                <button
                    onClick={handleGrantAttempt}
                    disabled={isLoading !== null}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors"
                >
                    {isLoading === 'grant' ? (
                        <RefreshCw size={16} className="animate-spin" />
                    ) : (
                        <Plus size={16} />
                    )}
                    <span>Grant Extra Attempt</span>
                </button>
            </div>

            {/* Status Actions */}
            <div className="space-y-3">
                <p className="text-sm text-gray-400">Account Status</p>

                {user.status !== 'active' && (
                    <button
                        onClick={() => handleStatusChange('active')}
                        disabled={isLoading !== null}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
                    >
                        {isLoading === 'active' ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <UserCheck size={16} />
                        )}
                        <span>Activate Account</span>
                    </button>
                )}

                {user.status !== 'suspended' && (
                    <button
                        onClick={() => handleStatusChange('suspended')}
                        disabled={isLoading !== null}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 text-white rounded-lg transition-colors"
                    >
                        {isLoading === 'suspended' ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <Ban size={16} />
                        )}
                        <span>Suspend Account</span>
                    </button>
                )}

                {user.status !== 'deleted' && (
                    <button
                        onClick={() => handleStatusChange('deleted')}
                        disabled={isLoading !== null}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-colors"
                    >
                        {isLoading === 'deleted' ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                        <span>Delete Account</span>
                    </button>
                )}
            </div>

            {/* Password Reset */}
            <div className="space-y-3">
                <p className="text-sm text-gray-400">Security</p>

                {/* Manual Email Verification */}
                {!user.emailVerified && (
                    <button
                        onClick={handleVerifyEmail}
                        disabled={isLoading !== null}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
                    >
                        {isLoading === 'verify' ? (
                            <RefreshCw size={16} className="animate-spin" />
                        ) : (
                            <Mail size={16} />
                        )}
                        <span>Verify Email Manually</span>
                    </button>
                )}

                {user.emailVerified && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-green-600/20 text-green-400 rounded-lg">
                        <Mail size={16} />
                        <span>Email Verified</span>
                    </div>
                )}

                <ResetUserPassword userId={user.id} userEmail={user.email} />
            </div>
        </div>
    );
}
