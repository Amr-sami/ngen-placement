import { markReady } from './lib/readiness';

/**
 * Next.js instrumentation hook. Runs once when the server module initializes.
 * Sibling repo indexes: PricingConfig (partial-unique active tuple),
 * PlacementTest (leadTokenHash lookup + select:false on generatedQuestions).
 *
 * If index sync fails we do NOT mark ready — the orchestrator keeps the pod
 * out of rotation until the next restart succeeds. Silently serving traffic
 * without the partial-unique pricing index or without the lead-token index
 * would let duplicates land and break guest→user attribution.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const { default: connectToDatabase } = await import('./lib/mongodb');
            const { default: PricingConfig } = await import('./lib/models/PricingConfig');
            const { default: PlacementTest } = await import('./lib/models/PlacementTest');
            await connectToDatabase();
            await Promise.all([
                PricingConfig.syncIndexes(),
                PlacementTest.syncIndexes(),
            ]);
        } catch (err) {
            console.error('[instrumentation] index sync failed — pod will stay NOT READY:', err);
            return;
        }
    }
    markReady();
}
