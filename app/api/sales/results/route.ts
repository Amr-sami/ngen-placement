import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getPlacementResultsFromFirebase } from '@/lib/firebase-service';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
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

            const rawMongo = await db.collection('placementtests').find().sort({ timestamp: -1 }).toArray();

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

        // 3. Merge and De-duplicate (simple by email + score if needed, but let's just combine for now)
        // We prefer Firebase if available, but for now just concat and sort
        const combined = [...firebaseResults, ...mongoResults];

        // Sort by timestamp desc
        const sorted = combined.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
            const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
            return timeB - timeA;
        });

        // Basic de-duplication: if we have same email and score within same minute, count as same
        const unique = sorted.filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.email === item.email &&
                t.score === item.score &&
                Math.abs(new Date(t.timestamp).getTime() - new Date(item.timestamp).getTime()) < 60000
            ))
        );

        return NextResponse.json(unique);
    } catch (error) {
        console.error('Sales API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }
}
