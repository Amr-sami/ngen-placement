import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import PlacementTest from '@/lib/models/PlacementTest';
import {
    hashLeadToken,
    parseLeadTokenFromHeader,
} from '@/lib/placement-test/leadToken';

interface RouteParams {
    params: Promise<{ testId: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { testId } = await params;
        const session = await getServerSession(authOptions);

        await dbConnect();

        // Need +leadTokenHash to verify guest ownership. select:false keeps it
        // off default reads so it never leaks to other endpoints.
        const test = await PlacementTest.findById(testId).select('+leadTokenHash');

        if (!test) {
            return NextResponse.json(
                { error: 'Test not found' },
                { status: 404 }
            );
        }

        // Access is granted if EITHER the logged-in user owns the row OR the
        // caller presents a lead-token cookie whose hash matches the row. This
        // lets guests read their own completed results from the /results page.
        let userMatches = false;
        if (session?.user?.email) {
            const user = await User.findOne({ email: session.user.email });
            userMatches =
                !!user &&
                !!test.userId &&
                test.userId.toString() === user._id.toString();
        }

        let cookieMatches = false;
        if (!userMatches && test.leadTokenHash) {
            const cookieToken = parseLeadTokenFromHeader(req.headers.get('cookie'));
            cookieMatches =
                !!cookieToken && hashLeadToken(cookieToken) === test.leadTokenHash;
        }

        if (!userMatches && !cookieMatches) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            test: {
                id: test._id.toString(),
                attemptNumber: test.attemptNumber,
                status: test.status,
                scorePercent: test.scorePercent,
                resultBeltName: test.resultBeltName,
                trackName: test.trackName,
                questions: test.questions,
                detailedEvaluation: test.detailedEvaluation,
                startedAt: test.startedAt,
                completedAt: test.completedAt,
                createdAt: test.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching placement test:', error);
        return NextResponse.json(
            { error: 'Failed to fetch test' },
            { status: 500 }
        );
    }
}
