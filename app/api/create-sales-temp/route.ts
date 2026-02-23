import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
    try {
        await connectToDatabase();

        const email = 'sales@ngen.com';
        const rawPassword = 'salesngen2026$$';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            existingUser.role = 'sales';
            existingUser.status = 'active';
            existingUser.passwordHash = await bcrypt.hash(rawPassword, 12);
            await existingUser.save();
            return NextResponse.json({ success: true, message: 'Sales user updated' });
        }

        const passwordHash = await bcrypt.hash(rawPassword, 12);

        await User.create({
            email,
            passwordHash,
            authProvider: 'email',
            emailVerified: true,
            role: 'sales',
            status: 'active',
            profile: {
                firstName: 'Sales',
                lastName: 'Team',
                age: 30,
                joinType: 'individual',
                howDidYouKnowNgen: 'Internal',
            }
        });

        return NextResponse.json({ success: true, message: 'Sales user created' });
    } catch (error) {
        console.error('Error in temp sales route:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
