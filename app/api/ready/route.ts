import { NextResponse } from 'next/server';
import { isReady } from '@/lib/readiness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Readiness probe. Flips to 200 only after instrumentation.ts has run, so
 * the orchestrator can hold off on sending traffic until the server has
 * finished initializing.
 */
export async function GET() {
    if (!isReady()) {
        return NextResponse.json({ status: 'warming' }, { status: 503 });
    }
    return NextResponse.json({ status: 'ready' }, { status: 200 });
}
