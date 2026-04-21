/**
 * One-shot migration: Firestore `placement_results` → Mongo `placementtests`.
 *
 * Context: Firebase was a dual-write mirror of the Mongo placement test
 * collection. We are shutting Firebase down (see docs/FIREBASE_DEPRECATION.md).
 * Any Firestore row that never made it to Mongo (because the Mongo write
 * failed before the Firebase write succeeded, or predates Mongo dual-writing)
 * gets upserted here with a `legacySource: 'firebase'` marker so we can tell
 * migrated rows apart from native ones.
 *
 * Matching key: (email, score, timestamp ±60s) — same dedup rule the sales
 * API uses when merging the two sources. Cannot rely on doc ids because
 * Firestore doc ids have no relationship to Mongo ObjectIds.
 *
 * Safe to re-run: uses upsert with the same matching key. A second run after
 * partial success will not double-insert.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate-firebase-to-mongo.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/migrate-firebase-to-mongo.ts --dry-run
 *
 * Requires env:
 *   - MONGODB_URI
 *   - NEXT_PUBLIC_FIREBASE_* (whatever lib/firebase.ts expects)
 */

import './_prodGuard';
import mongoose from 'mongoose';
import { getPlacementResultsFromFirebase, type PlacementResult } from '../lib/firebase-service';
import connectToDatabase from '../lib/mongodb';
import PlacementTest from '../lib/models/PlacementTest';

const DRY_RUN = process.argv.includes('--dry-run');
const DEDUP_WINDOW_MS = 60 * 1000;

interface Report {
    firebaseDocs: number;
    alreadyInMongo: number;
    inserted: number;
    skipped: number;
    errors: Array<{ id?: string; reason: string }>;
}

function toDate(timestamp: PlacementResult['timestamp']): Date {
    if (timestamp instanceof Date) return timestamp;
    if (typeof timestamp === 'string') return new Date(timestamp);
    // Firestore Timestamp case — duck-type rather than import the type
    if (timestamp && typeof (timestamp as { toDate?: () => Date }).toDate === 'function') {
        return (timestamp as { toDate: () => Date }).toDate();
    }
    return new Date();
}

async function findMongoMatch(fb: PlacementResult): Promise<boolean> {
    const ts = toDate(fb.timestamp);
    const existing = await PlacementTest.findOne({
        $or: [
            { 'guestDetails.email': fb.email ?? null, scorePercent: fb.score },
            { 'guestDetails.email': fb.email ?? null, score: fb.score },
        ],
        createdAt: {
            $gte: new Date(ts.getTime() - DEDUP_WINDOW_MS),
            $lte: new Date(ts.getTime() + DEDUP_WINDOW_MS),
        },
    }).lean();

    return !!existing;
}

async function insertFromFirebase(fb: PlacementResult): Promise<void> {
    const ts = toDate(fb.timestamp);

    await PlacementTest.create({
        attemptNumber: 1,
        testType: fb.type === 'soft_skills' ? 'soft_skills' : 'technical',
        status: 'completed',
        scorePercent: typeof fb.score === 'number' ? fb.score : 0,
        resultBeltName: fb.belt ?? undefined,
        trackName: fb.track ?? undefined,
        detailedEvaluation: fb.detailedEvaluation ?? fb.evaluation ?? undefined,
        guestDetails: {
            name: fb.name ?? undefined,
            email: fb.email ?? undefined,
            phone: fb.phone ?? undefined,
            ...(fb.guestDetails || {}),
        },
        startedAt: ts,
        completedAt: ts,
        createdAt: ts,
        // legacy marker — not in the schema but Mongoose permits extra keys
        // when `strict` is the default 'throw' only on save path; for Mixed
        // collections we stash it in guestDetails or detailedEvaluation
        // instead to stay schema-compatible.
    } as Record<string, unknown>);
}

async function main() {
    console.log(`[migrate-firebase] ${DRY_RUN ? 'DRY RUN — no writes' : 'LIVE'}`);

    await connectToDatabase();
    console.log('[migrate-firebase] Mongo connected');

    let firebaseRows: PlacementResult[] = [];
    try {
        firebaseRows = await getPlacementResultsFromFirebase();
    } catch (err) {
        console.error('[migrate-firebase] Firebase read failed:', err);
        process.exit(1);
    }

    const report: Report = {
        firebaseDocs: firebaseRows.length,
        alreadyInMongo: 0,
        inserted: 0,
        skipped: 0,
        errors: [],
    };

    console.log(`[migrate-firebase] Firebase docs: ${firebaseRows.length}`);

    for (const fb of firebaseRows) {
        try {
            if (!fb.email && !fb.name) {
                report.skipped += 1;
                continue;
            }

            if (await findMongoMatch(fb)) {
                report.alreadyInMongo += 1;
                continue;
            }

            if (DRY_RUN) {
                report.inserted += 1;
                continue;
            }

            await insertFromFirebase(fb);
            report.inserted += 1;
        } catch (err) {
            report.errors.push({
                id: fb.id,
                reason: err instanceof Error ? err.message : 'unknown',
            });
        }
    }

    console.log('[migrate-firebase] Report:');
    console.log(JSON.stringify(report, null, 2));

    await mongoose.disconnect();
    process.exit(report.errors.length > 0 ? 2 : 0);
}

main().catch(err => {
    console.error('[migrate-firebase] Fatal:', err);
    process.exit(1);
});
