'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { updatePackageDiscount, togglePricingConfigActive } from '@/lib/actions/admin/pricingActions';

interface PricingConfig {
    id: string;
    configType: string;
    name: { en: string; ar: string };
    packageLevel?: string;
    discountPercentEGP: number;
    discountPercentUSD: number;
    fixedPriceEGP?: number;
    fixedPriceUSD?: number;
    belts?: string[];
    isActive: boolean;
}

interface PackageConfigRowProps {
    config: PricingConfig;
    showLevel?: boolean;
}

export default function PackageConfigRow({ config, showLevel = true }: PackageConfigRowProps) {
    const [discountEGP, setDiscountEGP] = useState(config.discountPercentEGP);
    const [discountUSD, setDiscountUSD] = useState(config.discountPercentUSD);
    const [isActive, setIsActive] = useState(config.isActive);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const handleEGPChange = (value: string) => {
        const num = parseFloat(value) || 0;
        setDiscountEGP(num);
        setHasChanges(num !== config.discountPercentEGP || discountUSD !== config.discountPercentUSD);
    };

    const handleUSDChange = (value: string) => {
        const num = parseFloat(value) || 0;
        setDiscountUSD(num);
        setHasChanges(discountEGP !== config.discountPercentEGP || num !== config.discountPercentUSD);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updatePackageDiscount(config.id, discountEGP, discountUSD);
            setHasChanges(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to update discount:', error);
            alert('Failed to update discount');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async () => {
        setIsLoading(true);
        try {
            await togglePricingConfigActive(config.id, !isActive);
            setIsActive(!isActive);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle status:', error);
            alert('Failed to toggle status');
        } finally {
            setIsLoading(false);
        }
    };

    const levelColors: Record<string, string> = {
        'pre-foundation': 'text-gray-400',
        'foundation': 'text-blue-400',
        'specialization': 'text-purple-400',
        'advanced': 'text-orange-400',
    };

    return (
        <tr className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
            <td className="py-3 px-4">
                <span className="text-white">{config.name.en}</span>
            </td>
            {showLevel && (
                <td className="py-3 px-4">
                    <span className={`text-sm capitalize ${levelColors[config.packageLevel || ''] || 'text-gray-400'}`}>
                        {config.packageLevel?.replace('-', ' ') || '-'}
                    </span>
                </td>
            )}
            <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={discountEGP}
                        onChange={(e) => handleEGPChange(e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                        max="100"
                        step="1"
                    />
                    <span className="text-gray-500 text-sm">%</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={discountUSD}
                        onChange={(e) => handleUSDChange(e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                        max="100"
                        step="1"
                    />
                    <span className="text-gray-500 text-sm">%</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <button
                    onClick={handleToggleActive}
                    disabled={isLoading}
                    className={`flex items-center gap-1 text-sm ${isActive ? 'text-green-400' : 'text-gray-500'}`}
                >
                    {isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    <span>{isActive ? 'Active' : 'Inactive'}</span>
                </button>
            </td>
            <td className="py-3 px-4">
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isLoading}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${hasChanges
                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isLoading ? (
                        <RefreshCw size={14} className="animate-spin" />
                    ) : (
                        <Save size={14} />
                    )}
                    <span>Save</span>
                </button>
            </td>
        </tr>
    );
}
