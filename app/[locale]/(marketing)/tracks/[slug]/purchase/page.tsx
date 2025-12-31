import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import TrackPurchaseForm from '@/components/payment/TrackPurchaseForm';

interface PurchasePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
    searchParams: Promise<{
        beltId?: string;
        currency?: string;
    }>;
}

/**
 * Belt/Track Purchase Page
 * 
 * URL: /[locale]/tracks/[slug]/purchase?beltId=xxx&currency=EGP
 * 
 * This page displays the purchase form for a specific belt.
 */

interface PopulatedTrack {
    _id: string;
    name: string;
}

async function getBeltData(beltId: string) {
    await connectToDatabase();

    const belt = await Belt.findById(beltId).populate('trackId');

    if (!belt) {
        return null;
    }

    // Get track name from populated trackId
    let trackName = 'Unknown Track';
    if (belt.trackId && typeof belt.trackId === 'object' && 'name' in belt.trackId) {
        trackName = (belt.trackId as unknown as PopulatedTrack).name;
    }

    return {
        _id: belt._id.toString(),
        name: belt.name,
        code: belt.code,
        description: belt.description,
        basePriceEGP: belt.basePriceEGP,
        basePriceUSD: belt.basePriceUSD,
        trackName,
    };
}

export default async function PurchasePage({ params, searchParams }: PurchasePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { beltId, currency = 'EGP' } = resolvedSearchParams;
    const { locale } = resolvedParams;

    // Belt ID is required
    if (!beltId) {
        notFound();
    }

    const belt = await getBeltData(beltId);

    if (!belt) {
        notFound();
    }

    const amount = currency === 'USD' ? belt.basePriceUSD : belt.basePriceEGP;

    return (
        <div className="purchase-page">
            <style>{`
                .purchase-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    padding: 40px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .purchase-container {
                    width: 100%;
                    max-width: 600px;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #a0aec0;
                    text-decoration: none;
                    font-size: 14px;
                    margin-bottom: 24px;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: #ff6b35;
                }

                .page-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #ffffff;
                    text-align: center;
                    margin-bottom: 8px;
                }

                .page-subtitle {
                    font-size: 16px;
                    color: #a0aec0;
                    text-align: center;
                    margin-bottom: 40px;
                }

                .belt-highlight {
                    color: #ff6b35;
                }

                .loading-skeleton {
                    max-width: 480px;
                    margin: 0 auto;
                    padding: 32px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    animation: pulse 2s infinite;
                }

                .skeleton-line {
                    height: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    margin-bottom: 16px;
                }

                .skeleton-line.short {
                    width: 60%;
                }

                .skeleton-button {
                    height: 56px;
                    background: rgba(255, 107, 53, 0.2);
                    border-radius: 12px;
                    margin-top: 24px;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>

            <div className="purchase-container">
                <a href={`/${locale}/pricing`} className="back-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Pricing
                </a>

                <h1 className="page-title">
                    Purchase <span className="belt-highlight">{belt.name}</span>
                </h1>
                <p className="page-subtitle">
                    Complete your enrollment in {belt.trackName}
                </p>

                <Suspense fallback={<PurchaseFormSkeleton />}>
                    <TrackPurchaseForm
                        beltId={belt._id}
                        beltName={belt.name}
                        amount={amount}
                        currency={currency}
                    />
                </Suspense>
            </div>
        </div>
    );
}

function PurchaseFormSkeleton() {
    return (
        <div className="loading-skeleton">
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
            <div className="skeleton-button" />
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: PurchasePageProps) {
    const resolvedSearchParams = await searchParams;
    const { beltId } = resolvedSearchParams;

    if (!beltId) {
        return {
            title: 'Purchase - NGen Schools',
        };
    }

    try {
        const belt = await getBeltData(beltId);

        if (belt) {
            return {
                title: `Purchase ${belt.name} - NGen Schools`,
                description: `Complete your enrollment for the ${belt.name} belt course at NGen Schools.`,
            };
        }
    } catch {
        // Return default if error
    }

    return {
        title: 'Purchase - NGen Schools',
    };
}
