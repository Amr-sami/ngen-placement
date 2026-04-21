/**
 * Production guard for seed / migration scripts.
 *
 * Refuses to run when NODE_ENV === 'production' unless ALLOW_PROD_SEED=1 is
 * explicitly set. Prevents an operator from running a dev seed against a live
 * database by mistake (especially scripts like seed.ts that overwrite existing
 * pricing / belt rows).
 *
 * Call this at the top of any script that writes to the database and isn't
 * explicitly safe for production (i.e. isn't purely idempotent).
 */
export function assertNotProduction(scriptName: string): void {
    const env = process.env.NODE_ENV;
    const override = process.env.ALLOW_PROD_SEED === '1';

    if (env === 'production' && !override) {
        console.error(
            `❌ Refusing to run ${scriptName} with NODE_ENV=production.\n` +
            '   If you really intend to run this against production, set\n' +
            '   ALLOW_PROD_SEED=1 in the same command. Read the script first.'
        );
        process.exit(1);
    }

    if (env === 'production' && override) {
        console.warn(
            `⚠️  Running ${scriptName} with NODE_ENV=production and ALLOW_PROD_SEED=1.\n` +
            '   You are about to modify a production database.'
        );
    }
}
