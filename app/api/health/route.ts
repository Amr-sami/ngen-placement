import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Liveness + DB health probe. Pings Mongo with `ping` so a hung socket shows
 * up as a failure even when mongoose still thinks it's connected.
 */
export async function GET() {
    try {
        await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            return NextResponse.json({ status: 'error', mongo: 'no-db' }, { status: 503 });
        }
        await db.admin().ping();
        return NextResponse.json({ status: 'ok', mongo: 'up' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                mongo: 'down',
                message: error instanceof Error ? error.message : 'unknown',
            },
            { status: 503 }
        );
    }
}
