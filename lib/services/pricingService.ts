import Belt from '@/lib/models/Belt';
import PricingConfig from '@/lib/models/PricingConfig';
import User from '@/lib/models/User';
import { isEgypt } from '@/lib/geoLocation';
import { PricingResponse, BeltPricing, PackagePricing, PackageBeltInfo } from '@/app/api/pricing/route';
import connectDB from '@/lib/mongodb';
import { getLocalizedValue, Locale } from '@/lib/localization';

// Re-exporting interfaces here for clarity if needed, or keeping them in route.ts and importing
export class PricingService {

    static async getPricingForUser(
        email: string | null | undefined,
        countryCode: string,
        locale: Locale = 'en'
    ): Promise<PricingResponse> {
        await connectDB();

        // 1. Authenticate & Get User Context
        const isAuthenticated = !!email;
        let userPlacementTest = null;

        if (isAuthenticated && email) {
            const user = await User.findOne({ email })
                .select('placementTest')
                .lean();
            userPlacementTest = user?.placementTest;
        }

        const hasTakenTest = !!(userPlacementTest?.hasTakenAnyPlacementTest && userPlacementTest?.resultBeltName);
        const recommendedBelt = userPlacementTest?.resultBeltName || '';

        // 2. Determine Currency & Fields
        const currency = isEgypt(countryCode) ? 'EGP' : 'USD';
        const priceField = currency === 'EGP' ? 'basePriceEGP' : 'basePriceUSD';
        const discountField = currency === 'EGP' ? 'discountPercentEGP' : 'discountPercentUSD';
        const fixedPriceField = currency === 'EGP' ? 'fixedPriceEGP' : 'fixedPriceUSD';

        // 3. Fetch Data
        const belts = await Belt.find({}).sort({ order: 1 }).lean();
        // Fetch ALL configs (including inactive) to determine enabled status
        const allPricingConfigs = await PricingConfig.find({}).lean();

        // 4. Process Unique Belts
        // Belts are globally unique now, no need to deduplicate.
        const uniqueBelts = belts;

        // 5. Option 1: Per Belt
        const perBeltConfig = allPricingConfigs.find(c => c.configType === 'perBelt');
        const perBeltEnabled = perBeltConfig?.isActive ?? true; // Default to enabled if not found
        const perBeltDiscount = perBeltConfig && perBeltConfig.isActive ? (perBeltConfig[discountField] as number) : 50;

        // Helper to get localized belt name
        const getBeltName = (belt: typeof uniqueBelts[0]): string => {
            return getLocalizedValue(belt.name, locale);
        };

        // Filter out belts that are not enabled for individual sales
        let option1Belts: BeltPricing[] = uniqueBelts
            .filter(belt => belt.salesEnabled !== false)
            .map(belt => {
                const basePrice = (belt[priceField] as number) || 0;
                const finalPrice = Math.round(basePrice * (1 - perBeltDiscount / 100));
                return {
                    belt: getBeltName(belt),
                    code: belt.code.toLowerCase(),
                    order: belt.order,
                    packageLevel: belt.packageLevel,
                    basePrice,
                    finalPrice,
                    beltId: String(belt._id),
                };
            });

        // Filter logic for recommended belt
        let recommendedPackageLevel = '';
        let recommendedBeltOrder = 0;

        if (hasTakenTest && recommendedBelt) {
            const matchedBelt = option1Belts.find(
                b => b.belt.toLowerCase() === recommendedBelt.toLowerCase() ||
                    b.belt.toLowerCase().includes(recommendedBelt.toLowerCase()) ||
                    b.code === recommendedBelt.toLowerCase().replace(' belt', '').trim()
            );
            if (matchedBelt) {
                recommendedPackageLevel = matchedBelt.packageLevel;
                recommendedBeltOrder = matchedBelt.order;
            }
        }

        if (isAuthenticated && hasTakenTest && recommendedBelt) {
            option1Belts = option1Belts.filter(
                b => b.belt.toLowerCase() === recommendedBelt.toLowerCase() ||
                    b.belt.toLowerCase().includes(recommendedBelt.toLowerCase()) ||
                    b.code === recommendedBelt.toLowerCase().replace(' belt', '').trim()
            );
        }

        const option1Total = option1Belts.reduce((sum, b) => sum + b.finalPrice, 0);

        // 6. Option 2: Packages
        const packageConfigs = allPricingConfigs.filter(c => c.configType === 'package');
        let option2Packages: PackagePricing[] = packageConfigs.map(config => {
            const configBeltCodes = (config.belts || []).map((b: string) => b.toUpperCase());
            const packageBelts = configBeltCodes.length > 0
                ? uniqueBelts.filter(b => configBeltCodes.includes(b.code.toUpperCase()))
                : uniqueBelts.filter(b => b.packageLevel === config.packageLevel);

            packageBelts.sort((a, b) => a.order - b.order);

            const baseTotal = packageBelts.reduce((sum, b) => sum + ((b[priceField] as number) || 0), 0);
            const fixedPrice = config[fixedPriceField] as number | undefined;
            const discountPercent = config[discountField] as number;
            const finalPrice = fixedPrice || Math.round(baseTotal * (1 - discountPercent / 100));

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
                    name: getBeltName(b),
                    code: b.code.toLowerCase(),
                    order: b.order,
                    price: beltPrice,
                    status,
                };
            });

            const passedBelts = beltInfoList.filter(b => b.status === 'passed');
            const remainingBelts = beltInfoList.filter(b => b.status !== 'passed');
            const skippedBeltsValue = passedBelts.reduce((sum, b) => sum + b.price, 0);
            const adjustedBaseTotal = baseTotal - skippedBeltsValue;
            const adjustedFinalPrice = Math.round(adjustedBaseTotal * (1 - discountPercent / 100));
            const showAsSingleBelt = remainingBelts.length === 1;

            // Get localized package name
            const packageName = getLocalizedValue(config.name, locale);

            return {
                name: packageName,
                packageLevel: config.packageLevel || '',
                enabled: config.isActive, // NEW: Package enabled status
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

        if (isAuthenticated && hasTakenTest && recommendedPackageLevel) {
            option2Packages = option2Packages.filter(
                p => p.packageLevel === recommendedPackageLevel
            );
        }

        // 7. Option 3: Organization
        const orgConfig = allPricingConfigs.find(c => c.configType === 'organization');
        const orgEnabled = orgConfig?.isActive ?? true;
        const orgName = orgConfig
            ? getLocalizedValue(orgConfig.name, locale)
            : (locale === 'ar' ? 'المؤسسات / المدارس' : 'Organizations / Schools');

        return {
            currency,
            countryCode,
            option1_perBelt: {
                enabled: perBeltEnabled,
                discountPercent: perBeltDiscount,
                belts: option1Belts,
                total: option1Total,
            },
            option2_packages: option2Packages,
            option3_organization: {
                enabled: orgEnabled,
                name: orgName,
                contactUs: true,
                hidden: isAuthenticated,
            },
            userContext: {
                isAuthenticated,
                hasTakenTest,
                recommendedBelt: hasTakenTest ? recommendedBelt : undefined,
                recommendedBeltCode: hasTakenTest ? recommendedBelt.toLowerCase().replace(' belt', '').trim() : undefined,
                recommendedPackageLevel: hasTakenTest ? recommendedPackageLevel : undefined,
            },
        };
    }
}
