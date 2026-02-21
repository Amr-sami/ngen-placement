import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

interface CheckUserBody {
    email?: string;
    phone?: string;
}

export async function POST(req: Request) {
    try {
        const body: CheckUserBody = await req.json();
        const { email, phone } = body;

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Email or phone is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Build query to check for existing user
        const query: { $or?: Array<{ email?: string; 'profile.phoneNumber'?: string }> } = {};
        const conditions = [];

        if (email) {
            conditions.push({ email: email.toLowerCase().trim() });
        }
        if (phone) {
            conditions.push({ 'profile.phoneNumber': phone.trim() });
        }

        if (conditions.length > 0) {
            query.$or = conditions;
        }

        const existingUser = await User.findOne(query).select(
            'email profile.firstName profile.lastName placementTest'
        );

        if (!existingUser) {
            return NextResponse.json({
                exists: false,
                message: 'No account found with this information',
            });
        }

        // User exists - return limited info for security
        const isGuest = false; // Existing logic doesn't seem to account for guest checks here, assuming registered user check.
        const hasTakenPlacementTest = existingUser.placementTest?.hasTakenAnyPlacementTest || false;
        const hasTakenSoftSkillsTest = existingUser.placementTest?.hasTakenSoftSkillsTest || false;
        const hasResults = !!existingUser.placementTest?.resultBeltName;

        return NextResponse.json({
            exists: true,
            hasTakenPlacementTest,
            hasTakenSoftSkillsTest,
            hasResults,
            message: 'An account with this email already exists.',
            // Only return first name initial for privacy
            userHint: existingUser.profile?.firstName
                ? `${existingUser.profile.firstName.charAt(0)}***`
                : null,
        });
    } catch (error) {
        console.error('Error checking user:', error);
        return NextResponse.json(
            { error: 'Failed to check user status' },
            { status: 500 }
        );
    }
}
