'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, UserCheck, Ban, Trash2, Plus } from 'lucide-react';
import { updateUserStatus, grantExtraAttempt } from '@/lib/actions/admin/userActions';

interface UserQuickActionsProps {
    userId: string;
    currentStatus: string;
}

export default function UserQuickActions({ userId, currentStatus }: UserQuickActionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (status: 'active' | 'pending' | 'suspended' | 'deleted') => {
        setIsLoading(true);
        try {
            await updateUserStatus(userId, status);
            router.refresh();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update user status');
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    const handleGrantAttempt = async () => {
        setIsLoading(true);
        try {
            await grantExtraAttempt(userId, 1);
            router.refresh();
            alert('Extra attempt granted successfully!');
        } catch (error) {
            console.error('Failed to grant attempt:', error);
            alert('Failed to grant extra attempt');
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isLoading}
            >
                <MoreVertical size={16} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
                        <div className="py-1">
                            {/* Grant Attempt */}
                            <button
                                onClick={handleGrantAttempt}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-400 hover:bg-gray-700 transition-colors"
                                disabled={isLoading}
                            >
                                <Plus size={14} />
                                Grant Test Attempt
                            </button>

                            <div className="border-t border-gray-700 my-1" />

                            {/* Activate */}
                            {currentStatus !== 'active' && (
                                <button
                                    onClick={() => handleStatusChange('active')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-400 hover:bg-gray-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    <UserCheck size={14} />
                                    Activate User
                                </button>
                            )}

                            {/* Suspend */}
                            {currentStatus !== 'suspended' && (
                                <button
                                    onClick={() => handleStatusChange('suspended')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Ban size={14} />
                                    Suspend User
                                </button>
                            )}

                            {/* Delete */}
                            {currentStatus !== 'deleted' && (
                                <button
                                    onClick={() => handleStatusChange('deleted')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Trash2 size={14} />
                                    Delete User
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
