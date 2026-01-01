'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Track from '@/lib/models/Track';
import Belt from '@/lib/models/Belt';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

/**
 * Get all tracks with their belts
 */
/**
 * Get all tracks with their belts
 */
export async function getTracksWithBelts() {
    await requireSuperAdmin();
    await connectToDatabase();

    const tracks = await Track.find().sort({ createdAt: 1 }).lean();
    const belts = await Belt.find().sort({ trackId: 1, order: 1 }).lean();

    return tracks.map(track => ({
        id: track._id.toString(),
        name: { en: track.name.en, ar: track.name.ar },
        slug: track.slug,
        description: track.description ? { en: track.description.en, ar: track.description.ar } : undefined,
        isActive: track.isActive,
        belts: belts
            .filter(b => b.trackId.toString() === track._id.toString())
            .map(belt => ({
                id: belt._id.toString(),
                name: { en: belt.name.en, ar: belt.name.ar },
                code: belt.code,
                order: belt.order,
                description: belt.description ? { en: belt.description.en, ar: belt.description.ar } : undefined,
                minScoreToStart: belt.minScoreToStart,
                basePriceEGP: belt.basePriceEGP,
                basePriceUSD: belt.basePriceUSD,
                packageLevel: belt.packageLevel,
            })),
    }));
}

/**
 * Create a new track
 */
export async function createTrack(data: {
    nameEn: string;
    nameAr: string;
    slug: string;
    descriptionEn?: string;
    descriptionAr?: string;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    // Check if slug already exists
    const existing = await Track.findOne({ slug: data.slug });
    if (existing) {
        throw new Error('A track with this slug already exists');
    }

    const track = new Track({
        name: { en: data.nameEn, ar: data.nameAr },
        slug: data.slug,
        description: data.descriptionEn || data.descriptionAr
            ? { en: data.descriptionEn || '', ar: data.descriptionAr || '' }
            : undefined,
        isActive: true,
    });

    await track.save();

    revalidatePath('/en/admin/curriculum');

    return { success: true, trackId: track._id.toString() };
}

/**
 * Update a track
 */
export async function updateTrack(trackId: string, data: {
    nameEn?: string;
    nameAr?: string;
    slug?: string;
    descriptionEn?: string;
    descriptionAr?: string;
    isActive?: boolean;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const updateData: Record<string, unknown> = {};
    if (data.nameEn) updateData['name.en'] = data.nameEn;
    if (data.nameAr) updateData['name.ar'] = data.nameAr;
    if (data.slug) updateData['slug'] = data.slug;
    if (data.descriptionEn !== undefined) updateData['description.en'] = data.descriptionEn;
    if (data.descriptionAr !== undefined) updateData['description.ar'] = data.descriptionAr;
    if (data.isActive !== undefined) updateData['isActive'] = data.isActive;

    const track = await Track.findByIdAndUpdate(
        trackId,
        { $set: updateData },
        { new: true }
    );

    if (!track) {
        throw new Error('Track not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}

/**
 * Toggle track active status
 */
export async function toggleTrackActive(trackId: string, isActive: boolean) {
    await requireSuperAdmin();
    await connectToDatabase();

    const track = await Track.findByIdAndUpdate(
        trackId,
        { isActive },
        { new: true }
    );

    if (!track) {
        throw new Error('Track not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}

/**
 * Update belt order
 */
export async function updateBeltOrder(beltId: string, newOrder: number) {
    await requireSuperAdmin();
    await connectToDatabase();

    const belt = await Belt.findByIdAndUpdate(
        beltId,
        { order: newOrder },
        { new: true }
    );

    if (!belt) {
        throw new Error('Belt not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}

/**
 * Update belt minimum score to start
 */
export async function updateBeltMinScore(beltId: string, minScore: number) {
    await requireSuperAdmin();
    await connectToDatabase();

    const belt = await Belt.findByIdAndUpdate(
        beltId,
        { minScoreToStart: minScore },
        { new: true }
    );

    if (!belt) {
        throw new Error('Belt not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}

/**
 * Create a new belt
 */
export async function createBelt(data: {
    trackId: string;
    nameEn: string;
    nameAr: string;
    code: string;
    order: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
    minScoreToStart?: number;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const belt = new Belt({
        trackId: data.trackId,
        name: { en: data.nameEn, ar: data.nameAr },
        code: data.code.toUpperCase(),
        order: data.order,
        basePriceEGP: data.basePriceEGP,
        basePriceUSD: data.basePriceUSD,
        packageLevel: data.packageLevel,
        minScoreToStart: data.minScoreToStart,
    });

    await belt.save();

    revalidatePath('/en/admin/curriculum');

    return { success: true, beltId: belt._id.toString() };
}

/**
 * Update a belt
 */
export async function updateBelt(beltId: string, data: {
    nameEn?: string;
    nameAr?: string;
    code?: string;
    order?: number;
    minScoreToStart?: number;
    packageLevel?: string;
}) {
    await requireSuperAdmin();
    await connectToDatabase();

    const updateData: Record<string, unknown> = {};
    if (data.nameEn) updateData['name.en'] = data.nameEn;
    if (data.nameAr) updateData['name.ar'] = data.nameAr;
    if (data.code) updateData['code'] = data.code.toUpperCase();
    if (data.order !== undefined) updateData['order'] = data.order;
    if (data.minScoreToStart !== undefined) updateData['minScoreToStart'] = data.minScoreToStart;
    if (data.packageLevel) updateData['packageLevel'] = data.packageLevel;

    const belt = await Belt.findByIdAndUpdate(
        beltId,
        { $set: updateData },
        { new: true }
    );

    if (!belt) {
        throw new Error('Belt not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}

/**
 * Delete a belt
 */
export async function deleteBelt(beltId: string) {
    await requireSuperAdmin();
    await connectToDatabase();

    const result = await Belt.findByIdAndDelete(beltId);

    if (!result) {
        throw new Error('Belt not found');
    }

    revalidatePath('/en/admin/curriculum');

    return { success: true };
}
