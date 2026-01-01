'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

/**
 * Grant extra placement test attempts to a user
 */
export async function grantExtraAttempt(userId: string, attempts: number = 1) {
    await requireSuperAdmin();
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Initialize placementTest if not exists
    if (!user.placementTest) {
        user.placementTest = {
            hasTakenAnyPlacementTest: false,
            allowedAttempts: 1,
            attemptsUsed: 0,
            extraAttemptsGrantedBySupport: 0,
        };
    }

    // Add extra attempts
    user.placementTest.extraAttemptsGrantedBySupport =
        (user.placementTest.extraAttemptsGrantedBySupport || 0) + attempts;

    await user.save();

    // Revalidate admin pages
    revalidatePath('/en/admin/users');
    revalidatePath(`/en/admin/users/${userId}`);

    return {
        success: true,
        newTotalAttempts: user.placementTest.allowedAttempts + user.placementTest.extraAttemptsGrantedBySupport,
        attemptsUsed: user.placementTest.attemptsUsed,
    };
}

/**
 * Update user status (active, suspended, deleted)
 */
export async function updateUserStatus(
    userId: string,
    status: 'active' | 'pending' | 'suspended' | 'deleted'
) {
    await requireSuperAdmin();
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
    );

    if (!user) {
        throw new Error('User not found');
    }

    revalidatePath('/en/admin/users');
    revalidatePath(`/en/admin/users/${userId}`);

    return { success: true, newStatus: status };
}

/**
 * Update user profile fields
 */
export async function updateUserProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const updateData: Record<string, string> = {};
    if (data.firstName) updateData['profile.firstName'] = data.firstName;
    if (data.lastName) updateData['profile.lastName'] = data.lastName;
    if (data.phoneNumber) updateData['profile.phoneNumber'] = data.phoneNumber;
    if (data.email) updateData['email'] = data.email.toLowerCase();

    // Update fullName if first or last name changed
    if (data.firstName || data.lastName) {
        const user = await User.findById(userId);
        if (user) {
            const firstName = data.firstName || user.profile.firstName;
            const lastName = data.lastName || user.profile.lastName;
            updateData['profile.fullName'] = `${firstName} ${lastName}`;
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
    );

    if (!user) {
        throw new Error('User not found');
    }

    revalidatePath('/en/admin/users');
    revalidatePath(`/en/admin/users/${userId}`);

    return { success: true };
}

/**
 * Get paginated users list
 */
export async function getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = options;

    // Build query
    const query: Record<string, unknown> = {
        role: { $ne: 'superadmin' }, // Exclude super admins
    };

    if (search) {
        query.$or = [
            { email: { $regex: search, $options: 'i' } },
            { 'profile.firstName': { $regex: search, $options: 'i' } },
            { 'profile.lastName': { $regex: search, $options: 'i' } },
            { 'profile.fullName': { $regex: search, $options: 'i' } },
        ];
    }

    if (status && status !== 'all') {
        query.status = status;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('email profile.firstName profile.lastName profile.fullName status role createdAt lastLoginAt placementTest')
        .lean();

    return {
        users: users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
            fullName: user.profile?.fullName || `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
            status: user.status,
            role: user.role,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            placementTest: user.placementTest ? {
                hasTaken: user.placementTest.hasTakenAnyPlacementTest,
                attemptsUsed: user.placementTest.attemptsUsed || 0,
                totalAttempts: (user.placementTest.allowedAttempts || 1) + (user.placementTest.extraAttemptsGrantedBySupport || 0),
            } : null,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get single user by ID
 */
export async function getUserById(userId: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const user = await User.findById(userId)
        .select('-passwordHash')
        .lean();

    if (!user) {
        return null;
    }

    return {
        id: user._id.toString(),
        email: user.email,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        role: user.role,
        status: user.status,
        profile: user.profile,
        progress: user.progress,
        placementTest: user.placementTest,
        detectedCountry: user.detectedCountry,
        detectedCountryCode: user.detectedCountryCode,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
    };
}

/**
 * Delete user (soft delete - sets status to deleted)
 */
export async function deleteUser(userId: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
        userId,
        { status: 'deleted' },
        { new: true }
    );

    if (!user) {
        throw new Error('User not found');
    }

    revalidatePath('/en/admin/users');

    return { success: true };
}

/**
 * Permanently delete user (use with caution)
 */
export async function permanentlyDeleteUser(userId: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const result = await User.findByIdAndDelete(userId);

    if (!result) {
        throw new Error('User not found');
    }

    revalidatePath('/en/admin/users');

    return { success: true };
}
