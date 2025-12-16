/**
 * Database Seed Script
 * Run with: npx tsx scripts/seed.ts
 * 
 * This script populates the database with initial data:
 * - Tracks (Programming, AI, Cybersecurity, etc.)
 * - Belts for each track (White, Yellow, Orange, etc.)
 */

import mongoose from 'mongoose';
import 'dotenv/config';

// Import models
import Track from '../lib/models/Track';
import Belt from '../lib/models/Belt';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
}

// Track data
const tracksData = [
    {
        name: 'Programming',
        slug: 'programming',
        description: 'Learn to code from scratch with Python, JavaScript, and more. Build real projects and develop problem-solving skills.',
        isActive: true,
    },
    {
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'Explore the world of AI, machine learning, and neural networks. Create intelligent applications.',
        isActive: true,
    },
    {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Learn to protect systems and data. Understand ethical hacking, encryption, and security best practices.',
        isActive: true,
    },
    {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Analyze data, create visualizations, and extract insights. Learn statistics, Python, and data tools.',
        isActive: true,
    },
    {
        name: 'Robotics',
        slug: 'robotics',
        description: 'Build and program robots. Combine hardware and software to create amazing machines.',
        isActive: true,
    },
    {
        name: 'Creative Arts',
        slug: 'creative-arts',
        description: 'Digital design, animation, and creative coding. Express yourself through technology.',
        isActive: true,
    },
];

// Belt data (will be created for each track)
const beltsData = [
    { name: 'White Belt', code: 'white', order: 1, minScoreToStart: 0, description: 'Beginner level - Start your journey!' },
    { name: 'Yellow Belt', code: 'yellow', order: 2, minScoreToStart: 60, description: 'Foundation skills acquired' },
    { name: 'Orange Belt', code: 'orange', order: 3, minScoreToStart: 65, description: 'Building momentum' },
    { name: 'Green Belt', code: 'green', order: 4, minScoreToStart: 70, description: 'Intermediate skills' },
    { name: 'Blue Belt', code: 'blue', order: 5, minScoreToStart: 75, description: 'Advanced beginner' },
    { name: 'Purple Belt', code: 'purple', order: 6, minScoreToStart: 80, description: 'Skilled practitioner' },
    { name: 'Brown Belt', code: 'brown', order: 7, minScoreToStart: 85, description: 'Near mastery' },
    { name: 'Black Belt', code: 'black', order: 8, minScoreToStart: 90, description: 'Master level achieved!' },
    { name: 'Ninja Belt', code: 'ninja', order: 9, minScoreToStart: 95, description: 'Elite ninja status - Top performer!' },
    { name: 'Master Belt', code: 'master', order: 10, minScoreToStart: 98, description: 'Legendary master - The ultimate achievement!' },
];

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        // Seed Tracks
        console.log('📚 Seeding Tracks...');
        let tracksCreated = 0;
        let tracksSkipped = 0;

        for (const trackData of tracksData) {
            const existing = await Track.findOne({ slug: trackData.slug });
            if (existing) {
                console.log(`   ⏭️  Track "${trackData.name}" already exists`);
                tracksSkipped++;
            } else {
                await Track.create(trackData);
                console.log(`   ✅ Created track: ${trackData.name}`);
                tracksCreated++;
            }
        }
        console.log(`   📊 Tracks: ${tracksCreated} created, ${tracksSkipped} skipped\n`);

        // Seed Belts for each Track
        console.log('🥋 Seeding Belts...');
        let beltsCreated = 0;
        let beltsSkipped = 0;

        const allTracks = await Track.find({});

        for (const track of allTracks) {
            console.log(`   📂 Track: ${track.name}`);

            for (const beltData of beltsData) {
                const existing = await Belt.findOne({
                    trackId: track._id,
                    code: beltData.code
                });

                if (existing) {
                    beltsSkipped++;
                } else {
                    await Belt.create({
                        ...beltData,
                        trackId: track._id,
                    });
                    console.log(`      ✅ ${beltData.name}`);
                    beltsCreated++;
                }
            }
        }
        console.log(`   📊 Belts: ${beltsCreated} created, ${beltsSkipped} skipped\n`);

        // Summary
        console.log('═══════════════════════════════════');
        console.log('✅ Seed completed successfully!');
        console.log('═══════════════════════════════════');
        console.log(`   Tracks: ${await Track.countDocuments()}`);
        console.log(`   Belts:  ${await Belt.countDocuments()}`);
        console.log('═══════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run seed
seed();
