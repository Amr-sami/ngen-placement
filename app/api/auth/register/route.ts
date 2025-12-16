import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            parentPhoneNumber,
            primaryContactType,
            age,
            dateOfBirth,
            country,
            city,
            joinType,
            organizationName,
            howDidYouKnowNgen,
        } = body;

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !age || !joinType || !howDidYouKnowNgen) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            authProvider: 'email',
            emailVerified: false,
            role: 'student',
            status: 'pending',
            profile: {
                firstName,
                lastName,
                phoneNumber,
                parentPhoneNumber,
                primaryContactType,
                age: parseInt(age),
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                address: {
                    country,
                    city,
                },
                joinType,
                organizationName: joinType === 'organization' ? organizationName : undefined,
                howDidYouKnowNgen,
            },
        });

        // TODO: Send verification email here using Resend
        // For now, we'll auto-verify for testing (remove this in production)
        // user.emailVerified = true;
        // user.status = 'active';
        // await user.save();

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your email.',
                userId: user._id.toString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key error
        if (error instanceof Error && error.message.includes('duplicate key')) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
