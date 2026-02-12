import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import User, { IUser } from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('email profile.fullName profile.age profile.firstName profile.lastName') as IUser;

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            email: user.email,
            fullName: user.profile?.fullName || `${user.profile?.firstName} ${user.profile?.lastName}`,
            age: user.profile?.age
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
