/**
 * Database Seed Script
 * Run with: npx tsx scripts/seed.ts
 * 
 * This script populates the database with initial data:
 * - Tracks (Programming, AI, Cybersecurity, etc.)
 * - Belts for each track with pricing
 * - Pricing configurations
 */

import mongoose from 'mongoose';
import 'dotenv/config';

// Import models
import Track from '../lib/models/Track';
import Belt from '../lib/models/Belt';
import PricingConfig from '../lib/models/PricingConfig';

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

// Belt data with pricing (base prices before any discount)
const beltsData = [
    { name: 'White Belt', code: 'white', order: 1, minScoreToStart: 0, basePriceEGP: 5000, basePriceUSD: 100, packageLevel: 'pre-foundation' as const, description: 'Pre-Foundation - Start your journey!' },
    { name: 'Yellow Belt', code: 'yellow', order: 2, minScoreToStart: 60, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'foundation' as const, description: 'Foundation skills acquired' },
    { name: 'Orange Belt', code: 'orange', order: 3, minScoreToStart: 65, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'foundation' as const, description: 'Building momentum' },
    { name: 'Green Belt', code: 'green', order: 4, minScoreToStart: 70, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'foundation' as const, description: 'Intermediate skills' },
    { name: 'Blue Belt', code: 'blue', order: 5, minScoreToStart: 75, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'specialization' as const, description: 'Specialization begins' },
    { name: 'Red Belt', code: 'red', order: 6, minScoreToStart: 80, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'specialization' as const, description: 'Skilled practitioner' },
    { name: 'Brown Belt', code: 'brown', order: 7, minScoreToStart: 85, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'specialization' as const, description: 'Near mastery' },
    { name: 'Black Belt', code: 'black', order: 8, minScoreToStart: 90, basePriceEGP: 9000, basePriceUSD: 200, packageLevel: 'specialization' as const, description: 'Master level achieved!' },
    { name: 'Ninja Belt', code: 'ninja', order: 9, minScoreToStart: 95, basePriceEGP: 18000, basePriceUSD: 400, packageLevel: 'advanced' as const, description: 'Elite ninja status - Top performer!' },
    { name: 'Master Belt', code: 'master', order: 10, minScoreToStart: 98, basePriceEGP: 18000, basePriceUSD: 400, packageLevel: 'advanced' as const, description: 'Legendary master - The ultimate achievement!' },
];

// Pricing configurations
const pricingConfigsData = [
    {
        configType: 'perBelt' as const,
        name: 'Per Belt',
        discountPercentEGP: 50,
        discountPercentUSD: 50,
        isActive: true,
    },
    {
        configType: 'package' as const,
        name: 'Foundation Package',
        packageLevel: 'foundation' as const,
        discountPercentEGP: 56,
        discountPercentUSD: 56,
        belts: ['yellow', 'orange', 'green'],
        fixedPriceEGP: 12000,
        fixedPriceUSD: 265,
        isActive: true,
    },
    {
        configType: 'package' as const,
        name: 'Specialization Package',
        packageLevel: 'specialization' as const,
        discountPercentEGP: 56,
        discountPercentUSD: 56,
        belts: ['blue', 'red', 'brown', 'black'],
        fixedPriceEGP: 16000,
        fixedPriceUSD: 355,
        isActive: true,
    },
    {
        configType: 'package' as const,
        name: 'Advanced Package',
        packageLevel: 'advanced' as const,
        discountPercentEGP: 59,
        discountPercentUSD: 59,
        belts: ['ninja', 'master'],
        fixedPriceEGP: 15000,
        fixedPriceUSD: 330,
        isActive: true,
    },
    {
        configType: 'organization' as const,
        name: 'Organizations / Schools',
        discountPercentEGP: 0, // Custom pricing
        discountPercentUSD: 0,
        isActive: true,
    },
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
        console.log('🥋 Seeding Belts with pricing...');
        let beltsCreated = 0;
        let beltsUpdated = 0;
        let beltsSkipped = 0;

        const allTracks = await Track.find({});

        for (const track of allTracks) {
            console.log(`   📂 Track: ${track.name}`);

            for (const beltData of beltsData) {
                const existing = await Belt.findOne({
                    trackId: track._id,
                    code: beltData.code.toUpperCase()
                });

                if (existing) {
                    // Update existing belt with pricing data
                    await Belt.updateOne(
                        { _id: existing._id },
                        {
                            $set: {
                                basePriceEGP: beltData.basePriceEGP,
                                basePriceUSD: beltData.basePriceUSD,
                                packageLevel: beltData.packageLevel,
                                name: beltData.name, // Update name in case of Red vs Purple
                            }
                        }
                    );
                    beltsUpdated++;
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
        console.log(`   📊 Belts: ${beltsCreated} created, ${beltsUpdated} updated, ${beltsSkipped} skipped\n`);

        // Seed Pricing Configs
        console.log('💰 Seeding Pricing Configurations...');
        let configsCreated = 0;
        let configsUpdated = 0;

        for (const configData of pricingConfigsData) {
            const existing = await PricingConfig.findOne({
                configType: configData.configType,
                name: configData.name
            });

            if (existing) {
                await PricingConfig.updateOne(
                    { _id: existing._id },
                    { $set: configData }
                );
                console.log(`   🔄 Updated: ${configData.name}`);
                configsUpdated++;
            } else {
                await PricingConfig.create(configData);
                console.log(`   ✅ Created: ${configData.name}`);
                configsCreated++;
            }
        }
        console.log(`   📊 Pricing Configs: ${configsCreated} created, ${configsUpdated} updated\n`);

        // Summary
        console.log('═══════════════════════════════════');
        console.log('✅ Seed completed successfully!');
        console.log('═══════════════════════════════════');
        console.log(`   Tracks:         ${await Track.countDocuments()}`);
        console.log(`   Belts:          ${await Belt.countDocuments()}`);
        console.log(`   PricingConfigs: ${await PricingConfig.countDocuments()}`);
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
