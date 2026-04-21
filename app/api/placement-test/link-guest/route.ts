import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import { linkGuestPlacementTests } from '@/lib/placement-test/linkGuest';
import { clearLeadCookie } from '@/lib/placement-test/leadToken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Claim any orphan guest PlacementTest rows for the currently authenticated
 * user using the lead-token cookie carried on this request. Intended to be
 * called from the client immediately after a successful sign-in so returning
 * users see their pre-registration exam results attached to their account.
 */
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    try {
        const result = await linkGuestPlacementTests(
            session.user.id,
            request.headers.get('cookie')
        );

        const response = NextResponse.json({
            linked: result.linked,
            hadToken: result.hadToken,
        });
        if (result.hadToken) {
            response.headers.append('Set-Cookie', clearLeadCookie());
        }
        return response;
    } catch (err) {
        console.error('link-guest failed:', err);
        return NextResponse.json(
            { error: 'link failed' },
            { status: 500 }
        );
    }
}
