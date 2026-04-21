/**
 * Seed script to create a support user with read-only access to placement test results.
 * 
 * Usage: npx tsx scripts/create-support-user.ts
 *
 * This creates a support user with:
 *   Email: support@ngen.com
 *   Password: Support@2026!
 *   Role: support
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { assertNotProduction } from './_prodGuard';

assertNotProduction('create-support-user.ts');

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.error('   Set it in your .env file or pass it inline:');
    console.error('   MONGODB_URI="mongodb+srv://..." npx tsx scripts/create-support-user.ts');
    throw new Error('Missing MONGODB_URI');
}

const SUPPORT_EMAIL = 'support@ngen.com';
const SUPPORT_PASSWORD = 'Support@2026!';

async function createSupportUser() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');

    const usersCollection = db.collection('users');

    // Check if support user already exists
    const existing = await usersCollection.findOne({ email: SUPPORT_EMAIL });
    if (existing) {
        console.log(`⚠️  Support user already exists: ${SUPPORT_EMAIL}`);
        console.log(`   Role: ${existing.role}`);

        if (existing.role !== 'support') {
            await usersCollection.updateOne(
                { email: SUPPORT_EMAIL },
                { $set: { role: 'support' } }
            );
            console.log('   ✅ Updated role to "support"');
        }

        await mongoose.disconnect();
        return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(SUPPORT_PASSWORD, 12);

    // Create the support user
    await usersCollection.insertOne({
        email: SUPPORT_EMAIL,
        passwordHash,
        authProvider: 'email',
        emailVerified: true,
        role: 'support',
        status: 'active',
        profile: {
            firstName: 'Support',
            lastName: 'User',
            fullName: 'Support User',
            age: 30,
            joinType: 'individual',
            howDidYouKnowNgen: 'internal',
        },
        placementTest: {
            hasTakenAnyPlacementTest: false,
            allowedAttempts: 0,
            attemptsUsed: 0,
            technicalAttemptsUsed: 0,
            softSkillsAttemptsUsed: 0,
        },
        gameProgress: { level: 1, score: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log('✅ Support user created successfully!');
    console.log(`   📧 Email:    ${SUPPORT_EMAIL}`);
    console.log(`   🔑 Password: ${SUPPORT_PASSWORD}`);
    console.log(`   👤 Role:     support`);
    console.log('');
    console.log('   This user can only view placement test results in the admin panel.');

    await mongoose.disconnect();
}

createSupportUser().catch(err => {
    console.error('❌ Error:', err.message);
    mongoose.disconnect();
    throw err;
});
