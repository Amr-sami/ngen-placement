/**
 * Test Users Seed Script
 * Run with: npx tsx scripts/seed-test-users.ts
 * 
 * Creates test users with different placement test results for testing progressive pricing:
 * - user-passed-yellow@mail.com (Yellow Belt - 1st in Foundation)
 * - user-passed-orange@mail.com (Orange Belt - 2nd in Foundation)
 * - user-passed-green@mail.com (Green Belt - 3rd/last in Foundation)
 * - user-passed-blue@mail.com (Blue Belt - 1st in Specialization)
 * - user-passed-red@mail.com (Red Belt - 2nd in Specialization)
 * - user-no-test@mail.com (No placement test taken)
 * 
 * Password for all: Test123!
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Import User model
import User from '../lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
}

// Common password for all test users
const TEST_PASSWORD = 'Test123!';

// Belt order mapping (from your Belt model)
const BELT_ORDERS: Record<string, number> = {
    'White Belt': 1,
    'Yellow Belt': 2,
    'Orange Belt': 3,
    'Green Belt': 4,
    'Blue Belt': 5,
    'Red Belt': 6,
    'Brown Belt': 7,
    'Black Belt': 8,
    'Ninja Belt': 9,
    'Master Belt': 10,
};

// Test users data
const testUsers = [
    {
        email: 'user-passed-yellow@mail.com',
        resultBeltName: 'Yellow Belt',
        resultScorePercent: 25,
        description: 'Yellow Belt (1st in Foundation) - Should see full Foundation Package',
    },
    {
        email: 'user-passed-orange@mail.com',
        resultBeltName: 'Orange Belt',
        resultScorePercent: 45,
        description: 'Orange Belt (2nd in Foundation) - Should see Yellow crossed out',
    },
    {
        email: 'user-passed-green@mail.com',
        resultBeltName: 'Green Belt',
        resultScorePercent: 65,
        description: 'Green Belt (3rd/last in Foundation) - Should see single belt card',
    },
    {
        email: 'user-passed-blue@mail.com',
        resultBeltName: 'Blue Belt',
        resultScorePercent: 75,
        description: 'Blue Belt (1st in Specialization) - Should see full Specialization Package',
    },
    {
        email: 'user-passed-red@mail.com',
        resultBeltName: 'Red Belt',
        resultScorePercent: 85,
        description: 'Red Belt (2nd in Specialization) - Should see Blue crossed out',
    },
    {
        email: 'user-no-test@mail.com',
        resultBeltName: null,
        resultScorePercent: null,
        description: 'No placement test - Should see all packages with "Take Test First" button',
    },
];

async function seedTestUsers() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        // Hash the password once
        const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

        console.log('👤 Creating test users...\n');
        console.log(`   Password for all users: ${TEST_PASSWORD}\n`);

        for (const testUser of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: testUser.email });

            if (existingUser) {
                // Update existing user with placement test data
                existingUser.placementTest = testUser.resultBeltName ? {
                    hasTakenAnyPlacementTest: true,
                    allowedAttempts: 3,
                    attemptsUsed: 1,
                    resultBeltName: testUser.resultBeltName,
                    resultScorePercent: testUser.resultScorePercent!,
                    takenAt: new Date(),
                } : {
                    hasTakenAnyPlacementTest: false,
                    allowedAttempts: 3,
                    attemptsUsed: 0,
                };
                await existingUser.save();
                console.log(`   📝 Updated: ${testUser.email}`);
            } else {
                // Create new user
                const newUser = new User({
                    email: testUser.email,
                    passwordHash,
                    authProvider: 'email',
                    emailVerified: true,
                    role: 'student',
                    status: 'active',
                    profile: {
                        firstName: 'Test',
                        lastName: testUser.resultBeltName?.replace(' Belt', '') || 'NoTest',
                        fullName: `Test ${testUser.resultBeltName?.replace(' Belt', '') || 'NoTest'}`,
                        age: 12,
                        joinType: 'individual',
                        howDidYouKnowNgen: 'Testing',
                    },
                    placementTest: testUser.resultBeltName ? {
                        hasTakenAnyPlacementTest: true,
                        allowedAttempts: 3,
                        attemptsUsed: 1,
                        resultBeltName: testUser.resultBeltName,
                        resultScorePercent: testUser.resultScorePercent!,
                        takenAt: new Date(),
                    } : {
                        hasTakenAnyPlacementTest: false,
                        allowedAttempts: 3,
                        attemptsUsed: 0,
                    },
                });
                await newUser.save();
                console.log(`   ✅ Created: ${testUser.email}`);
            }
            console.log(`      → ${testUser.description}\n`);
        }

        console.log('\n🎉 Test users seeded successfully!');
        console.log('\n📋 Summary:');
        console.log('─'.repeat(60));
        console.log(`   Password: ${TEST_PASSWORD}`);
        console.log('─'.repeat(60));
        testUsers.forEach(u => {
            console.log(`   ${u.email}`);
            console.log(`   → ${u.description}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error seeding test users:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

seedTestUsers();
