import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserStatus, grantExtraAttempt, verifyUserEmail } from '@/lib/actions/admin/userActions';

type ActionKey = string;

export function useUserActions(userId: string) {
    const [isLoading, setIsLoading] = useState<ActionKey | null>(null);
    const router = useRouter();

    const executeAction = async (
        key: ActionKey,
        action: () => Promise<unknown>,
    ) => {
        setIsLoading(key);
        try {
            await action();
            router.refresh();
        } catch (error) {
            console.error(`Failed to execute ${key}:`, error);
            const message = error instanceof Error ? error.message : `Failed to execute ${key}`;
            alert(message);
        } finally {
            setIsLoading(null);
        }
    };

    const handleGrantAttempt = () =>
        executeAction('grant', async () => {
            const result = await grantExtraAttempt(userId, 1);
            alert(`Success! New total attempts: ${result.newTotalAttempts}`);
        });

    const handleStatusChange = (status: 'active' | 'pending' | 'suspended' | 'deleted') =>
        executeAction(status, () => updateUserStatus(userId, status));

    const handleVerifyEmail = () =>
        executeAction('verify', async () => {
            await verifyUserEmail(userId);
            alert('Email verified successfully!');
        });

    return {
        isLoading,
        handleGrantAttempt,
        handleStatusChange,
        handleVerifyEmail,
    };
}
