import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';
import { getIPFromHeaders, getCountryFromIP } from '@/lib/geoLocation';
import { PricingService } from '@/lib/services/pricingService';

// Interfaces are re-exported or defined here to maintain compatibility with imports
export interface BeltPricing {
    belt: string;
    code: string;
    order: number;
    packageLevel: string;
    basePrice: number;
    finalPrice: number;
}

export interface PackageBeltInfo {
    name: string;
    code: string;
    order: number;
    price: number;
    status: 'available' | 'passed' | 'starting';
}

export interface PackagePricing {
    name: string;
    packageLevel: string;
    belts: PackageBeltInfo[];
    baseTotal: number;
    discountPercent: number;
    finalPrice: number;
    // Progressive pricing fields
    adjustedBaseTotal: number;
    adjustedFinalPrice: number;
    skippedBeltsValue: number;
    remainingBeltCount: number;
    showAsSingleBelt: boolean;
}

export interface PricingResponse {
    currency: 'EGP' | 'USD';
    countryCode: string;
    option1_perBelt: {
        discountPercent: number;
        belts: BeltPricing[];
        total: number;
    };
    option2_packages: PackagePricing[];
    option3_organization: {
        name: string;
        contactUs: boolean;
        hidden?: boolean;
    };
    userContext?: {
        isAuthenticated: boolean;
        hasTakenTest: boolean;
        recommendedBelt?: string;
        recommendedBeltCode?: string;
        recommendedPackageLevel?: string;
    };
}

export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;

        // Detect country from query param or IP
        const searchParams = request.nextUrl.searchParams;
        let countryCode = searchParams.get('country')?.toUpperCase() || '';

        // Get locale from query param (defaults to 'en')
        const locale = (searchParams.get('locale') === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

        // If no country param, detect from IP
        if (!countryCode) {
            const ip = getIPFromHeaders(request.headers);
            const geo = await getCountryFromIP(ip);
            countryCode = geo.countryCode;
        }

        // Fallback to Egypt in development (localhost can't be geolocated)
        if (countryCode === 'XX' && process.env.NODE_ENV === 'development') {
            countryCode = 'EG';
        }

        const response = await PricingService.getPricingForUser(email, countryCode, locale);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Pricing API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing' },
            { status: 500 }
        );
    }
}
