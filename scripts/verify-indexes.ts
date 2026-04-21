/**
 * Verify that Mongo indexes on the shared collections match what the
 * Mongoose models declare. Reports:
 *   - Missing indexes (model declares, Mongo doesn't have)
 *   - Extra indexes (Mongo has, model doesn't declare)
 *   - Option mismatches (partialFilterExpression drift, expireAfterSeconds, unique)
 *
 * Use before / after every deploy that touches a model schema. Run once
 * against the shared cluster; both repos point at the same data.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/verify-indexes.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/verify-indexes.ts --fix
 *
 * --fix will call syncIndexes() on each model. Only pass it knowingly —
 * syncIndexes drops indexes that are not in the schema.
 */

import './_prodGuard';
import mongoose from 'mongoose';
import connectToDatabase from '../lib/mongodb';
import PlacementTest from '../lib/models/PlacementTest';
import PricingConfig from '../lib/models/PricingConfig';
import User from '../lib/models/User';
import VerificationToken from '../lib/models/VerificationToken';
import PasswordResetToken from '../lib/models/PasswordResetToken';

const FIX = process.argv.includes('--fix');

type MongoIndex = {
    name: string;
    key: Record<string, number | string>;
    unique?: boolean;
    sparse?: boolean;
    partialFilterExpression?: unknown;
    expireAfterSeconds?: number;
};

function normalize(idx: MongoIndex) {
    return {
        key: idx.key,
        unique: idx.unique ?? false,
        sparse: idx.sparse ?? false,
        partialFilterExpression: idx.partialFilterExpression ?? null,
        expireAfterSeconds: idx.expireAfterSeconds ?? null,
    };
}

function deepEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

async function checkModel(model: mongoose.Model<unknown>, label: string) {
    console.log(`\n── ${label} ──`);

    const declared = model.schema.indexes().map((entry: unknown) => {
        const [key, opts] = entry as [Record<string, number | string>, Record<string, unknown> | undefined];
        return { key, ...(opts || {}) };
    }) as MongoIndex[];

    const collection = model.collection;
    const actual = (await collection.indexes()) as MongoIndex[];

    // Drop the default _id index; it's implicit.
    const actualNoId = actual.filter(i => i.name !== '_id_');

    const missing: MongoIndex[] = [];
    const drift: Array<{ declared: MongoIndex; actual: MongoIndex }> = [];

    for (const d of declared) {
        const match = actualNoId.find(a => deepEqual(a.key, d.key));
        if (!match) {
            missing.push(d);
        } else if (!deepEqual(normalize(d), normalize(match))) {
            drift.push({ declared: d, actual: match });
        }
    }

    const extra = actualNoId.filter(a =>
        !declared.some(d => deepEqual(a.key, d.key))
    );

    if (missing.length === 0 && drift.length === 0 && extra.length === 0) {
        console.log('  ✅ in sync');
        return true;
    }

    if (missing.length > 0) {
        console.log('  ❌ Missing (in schema, not in Mongo):');
        for (const m of missing) console.log('    ', JSON.stringify(m));
    }
    if (drift.length > 0) {
        console.log('  ⚠️  Drift (same key, different options):');
        for (const d of drift) {
            console.log('     declared:', JSON.stringify(d.declared));
            console.log('     actual  :', JSON.stringify(d.actual));
        }
    }
    if (extra.length > 0) {
        console.log('  ⚠️  Extra (in Mongo, not in schema — syncIndexes would drop):');
        for (const e of extra) console.log('    ', e.name, JSON.stringify(e.key));
    }

    if (FIX) {
        console.log('  🔧 --fix: running syncIndexes()');
        await model.syncIndexes();
        console.log('  ✅ synced');
    }

    return false;
}

async function main() {
    await connectToDatabase();
    console.log(`verify-indexes: ${FIX ? 'FIX mode' : 'REPORT mode'}`);

    const results = await Promise.all([
        checkModel(PlacementTest as unknown as mongoose.Model<unknown>, 'PlacementTest'),
        checkModel(PricingConfig as unknown as mongoose.Model<unknown>, 'PricingConfig'),
        checkModel(User as unknown as mongoose.Model<unknown>, 'User'),
        checkModel(VerificationToken as unknown as mongoose.Model<unknown>, 'VerificationToken'),
        checkModel(PasswordResetToken as unknown as mongoose.Model<unknown>, 'PasswordResetToken'),
    ]);

    await mongoose.disconnect();
    const allOk = results.every(Boolean);
    console.log(`\n${allOk ? '✅ ALL SYNC' : '❌ DRIFT DETECTED'}`);
    process.exit(allOk ? 0 : 3);
}

main().catch(err => {
    console.error('verify-indexes fatal:', err);
    process.exit(1);
});
