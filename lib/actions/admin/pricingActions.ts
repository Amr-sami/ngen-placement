'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import PricingConfig from '@/lib/models/PricingConfig';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

/**
 * Update belt prices (Global)
 */
export async function updateBeltPrice(
    beltId: string,
    priceEGP: number,
    priceUSD: number
) {
    await requireSuperAdmin();
    await connectToDatabase();

    const result = await Belt.findByIdAndUpdate(
        beltId,
        {
            $set: {
                basePriceEGP: priceEGP,
                basePriceUSD: priceUSD,
            }
        },
        { new: true }
    );

    if (!result) {
        throw new Error('Belt not found');
    }

    // Invalidate pricing pages so changes reflect immediately
    revalidatePath('/en/admin/pricing');
    revalidatePath('/ar/admin/pricing');
    revalidatePath('/en/pricing');
    revalidatePath('/ar/pricing');
    revalidatePath('/en');
    revalidatePath('/ar');

    return { success: true };
}

/**
 * Toggle belt sales enabled (Global)
 */
export async function toggleBeltSales(beltId: string, enabled: boolean) {
    await requireSuperAdmin();
    await connectToDatabase();

    const result = await Belt.findByIdAndUpdate(
        beltId,
        { salesEnabled: enabled },
        { new: true }
    );

    if (!result) {
        throw new Error('Belt not found');
    }

    revalidatePath('/en/admin/pricing');
    revalidatePath('/en/pricing');

    return { success: true };
}

/**
 * Update package discount percentages
 */
export async function updatePackageDiscount(
    configId: string,
    discountEGP: number,
    discountUSD: number
) {
    await requireSuperAdmin();
    await connectToDatabase();

    const config = await PricingConfig.findByIdAndUpdate(
        configId,
        {
            discountPercentEGP: discountEGP,
            discountPercentUSD: discountUSD,
        },
        { new: true }
    );

    if (!config) {
        throw new Error('Pricing config not found');
    }

    revalidatePath('/en/admin/pricing');
    revalidatePath('/ar/admin/pricing');
    revalidatePath('/en/pricing');
    revalidatePath('/ar/pricing');

    return { success: true };
}

/**
 * Toggle pricing config active status
 */
export async function togglePricingConfigActive(configId: string, isActive: boolean) {
    await requireSuperAdmin();
    await connectToDatabase();

    const config = await PricingConfig.findByIdAndUpdate(
        configId,
        { isActive },
        { new: true }
    );

    if (!config) {
        throw new Error('Pricing config not found');
    }

    revalidatePath('/en/admin/pricing');
    revalidatePath('/en/pricing');

    return { success: true };
}

/**
 * Get all belts with their pricing info
 */
export async function getBeltsWithPricing() {
    await requireSuperAdmin();
    await connectToDatabase();

    const belts = await Belt.find().sort({ order: 1 }).lean();

    // No need to deduplicate, belts are unique global documents now
    return belts.map(belt => ({
        id: belt._id.toString(),
        name: { en: belt.name.en, ar: belt.name.ar },
        code: belt.code,
        order: belt.order,
        basePriceEGP: belt.basePriceEGP,
        basePriceUSD: belt.basePriceUSD,
        packageLevel: belt.packageLevel,
        salesEnabled: belt.salesEnabled,
    }));
}

/**
 * Get all pricing configurations
 */
export async function getPricingConfigs() {
    await requireSuperAdmin();
    await connectToDatabase();

    const configs = await PricingConfig.find().sort({ configType: 1, packageLevel: 1 }).lean();

    return configs.map(config => ({
        id: config._id.toString(),
        configType: config.configType,
        name: { en: config.name.en, ar: config.name.ar }, // Manually construct to avoid _id
        packageLevel: config.packageLevel,
        discountPercentEGP: config.discountPercentEGP,
        discountPercentUSD: config.discountPercentUSD,
        fixedPriceEGP: config.fixedPriceEGP,
        fixedPriceUSD: config.fixedPriceUSD,
        belts: Array.isArray(config.belts) ? config.belts : [],
        isActive: config.isActive,
    }));
}

/**
 * Update fixed price for a package
 */
export async function updatePackageFixedPrice(
    configId: string,
    fixedPriceEGP: number | null,
    fixedPriceUSD: number | null
) {
    await requireSuperAdmin();
    await connectToDatabase();

    const updateData: Record<string, number | undefined> = {};
    if (fixedPriceEGP !== null) {
        updateData.fixedPriceEGP = fixedPriceEGP;
    }
    if (fixedPriceUSD !== null) {
        updateData.fixedPriceUSD = fixedPriceUSD;
    }

    const config = await PricingConfig.findByIdAndUpdate(
        configId,
        { $set: updateData },
        { new: true }
    );

    if (!config) {
        throw new Error('Pricing config not found');
    }

    revalidatePath('/en/admin/pricing');
    revalidatePath('/en/pricing');

    return { success: true };
}
