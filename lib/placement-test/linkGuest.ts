import PlacementTest from '@/lib/models/PlacementTest';
import { hashLeadToken, parseLeadTokenFromHeader } from './leadToken';

export interface GuestLinkResult {
    linked: number;
    hadToken: boolean;
}

/**
 * Claims every orphan PlacementTest row (userId: null) that matches the
 * lead-token cookie for the given user. Safe to call even when no cookie
 * is present — returns `{ linked: 0, hadToken: false }`.
 *
 * Never overwrites an already-owned row. Only rows with `userId: null` and a
 * matching `leadTokenHash` are claimed, so a stale or replayed cookie cannot
 * hijack someone else's results.
 */
export async function linkGuestPlacementTests(
    userId: string,
    cookieHeader: string | null
): Promise<GuestLinkResult> {
    const token = parseLeadTokenFromHeader(cookieHeader);
    if (!token) {
        return { linked: 0, hadToken: false };
    }

    const tokenHash = hashLeadToken(token);
    const update = await PlacementTest.updateMany(
        { leadTokenHash: tokenHash, userId: null },
        { $set: { userId } }
    );

    return { linked: update.modifiedCount, hadToken: true };
}
