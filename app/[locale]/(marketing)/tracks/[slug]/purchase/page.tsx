import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import TrackPurchaseForm from '@/components/payment/TrackPurchaseForm';
import { getLocalizedValue, Locale } from '@/lib/localization';

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

import Track from '@/lib/models/Track';

async function getBeltData(beltId: string, slug: string, locale: Locale) {
    await connectToDatabase();

    const belt = await Belt.findById(beltId);
    const track = await Track.findOne({ slug });

    if (!belt) {
        return null;
    }

    // Get track name from slug lookup
    let trackName = 'Unknown Track';
    if (track) {
        trackName = getLocalizedValue(track.name, locale);
    }

    // Get localized belt name and description
    const beltName = getLocalizedValue(belt.name, locale);
    const beltDescription = belt.description ? getLocalizedValue(belt.description, locale) : '';

    return {
        _id: belt._id.toString(),
        name: beltName,
        code: belt.code,
        description: beltDescription,
        basePriceEGP: belt.basePriceEGP,
        basePriceUSD: belt.basePriceUSD,
        trackName,
    };
}

export default async function PurchasePage({ params, searchParams }: PurchasePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { beltId, currency = 'EGP' } = resolvedSearchParams;
    const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'en') as Locale;

    if (!beltId) {
        notFound();
    }

    const belt = await getBeltData(beltId, resolvedParams.slug, locale);

    if (!belt) {
        notFound();
    }

    // Calculate price based on currency
    const amount = currency === 'EGP' ? belt.basePriceEGP : belt.basePriceUSD;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <style>{`
                .purchase-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    font-size: 0.875rem;
                    margin-bottom: 2rem;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: #fff;
                }
                .page-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }
                .belt-highlight {
                    background: linear-gradient(135deg, #a855f7, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .page-subtitle {
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 2rem;
                }
                .loading-skeleton {
                    background: rgba(255,255,255,0.05);
                    border-radius: 1rem;
                    padding: 2rem;
                }
                .skeleton-line {
                    height: 1rem;
                    background: rgba(255,255,255,0.1);
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                    animation: pulse 1.5s ease-in-out infinite;
                }
                .skeleton-line.short {
                    width: 60%;
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
                    {locale === 'ar' ? 'العودة للأسعار' : 'Back to Pricing'}
                </a>

                <h1 className="page-title">
                    {locale === 'ar' ? 'شراء' : 'Purchase'} <span className="belt-highlight">{belt.name}</span>
                </h1>
                <p className="page-subtitle">
                    {locale === 'ar' ? `أكمل تسجيلك في ${belt.trackName}` : `Complete your enrollment in ${belt.trackName}`}
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
        </div>
    );
}

export async function generateMetadata({ params, searchParams }: PurchasePageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { beltId } = resolvedSearchParams;
    const locale = (resolvedParams.locale === 'ar' ? 'ar' : 'en') as Locale;

    if (!beltId) {
        return {
            title: locale === 'ar' ? 'شراء - مدارس NGen' : 'Purchase - NGen Schools',
        };
    }

    const belt = await getBeltData(beltId, resolvedParams.slug, locale);

    if (!belt) {
        return {
            title: locale === 'ar' ? 'شراء - مدارس NGen' : 'Purchase - NGen Schools',
        };
    }

    return {
        title: locale === 'ar'
            ? `شراء ${belt.name} - مدارس NGen`
            : `Purchase ${belt.name} - NGen Schools`,
        description: locale === 'ar'
            ? `أكمل تسجيلك في حزام ${belt.name} في مدارس NGen.`
            : `Complete your enrollment for the ${belt.name} belt course at NGen Schools.`,
    };
}
