'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { updateBeltPrice, toggleBeltSales } from '@/lib/actions/admin/pricingActions';

interface Belt {
    id: string;
    name: { en: string; ar: string };
    code: string;
    order: number;
    basePriceEGP: number;
    basePriceUSD: number;
    packageLevel: string;
    salesEnabled: boolean;
}

interface BeltPriceRowProps {
    belt: Belt;
}

export default function BeltPriceRow({ belt }: BeltPriceRowProps) {
    const [priceEGP, setPriceEGP] = useState(belt.basePriceEGP);
    const [priceUSD, setPriceUSD] = useState(belt.basePriceUSD);
    const [enabled, setEnabled] = useState(belt.salesEnabled);
    const [isLoading, setIsLoading] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const router = useRouter();

    const handleEGPChange = (value: string) => {
        const num = parseFloat(value) || 0;
        setPriceEGP(num);
        setHasChanges(num !== belt.basePriceEGP || priceUSD !== belt.basePriceUSD);
    };

    const handleUSDChange = (value: string) => {
        const num = parseFloat(value) || 0;
        setPriceUSD(num);
        setHasChanges(priceEGP !== belt.basePriceEGP || num !== belt.basePriceUSD);
    };

    const handleToggleEnabled = async () => {
        setIsToggling(true);
        try {
            await toggleBeltSales(belt.id, !enabled);
            setEnabled(!enabled);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle sales:', error);
            alert('Failed to toggle sales status');
        } finally {
            setIsToggling(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateBeltPrice(belt.id, priceEGP, priceUSD);
            setHasChanges(false);
            router.refresh();
        } catch (error) {
            console.error('Failed to update price:', error);
            alert('Failed to update price');
        } finally {
            setIsLoading(false);
        }
    };

    const packageLevelColors: Record<string, string> = {
        'pre-foundation': 'bg-gray-500',
        'foundation': 'bg-blue-500',
        'specialization': 'bg-purple-500',
        'advanced': 'bg-orange-500',
    };

    return (
        <tr className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${packageLevelColors[belt.packageLevel] || 'bg-gray-500'}`} />
                    <span className="text-white">{belt.name.en}</span>
                    <span className="text-gray-500 text-xs">({belt.code})</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <span className="text-gray-400 text-sm capitalize">{belt.packageLevel.replace('-', ' ')}</span>
            </td>
            <td className="py-3 px-4">
                <button
                    onClick={handleToggleEnabled}
                    disabled={isToggling}
                    className={`transition-colors ${enabled ? 'text-green-400 hover:text-green-300' : 'text-gray-600 hover:text-gray-500'}`}
                    title={enabled ? 'Sales Enabled' : 'Sales Disabled'}
                >
                    {isToggling ? (
                        <RefreshCw size={24} className="animate-spin text-gray-400" />
                    ) : enabled ? (
                        <ToggleRight size={28} />
                    ) : (
                        <ToggleLeft size={28} />
                    )}
                </button>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={priceEGP}
                        onChange={(e) => handleEGPChange(e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                        step="1"
                    />
                    <span className="text-gray-500 text-sm">EGP</span>
                </div>
            </td>
            <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={priceUSD}
                        onChange={(e) => handleUSDChange(e.target.value)}
                        className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                        min="0"
                        step="0.01"
                    />
                    <span className="text-gray-500 text-sm">USD</span>
                </div>
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
