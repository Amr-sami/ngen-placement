/**
 * Database Seed Script (Bilingual)
 * Run with: npx tsx scripts/seed.ts
 * 
 * This script populates the database with initial data:
 * - Tracks (Programming, AI, Cybersecurity, etc.) with EN/AR names
 * - Belts for each track with pricing and EN/AR names
 * - Pricing configurations with EN/AR names
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Import models
import Track from '../lib/models/Track';
import Belt from '../lib/models/Belt';
import PricingConfig from '../lib/models/PricingConfig';
import { LocalizedString } from '../lib/localization';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
}

// Track data with bilingual support
const tracksData: { name: LocalizedString; slug: string; description: LocalizedString; isActive: boolean }[] = [
    {
        name: { en: 'Programming', ar: 'البرمجة' },
        slug: 'programming',
        description: {
            en: 'Learn to code from scratch with Python, JavaScript, and more. Build real projects and develop problem-solving skills.',
            ar: 'تعلم البرمجة من الصفر باستخدام بايثون وجافا سكريبت وغيرها. بناء مشاريع حقيقية وتطوير مهارات حل المشكلات.'
        },
        isActive: true,
    },
    {
        name: { en: 'Artificial Intelligence', ar: 'الذكاء الاصطناعي' },
        slug: 'artificial-intelligence',
        description: {
            en: 'Explore the world of AI, machine learning, and neural networks. Create intelligent applications.',
            ar: 'استكشف عالم الذكاء الاصطناعي والتعلم الآلي والشبكات العصبية. أنشئ تطبيقات ذكية.'
        },
        isActive: true,
    },
    {
        name: { en: 'Cybersecurity', ar: 'الأمن السيبراني' },
        slug: 'cybersecurity',
        description: {
            en: 'Learn to protect systems and data. Understand ethical hacking, encryption, and security best practices.',
            ar: 'تعلم حماية الأنظمة والبيانات. فهم الاختراق الأخلاقي والتشفير وأفضل ممارسات الأمان.'
        },
        isActive: true,
    },
    {
        name: { en: 'Data Science', ar: 'علوم البيانات' },
        slug: 'data-science',
        description: {
            en: 'Analyze data, create visualizations, and extract insights. Learn statistics, Python, and data tools.',
            ar: 'تحليل البيانات وإنشاء التصورات واستخراج الرؤى. تعلم الإحصاء وبايثون وأدوات البيانات.'
        },
        isActive: true,
    },
    {
        name: { en: 'Robotics', ar: 'الروبوتات' },
        slug: 'robotics',
        description: {
            en: 'Build and program robots. Combine hardware and software to create amazing machines.',
            ar: 'بناء وبرمجة الروبوتات. دمج الأجهزة والبرمجيات لإنشاء آلات مذهلة.'
        },
        isActive: true,
    },
    {
        name: { en: 'Creative Arts', ar: 'الفنون الإبداعية' },
        slug: 'creative-arts',
        description: {
            en: 'Digital design, animation, and creative coding. Express yourself through technology.',
            ar: 'التصميم الرقمي والرسوم المتحركة والبرمجة الإبداعية. عبر عن نفسك من خلال التكنولوجيا.'
        },
        isActive: true,
    },
];

// Belt data with bilingual support and pricing
const beltsData: {
    name: LocalizedString;
    code: string;
    order: number;
    minScoreToStart: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    description: LocalizedString;
}[] = [
        {
            name: { en: 'White Belt', ar: 'الحزام الأبيض' },
            code: 'white',
            order: 1,
            minScoreToStart: 0,
            basePriceEGP: 5000,
            basePriceUSD: 100,
            packageLevel: 'pre-foundation',
            description: { en: 'Pre-Foundation - Start your journey!', ar: 'ما قبل التأسيس - ابدأ رحلتك!' }
        },
        {
            name: { en: 'Yellow Belt', ar: 'الحزام الأصفر' },
            code: 'yellow',
            order: 2,
            minScoreToStart: 60,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'foundation',
            description: { en: 'Foundation skills acquired', ar: 'اكتساب المهارات التأسيسية' }
        },
        {
            name: { en: 'Orange Belt', ar: 'الحزام البرتقالي' },
            code: 'orange',
            order: 3,
            minScoreToStart: 65,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'foundation',
            description: { en: 'Building momentum', ar: 'بناء الزخم' }
        },
        {
            name: { en: 'Green Belt', ar: 'الحزام الأخضر' },
            code: 'green',
            order: 4,
            minScoreToStart: 70,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'foundation',
            description: { en: 'Intermediate skills', ar: 'مهارات متوسطة' }
        },
        {
            name: { en: 'Blue Belt', ar: 'الحزام الأزرق' },
            code: 'blue',
            order: 5,
            minScoreToStart: 75,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'specialization',
            description: { en: 'Specialization begins', ar: 'بداية التخصص' }
        },
        {
            name: { en: 'Red Belt', ar: 'الحزام الأحمر' },
            code: 'red',
            order: 6,
            minScoreToStart: 80,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'specialization',
            description: { en: 'Skilled practitioner', ar: 'ممارس ماهر' }
        },
        {
            name: { en: 'Brown Belt', ar: 'الحزام البني' },
            code: 'brown',
            order: 7,
            minScoreToStart: 85,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'specialization',
            description: { en: 'Near mastery', ar: 'قريب من الإتقان' }
        },
        {
            name: { en: 'Black Belt', ar: 'الحزام الأسود' },
            code: 'black',
            order: 8,
            minScoreToStart: 90,
            basePriceEGP: 9000,
            basePriceUSD: 200,
            packageLevel: 'specialization',
            description: { en: 'Master level achieved!', ar: 'تم الوصول لمستوى الإتقان!' }
        },
        {
            name: { en: 'Ninja Belt', ar: 'حزام النينجا' },
            code: 'ninja',
            order: 9,
            minScoreToStart: 95,
            basePriceEGP: 18000,
            basePriceUSD: 400,
            packageLevel: 'advanced',
            description: { en: 'Elite ninja status - Top performer!', ar: 'مرتبة نينجا النخبة - أفضل أداء!' }
        },
        {
            name: { en: 'Master Belt', ar: 'حزام الماستر' },
            code: 'master',
            order: 10,
            minScoreToStart: 98,
            basePriceEGP: 18000,
            basePriceUSD: 400,
            packageLevel: 'advanced',
            description: { en: 'Legendary master - The ultimate achievement!', ar: 'الأسطورة - الإنجاز الأقصى!' }
        },
    ];

// Pricing configurations with bilingual support
const pricingConfigsData: {
    configType: 'perBelt' | 'package' | 'organization';
    name: LocalizedString;
    packageLevel?: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    discountPercentEGP: number;
    discountPercentUSD: number;
    belts?: string[];
    fixedPriceEGP?: number;
    fixedPriceUSD?: number;
    isActive: boolean;
}[] = [
        {
            configType: 'perBelt',
            name: { en: 'Per Belt', ar: 'لكل حزام' },
            discountPercentEGP: 50,
            discountPercentUSD: 50,
            isActive: true,
        },
        {
            configType: 'package',
            name: { en: 'Foundation Package', ar: 'باقة التأسيس' },
            packageLevel: 'foundation',
            discountPercentEGP: 56,
            discountPercentUSD: 56,
            belts: ['yellow', 'orange', 'green'],
            fixedPriceEGP: 12000,
            fixedPriceUSD: 265,
            isActive: true,
        },
        {
            configType: 'package',
            name: { en: 'Specialization Package', ar: 'باقة التخصص' },
            packageLevel: 'specialization',
            discountPercentEGP: 56,
            discountPercentUSD: 56,
            belts: ['blue', 'red', 'brown', 'black'],
            fixedPriceEGP: 16000,
            fixedPriceUSD: 355,
            isActive: true,
        },
        {
            configType: 'package',
            name: { en: 'Advanced Package', ar: 'الباقة المتقدمة' },
            packageLevel: 'advanced',
            discountPercentEGP: 59,
            discountPercentUSD: 59,
            belts: ['ninja', 'master'],
            fixedPriceEGP: 15000,
            fixedPriceUSD: 330,
            isActive: true,
        },
        {
            configType: 'organization',
            name: { en: 'Organizations / Schools', ar: 'المؤسسات / المدارس' },
            discountPercentEGP: 0,
            discountPercentUSD: 0,
            isActive: true,
        },
    ];

async function seed() {
    console.log('🌱 Starting database seed (Bilingual)...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        // Seed Tracks
        console.log('📚 Seeding Tracks...');
        let tracksCreated = 0;
        let tracksUpdated = 0;

        for (const trackData of tracksData) {
            const existing = await Track.findOne({ slug: trackData.slug });
            if (existing) {
                // Update with bilingual data
                await Track.updateOne(
                    { _id: existing._id },
                    { $set: trackData }
                );
                console.log(`   🔄 Updated track: ${trackData.name.en}`);
                tracksUpdated++;
            } else {
                await Track.create(trackData);
                console.log(`   ✅ Created track: ${trackData.name.en}`);
                tracksCreated++;
            }
        }
        console.log(`   📊 Tracks: ${tracksCreated} created, ${tracksUpdated} updated\n`);

        // Seed Belts for each Track
        console.log('🥋 Seeding Belts with pricing...');
        let beltsCreated = 0;
        let beltsUpdated = 0;

        const allTracks = await Track.find({});

        for (const track of allTracks) {
            const trackName = typeof track.name === 'string' ? track.name : track.name.en;
            console.log(`   📂 Track: ${trackName}`);

            for (const beltData of beltsData) {
                const existing = await Belt.findOne({
                    trackId: track._id,
                    code: beltData.code.toUpperCase()
                });

                if (existing) {
                    // Update existing belt with pricing and bilingual data
                    await Belt.updateOne(
                        { _id: existing._id },
                        { $set: { ...beltData, code: beltData.code.toUpperCase() } }
                    );
                    beltsUpdated++;
                } else {
                    await Belt.create({
                        ...beltData,
                        code: beltData.code.toUpperCase(),
                        trackId: track._id,
                    });
                    console.log(`      ✅ ${beltData.name.en}`);
                    beltsCreated++;
                }
            }
        }
        console.log(`   📊 Belts: ${beltsCreated} created, ${beltsUpdated} updated\n`);

        // Seed Pricing Configs
        console.log('💰 Seeding Pricing Configurations...');
        let configsCreated = 0;
        let configsUpdated = 0;

        for (const configData of pricingConfigsData) {
            const existing = await PricingConfig.findOne({
                configType: configData.configType,
                packageLevel: configData.packageLevel
            });

            if (existing) {
                await PricingConfig.updateOne(
                    { _id: existing._id },
                    { $set: configData }
                );
                console.log(`   🔄 Updated: ${configData.name.en}`);
                configsUpdated++;
            } else {
                await PricingConfig.create(configData);
                console.log(`   ✅ Created: ${configData.name.en}`);
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
