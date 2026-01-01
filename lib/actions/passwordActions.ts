'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authOptions } from '@/lib/auth/authOptions';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

/**
 * Change password for the currently logged-in user
 */
export async function changeOwnPassword(data: {
    currentPassword: string;
    newPassword: string;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    await connectToDatabase();

    // Get user with password hash
    const user = await User.findById(session.user.id).select('+passwordHash');

    if (!user) {
        throw new Error('User not found');
    }

    // Users who signed up with OAuth don't have passwords
    if (user.authProvider !== 'email') {
        throw new Error('Cannot change password for OAuth accounts. You signed up with ' + user.authProvider);
    }

    // Verify current password
    if (!user.passwordHash) {
        throw new Error('No password set for this account');
    }
    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isValid) {
        throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (data.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(data.newPassword, 12);
    user.passwordHash = newHash;
    await user.save();

    return { success: true };
}

/**
 * Admin: Reset password for any user
 */
export async function adminResetUserPassword(userId: string, newPassword: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    // Validate new password
    if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newHash;
    user.authProvider = 'email'; // Switch to email auth if they were OAuth
    await user.save();

    revalidatePath('/en/admin/users');
    revalidatePath(`/en/admin/users/${userId}`);

    return { success: true };
}

/**
 * Admin: Change own password (super admin)
 */
export async function adminChangeOwnPassword(data: {
    currentPassword: string;
    newPassword: string;
}) {
    const session = await requireSuperAdmin();

    await connectToDatabase();

    const user = await User.findById(session.user.id).select('+passwordHash');

    if (!user) {
        throw new Error('Admin user not found');
    }

    // Verify current password
    if (!user.passwordHash) {
        throw new Error('No password set for this account');
    }
    const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isValid) {
        throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (data.newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(data.newPassword, 12);
    user.passwordHash = newHash;
    await user.save();

    revalidatePath('/en/admin/settings');

    return { success: true };
}
