import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import VerificationToken, { generateVerificationToken } from '@/lib/models/VerificationToken';
import { sendVerificationEmail } from '@/lib/email';
import { getIPFromHeaders, getCountryFromIP } from '@/lib/geoLocation';

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

        // Detect location from IP
        const signupIP = getIPFromHeaders(request.headers);
        const geoResult = await getCountryFromIP(signupIP);

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
            signupIP: signupIP !== 'unknown' ? signupIP : undefined,
            detectedCountry: geoResult.success ? geoResult.country : undefined,
            detectedCountryCode: geoResult.success ? geoResult.countryCode : undefined,
        });

        // Delete any existing verification tokens for this email
        await VerificationToken.deleteMany({ email: email.toLowerCase() });

        // Create verification token
        const token = generateVerificationToken();
        await VerificationToken.create({
            email: email.toLowerCase(),
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        // Send verification email
        const emailResult = await sendVerificationEmail(
            email.toLowerCase(),
            token,
            firstName
        );

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.error);
            // Don't fail registration if email fails - user can request resend
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully. Please check your email to verify your account.',
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
