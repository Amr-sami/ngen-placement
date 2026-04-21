import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getPlacementResultsFromFirebase } from '@/lib/firebase-service';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['superadmin', 'support'] as const;

// Hard cap on how many rows a single request can pull back. Sales leads can
// easily grow into the tens of thousands once we launch, and an unbounded scan
// on placementtests is a DoS foot-gun. The UI paginates anyway.
const MAX_PAGE_SIZE = 200;

export async function GET(req: Request) {
    try {
        // Revalidate role against Mongo (JWT claims are frozen at login).
        // Return explicit 401/403 so the client UI can route accordingly —
        // requireAdminAccess() would redirect, which in a route handler is
        // caught by our try/catch and turned into a misleading 500.
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await connectToDatabase();
        const user = await User.findById(session.user.id).select('role status');
        const isActive = !!user && user.status === 'active' && ADMIN_ROLES.includes(user.role as typeof ADMIN_ROLES[number]);
        if (!isActive) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const url = new URL(req.url);
        const rawLimit = parseInt(url.searchParams.get('limit') || '100', 10);
        const limit = Math.min(
            Math.max(Number.isFinite(rawLimit) ? rawLimit : 100, 1),
            MAX_PAGE_SIZE
        );

        // 1. Fetch from Firebase
        let firebaseResults: any[] = [];
        try {
            firebaseResults = await getPlacementResultsFromFirebase();
        } catch (error) {
            console.error('Firebase fetch failed:', error);
        }

        // 2. Fetch from MongoDB
        let mongoResults: any[] = [];
        try {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGODB_URI || '');
            }

            const db = mongoose.connection.db;
            if (!db) throw new Error('Database connection not available');

            const rawMongo = await db
                .collection('placementtests')
                .find(
                    {},
                    // Never ship the server-side answer key or the guest lead
                    // hash to the sales UI. Both are stored on this collection
                    // but are internal scoring/ownership state.
                    { projection: { generatedQuestions: 0, leadTokenHash: 0 } }
                )
                .sort({ timestamp: -1, createdAt: -1 })
                .limit(limit)
                .toArray();

            mongoResults = rawMongo.map(doc => ({
                id: doc._id.toString(),
                type: doc.testType || (doc.belt ? 'technical' : 'soft_skills'),
                email: doc.email || doc.guestDetails?.email || null,
                phone: doc.guestDetails?.phone || null,
                name: doc.name || doc.guestDetails?.name || (doc.userId ? 'User Test' : 'Anonymous Guest'),
                score: doc.score || doc.scorePercent || 0,
                totalQuestions: doc.totalQuestions || 0,
                belt: doc.belt?.belt || doc.resultBeltName || null,
                track: doc.track || doc.trackName || null,
                timestamp: doc.timestamp || doc.createdAt || new Date(),
                evaluation: doc.detailedEvaluation || null,
                guestDetails: doc.guestDetails || null,
                source: 'mongodb'
            }));
        } catch (error) {
            console.error('MongoDB fetch failed:', error);
        }

        const combined = [...firebaseResults, ...mongoResults];

        const sorted = combined.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
            return timeB - timeA;
        });

        const unique = sorted.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.email === item.email &&
                t.score === item.score &&
                Math.abs(new Date(t.timestamp).getTime() - new Date(item.timestamp).getTime()) < 60000
            ))
        );

        return NextResponse.json(unique.slice(0, limit));
    } catch (error) {
        console.error('Sales API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}
