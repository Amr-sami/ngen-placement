import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';
import connectDB from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import PricingConfig from '@/lib/models/PricingConfig';
import User from '@/lib/models/User';
import { getIPFromHeaders, getCountryFromIP, isEgypt } from '@/lib/geoLocation';

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
        await connectDB();

        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        const isAuthenticated = !!session?.user?.email;

        // Fetch user's placement test result if authenticated
        let userPlacementTest = null;
        if (isAuthenticated && session?.user?.email) {
            const user = await User.findOne({ email: session.user.email })
                .select('placementTest')
                .lean();
            userPlacementTest = user?.placementTest;
        }

        const hasTakenTest = !!(userPlacementTest?.hasTakenAnyPlacementTest && userPlacementTest?.resultBeltName);
        const recommendedBelt = userPlacementTest?.resultBeltName || '';

        // Detect country from query param or IP
        const searchParams = request.nextUrl.searchParams;
        let countryCode = searchParams.get('country')?.toUpperCase() || '';

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

        // Determine currency
        const currency = isEgypt(countryCode) ? 'EGP' : 'USD';
        const priceField = currency === 'EGP' ? 'basePriceEGP' : 'basePriceUSD';
        const discountField = currency === 'EGP' ? 'discountPercentEGP' : 'discountPercentUSD';
        const fixedPriceField = currency === 'EGP' ? 'fixedPriceEGP' : 'fixedPriceUSD';

        // Fetch all belts sorted by order (get enough to cover all unique belt types)
        const belts = await Belt.find({}).sort({ order: 1 }).lean();

        // Get unique belts by code (one per belt level - we have 10 belt types across 6 tracks = 60 belts)
        const uniqueBelts = belts.reduce((acc, belt) => {
            const code = belt.code.toUpperCase();
            if (!acc.find(b => b.code.toUpperCase() === code)) {
                acc.push(belt);
            }
            return acc;
        }, [] as typeof belts);

        // Fetch pricing configs
        const pricingConfigs = await PricingConfig.find({ isActive: true }).lean();

        // Get per-belt discount
        const perBeltConfig = pricingConfigs.find(c => c.configType === 'perBelt');
        const perBeltDiscount = perBeltConfig ? (perBeltConfig[discountField] as number) : 50;

        // Build Option 1: Per Belt pricing
        let option1Belts: BeltPricing[] = uniqueBelts.map(belt => {
            const basePrice = (belt[priceField] as number) || 0;
            const finalPrice = Math.round(basePrice * (1 - perBeltDiscount / 100));
            return {
                belt: belt.name,
                code: belt.code.toLowerCase(),
                order: belt.order,
                packageLevel: belt.packageLevel,
                basePrice,
                finalPrice,
            };
        });

        // Determine the recommended belt's package level and order
        let recommendedPackageLevel = '';
        let recommendedBeltOrder = 0;
        if (hasTakenTest && recommendedBelt) {
            const matchedBelt = option1Belts.find(
                b => b.belt.toLowerCase() === recommendedBelt.toLowerCase() ||
                    b.belt.toLowerCase().includes(recommendedBelt.toLowerCase())
            );
            if (matchedBelt) {
                recommendedPackageLevel = matchedBelt.packageLevel;
                recommendedBeltOrder = matchedBelt.order;
            }
        }

        // If authenticated user with test result, filter to only their recommended belt
        if (isAuthenticated && hasTakenTest && recommendedBelt) {
            option1Belts = option1Belts.filter(
                b => b.belt.toLowerCase() === recommendedBelt.toLowerCase() ||
                    b.belt.toLowerCase().includes(recommendedBelt.toLowerCase())
            );
        }

        const option1Total = option1Belts.reduce((sum, b) => sum + b.finalPrice, 0);

        // Build Option 2: Packages with progressive pricing
        const packageConfigs = pricingConfigs.filter(c => c.configType === 'package');
        let option2Packages: PackagePricing[] = packageConfigs.map(config => {
            // Match belts by the codes stored in the config
            const configBeltCodes = (config.belts || []).map((b: string) => b.toUpperCase());

            // If no specific belts, match by packageLevel
            const packageBelts = configBeltCodes.length > 0
                ? uniqueBelts.filter(b => configBeltCodes.includes(b.code.toUpperCase()))
                : uniqueBelts.filter(b => b.packageLevel === config.packageLevel);

            // Sort by order to ensure correct progression
            packageBelts.sort((a, b) => a.order - b.order);

            const baseTotal = packageBelts.reduce((sum, b) => sum + ((b[priceField] as number) || 0), 0);
            const fixedPrice = config[fixedPriceField] as number | undefined;
            const discountPercent = config[discountField] as number;
            const finalPrice = fixedPrice || Math.round(baseTotal * (1 - discountPercent / 100));

            // Build belt info with status for authenticated users
            const beltInfoList: PackageBeltInfo[] = packageBelts.map(b => {
                const beltPrice = (b[priceField] as number) || 0;
                let status: 'available' | 'passed' | 'starting' = 'available';

                if (isAuthenticated && hasTakenTest && recommendedBeltOrder > 0) {
                    if (b.order < recommendedBeltOrder) {
                        status = 'passed';
                    } else if (b.order === recommendedBeltOrder) {
                        status = 'starting';
                    }
                }

                return {
                    name: b.name,
                    code: b.code.toLowerCase(),
                    order: b.order,
                    price: beltPrice,
                    status,
                };
            });

            // Calculate progressive pricing
            const passedBelts = beltInfoList.filter(b => b.status === 'passed');
            const remainingBelts = beltInfoList.filter(b => b.status !== 'passed');
            const skippedBeltsValue = passedBelts.reduce((sum, b) => sum + b.price, 0);
            const adjustedBaseTotal = baseTotal - skippedBeltsValue;
            const adjustedFinalPrice = Math.round(adjustedBaseTotal * (1 - discountPercent / 100));
            const showAsSingleBelt = remainingBelts.length === 1;

            return {
                name: config.name,
                packageLevel: config.packageLevel || '',
                belts: beltInfoList,
                baseTotal,
                discountPercent,
                finalPrice,
                adjustedBaseTotal,
                adjustedFinalPrice,
                skippedBeltsValue,
                remainingBeltCount: remainingBelts.length,
                showAsSingleBelt,
            };
        });

        // If authenticated user with test result, filter to only their matching package
        if (isAuthenticated && hasTakenTest && recommendedPackageLevel) {
            option2Packages = option2Packages.filter(
                p => p.packageLevel === recommendedPackageLevel
            );
        }

        // Build Option 3: Organizations (hidden for authenticated users)
        const orgConfig = pricingConfigs.find(c => c.configType === 'organization');

        // Build user context for frontend
        const userContext = {
            isAuthenticated,
            hasTakenTest,
            recommendedBelt: hasTakenTest ? recommendedBelt : undefined,
            recommendedBeltCode: hasTakenTest ? recommendedBelt.toLowerCase().replace(' belt', '').trim() : undefined,
            recommendedPackageLevel: hasTakenTest ? recommendedPackageLevel : undefined,
        };

        const response: PricingResponse = {
            currency,
            countryCode,
            option1_perBelt: {
                discountPercent: perBeltDiscount,
                belts: option1Belts,
                total: option1Total,
            },
            option2_packages: option2Packages,
            option3_organization: {
                name: orgConfig?.name || 'Organizations / Schools',
                contactUs: true,
                hidden: isAuthenticated, // Hide for logged-in users
            },
            userContext,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Pricing API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pricing' },
            { status: 500 }
        );
    }
}
