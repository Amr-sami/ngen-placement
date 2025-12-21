import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const data = await req.json();
        const { firstName, lastName, phone, age, country, city, organizationName } = data;

        // Basic validation
        if (!firstName || !lastName || !age) {
            return NextResponse.json(
                { error: 'First name, last name, and age are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Update user profile
        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    'profile.firstName': firstName,
                    'profile.lastName': lastName,
                    // Update fullName via pre-save hook? findOneAndUpdate bypasses pre-save hooks usually.
                    // We should set fullName explicitly or use save().
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
