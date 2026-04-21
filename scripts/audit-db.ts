/**
 * Non-destructive snapshot of the shared Mongo cluster. Produces counts we
 * need before launch so DevOps knows what they're cutting over and we know
 * what orphan rows exist.
 *
 * Outputs a JSON report to stdout. Pipe to a file if you want it archived.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/audit-db.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/audit-db.ts > docs/db-audit.json
 */

import './_prodGuard';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import PlacementTest from '../lib/models/PlacementTest';
import User from '../lib/models/User';
import Order from '../lib/models/Order';
import Transaction from '../lib/models/Transaction';
import Track from '../lib/models/Track';
import Belt from '../lib/models/Belt';
import VerificationToken from '../lib/models/VerificationToken';
import PasswordResetToken from '../lib/models/PasswordResetToken';

interface Report {
    generatedAt: string;
    collections: Record<string, number>;
    placementTest: {
        total: number;
        byStatus: Record<string, number>;
        byTestType: Record<string, number>;
        guestRows: number;
        authedRows: number;
        orphansWithLeadToken: number;
        rowsMissingScore: number;
    };
    users: {
        total: number;
        byStatus: Record<string, number>;
        byRole: Record<string, number>;
        emailVerified: number;
        unverified: number;
    };
    tokens: {
        verificationTokens: number;
        passwordResetTokens: number;
    };
    ordersAndTransactions: {
        orders: number;
        transactions: number;
    };
    catalog: {
        tracks: number;
        belts: number;
    };
}

async function groupCount(
    model: mongoose.Model<unknown>,
    field: string
): Promise<Record<string, number>> {
    const pipeline = [{ $group: { _id: `$${field}`, n: { $sum: 1 } } }];
    const rows = (await (model as unknown as { aggregate: (p: unknown) => Promise<Array<{ _id: string | null; n: number }>> }).aggregate(pipeline));
    return Object.fromEntries(
        rows.map(r => [String(r._id ?? 'null'), r.n])
    );
}

async function main() {
    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) throw new Error('no db');

    const collNames = (await db.listCollections().toArray()).map(c => c.name);
    const collCounts: Record<string, number> = {};
    for (const n of collNames) {
        collCounts[n] = await db.collection(n).countDocuments();
    }

    const [
        placementTotal,
        placementByStatus,
        placementByType,
        guestRows,
        authedRows,
        orphansWithLeadToken,
        missingScore,

        usersTotal,
        usersByStatus,
        usersByRole,
        emailVerified,
        unverified,

        verifTokens,
        resetTokens,
        orders,
        transactions,
        tracks,
        belts,
    ] = await Promise.all([
        PlacementTest.countDocuments(),
        groupCount(PlacementTest as unknown as mongoose.Model<unknown>, 'status'),
        groupCount(PlacementTest as unknown as mongoose.Model<unknown>, 'testType'),
        PlacementTest.countDocuments({ userId: null }),
        PlacementTest.countDocuments({ userId: { $ne: null } }),
        // NB: leadTokenHash is select:false, but the driver-level countDocuments
        // ignores projections; we just need existence.
        db.collection('placementtests').countDocuments({
            userId: null,
            leadTokenHash: { $exists: true, $ne: null },
        }),
        PlacementTest.countDocuments({
            status: 'completed',
            scorePercent: { $exists: false },
        }),

        User.countDocuments(),
        groupCount(User as unknown as mongoose.Model<unknown>, 'status'),
        groupCount(User as unknown as mongoose.Model<unknown>, 'role'),
        User.countDocuments({ emailVerified: true }),
        User.countDocuments({ emailVerified: { $ne: true } }),

        VerificationToken.countDocuments(),
        PasswordResetToken.countDocuments(),
        Order.countDocuments(),
        Transaction.countDocuments(),
        Track.countDocuments(),
        Belt.countDocuments(),
    ]);

    const report: Report = {
        generatedAt: new Date().toISOString(),
        collections: collCounts,
        placementTest: {
            total: placementTotal,
            byStatus: placementByStatus,
            byTestType: placementByType,
            guestRows,
            authedRows,
            orphansWithLeadToken,
            rowsMissingScore: missingScore,
        },
        users: {
            total: usersTotal,
            byStatus: usersByStatus,
            byRole: usersByRole,
            emailVerified,
            unverified,
        },
        tokens: {
            verificationTokens: verifTokens,
            passwordResetTokens: resetTokens,
        },
        ordersAndTransactions: {
            orders,
            transactions,
        },
        catalog: {
            tracks,
            belts,
        },
    };

    console.log(JSON.stringify(report, null, 2));

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('audit-db fatal:', err);
    process.exit(1);
});
