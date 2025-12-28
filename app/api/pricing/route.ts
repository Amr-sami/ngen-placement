import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Belt from '@/lib/models/Belt';
import PricingConfig from '@/lib/models/PricingConfig';
import { getIPFromHeaders, getCountryFromIP, isEgypt } from '@/lib/geoLocation';

export interface BeltPricing {
    belt: string;
    code: string;
    order: number;
    packageLevel: string;
    basePrice: number;
    finalPrice: number;
}

export interface PackagePricing {
    name: string;
    packageLevel: string;
    belts: string[];
    baseTotal: number;
    discountPercent: number;
    finalPrice: number;
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
    };
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Detect country from query param or IP
        const searchParams = request.nextUrl.searchParams;
        let countryCode = searchParams.get('country')?.toUpperCase() || '';

        // If no country param, detect from IP
        if (!countryCode) {
            const ip = getIPFromHeaders(request.headers);
            const geo = await getCountryFromIP(ip);
            countryCode = geo.countryCode;
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
        const option1Belts: BeltPricing[] = uniqueBelts.map(belt => {
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

        const option1Total = option1Belts.reduce((sum, b) => sum + b.finalPrice, 0);

        // Build Option 2: Packages
        const packageConfigs = pricingConfigs.filter(c => c.configType === 'package');
        const option2Packages: PackagePricing[] = packageConfigs.map(config => {
            // Match belts by the codes stored in the config
            const configBeltCodes = (config.belts || []).map((b: string) => b.toUpperCase());

            // If no specific belts, match by packageLevel
            const packageBelts = configBeltCodes.length > 0
                ? uniqueBelts.filter(b => configBeltCodes.includes(b.code.toUpperCase()))
                : uniqueBelts.filter(b => b.packageLevel === config.packageLevel);

            const baseTotal = packageBelts.reduce((sum, b) => sum + ((b[priceField] as number) || 0), 0);
            const fixedPrice = config[fixedPriceField] as number | undefined;
            const discountPercent = config[discountField] as number;
            const finalPrice = fixedPrice || Math.round(baseTotal * (1 - discountPercent / 100));

            return {
                name: config.name,
                packageLevel: config.packageLevel || '',
                belts: packageBelts.map(b => b.name),
                baseTotal,
                discountPercent,
                finalPrice,
            };
        });

        // Build Option 3: Organizations
        const orgConfig = pricingConfigs.find(c => c.configType === 'organization');

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
            },
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
