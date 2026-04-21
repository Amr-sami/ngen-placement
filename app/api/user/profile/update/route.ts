import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const ProfileUpdateSchema = z.object({
    firstName: z.string().trim().min(1).max(60),
    lastName: z.string().trim().min(1).max(60),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    age: z.union([z.number().int().min(3).max(120), z.string().trim().max(16)]),
    country: z.string().trim().max(80).optional().or(z.literal('')),
    city: z.string().trim().max(80).optional().or(z.literal('')),
    organizationName: z.string().trim().max(120).optional().or(z.literal('')),
});

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const rawBody = await req.json().catch(() => null);
        const parsed = ProfileUpdateSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: parsed.error.issues },
                { status: 400 }
            );
        }
        const { firstName, lastName, phone, age, country, city, organizationName } = parsed.data;

        await dbConnect();

        // Update user profile
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    'profile.firstName': firstName,
                    'profile.lastName': lastName,
                    'profile.fullName': `${firstName} ${lastName}`,
                    'profile.phoneNumber': phone,
                    'profile.age': age,
                    'profile.address.country': country,
                    'profile.address.city': city,
                    'profile.organizationName': organizationName,
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                firstName: updatedUser.profile.firstName,
                lastName: updatedUser.profile.lastName,
                fullName: updatedUser.profile.fullName,
                phone: updatedUser.profile.phoneNumber,
                age: updatedUser.profile.age,
                address: updatedUser.profile.address,
                organizationName: updatedUser.profile.organizationName,
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
