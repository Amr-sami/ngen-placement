/**
 * Database Migration Script: Add Bilingual Support
 * 
 * This script migrates existing Track, Belt, and PricingConfig documents
 * to use the new LocalizedString format for name and description fields.
 * 
 * Run with: npx ts-node scripts/migrate-to-bilingual.ts
 * 
 * What it does:
 * 1. Converts name: "Yellow Belt" → name: { en: "Yellow Belt", ar: "" }
 * 2. Converts description: "..." → description: { en: "...", ar: "" }
 * 3. Leaves Arabic fields empty for manual translation
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Arabic translations for belt names (predefined)
const BELT_TRANSLATIONS: Record<string, { name: string; description?: string }> = {
    'YELLOW': { name: 'الحزام الأصفر', description: 'المستوى التأسيسي الأول' },
    'ORANGE': { name: 'الحزام البرتقالي', description: 'المستوى التأسيسي الثاني' },
    'GREEN': { name: 'الحزام الأخضر', description: 'مستوى التطوير الأول' },
    'BLUE': { name: 'الحزام الأزرق', description: 'مستوى التطوير الثاني' },
    'RED': { name: 'الحزام الأحمر', description: 'مستوى التعمق الأول' },
    'BROWN': { name: 'الحزام البني', description: 'مستوى التعمق الثاني' },
    'BLACK': { name: 'الحزام الأسود', description: 'مستوى التميز' },
    'NINJA': { name: 'حزام النينجا', description: 'مستوى الإتقان' },
    'MASTER': { name: 'حزام الماستر', description: 'مستوى الخبير' },
};

// Arabic translations for track names
const TRACK_TRANSLATIONS: Record<string, { name: string; description?: string }> = {
    'programming': {
        name: 'البرمجة',
        description: 'تعلم أساسيات البرمجة وبناء التطبيقات من الصفر حتى الاحتراف'
    },
    'data-science': {
        name: 'علوم البيانات',
        description: 'تحليل البيانات وتصويرها واستخدامها للتنبؤ'
    },
    'artificial-intelligence': {
        name: 'الذكاء الاصطناعي',
        description: 'بناء أنظمة ذكية وتدريب نماذج تعلم الآلة'
    },
    'robotics': {
        name: 'الروبوتات',
        description: 'التحكم في الأجهزة وأنظمة إنترنت الأشياء'
    },
    'cybersecurity': {
        name: 'الأمن السيبراني',
        description: 'حماية الأنظمة والشبكات من التهديدات الرقمية'
    },
    'creative-arts': {
        name: 'الفنون الإبداعية',
        description: 'التصميم الرقمي والرسوم المتحركة وإنتاج الفيديو'
    },
};

async function migrateCollection(
    collectionName: string,
    fieldsToMigrate: string[],
    translationsMap?: Record<string, { name?: string; description?: string }>,
    keyField?: string
) {
    const db = mongoose.connection.db;
    if (!db) {
        console.error('❌ Database connection not available');
        return;
    }

    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();

    console.log(`\n📦 Migrating ${collectionName}: ${documents.length} documents`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const doc of documents) {
        const updates: Record<string, unknown> = {};
        let needsUpdate = false;

        // Get translation key if available
        const translationKey = keyField ? doc[keyField]?.toLowerCase?.() : null;
        const translations = translationKey && translationsMap ? translationsMap[translationKey] : null;

        for (const field of fieldsToMigrate) {
            const currentValue = doc[field];

            // Skip if already migrated (has en/ar structure)
            if (currentValue && typeof currentValue === 'object' && ('en' in currentValue || 'ar' in currentValue)) {
                continue;
            }

            // Convert string to LocalizedString
            if (typeof currentValue === 'string') {
                const arValue = translations?.[field as 'name' | 'description'] || '';
                updates[field] = {
                    en: currentValue,
                    ar: arValue,
                };
                needsUpdate = true;
            } else if (currentValue === undefined || currentValue === null) {
                // Initialize empty localized field
                updates[field] = { en: '', ar: '' };
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            await collection.updateOne(
                { _id: doc._id },
                { $set: updates }
            );
            migratedCount++;
            console.log(`  ✅ Migrated: ${doc.name || doc.code || doc._id}`);
        } else {
            skippedCount++;
        }
    }

    console.log(`  📊 Results: ${migratedCount} migrated, ${skippedCount} skipped (already migrated)`);
}

async function main() {
    console.log('🚀 Starting bilingual migration...\n');

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to MongoDB\n');

        // Migrate Tracks
        await migrateCollection(
            'tracks',
            ['name', 'description'],
            TRACK_TRANSLATIONS,
            'slug'
        );

        // Migrate Belts
        await migrateCollection(
            'belts',
            ['name', 'description'],
            BELT_TRANSLATIONS,
            'code'
        );

        // Migrate PricingConfigs
        await migrateCollection(
            'pricingconfigs',
            ['name']
        );

        console.log('\n✅ Migration completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Review the migrated data in MongoDB');
        console.log('   2. Add missing Arabic translations manually or via admin panel');
        console.log('   3. Update seed scripts to use the new format');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

main();
