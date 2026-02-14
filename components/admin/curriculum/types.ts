export interface Belt {
    id: string;
    name: { en: string; ar: string };
    code: string;
    order: number;
    description?: { en: string; ar: string };
    minScoreToStart?: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: string;
}

export interface Track {
    id: string;
    name: { en: string; ar: string };
    slug: string;
    description?: { en: string; ar: string };
    isActive: boolean;
    belts: Belt[];
}

export type PackageLevel = 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';

export const PACKAGE_LEVEL_COLORS: Record<string, string> = {
    'pre-foundation': 'bg-gray-500',
    'foundation': 'bg-blue-500',
    'specialization': 'bg-purple-500',
    'advanced': 'bg-orange-500',
};
