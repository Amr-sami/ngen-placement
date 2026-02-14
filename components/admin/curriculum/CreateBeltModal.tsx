'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { PackageLevel } from './types';

interface CreateBeltFormData {
    nameEn: string;
    nameAr: string;
    code: string;
    order: number;
    packageLevel: PackageLevel;
    basePriceEGP: number;
    basePriceUSD: number;
    minScoreToStart: number;
}

interface CreateBeltModalProps {
    trackId: string;
    nextOrder: number;
    onClose: () => void;
    onSave: (data: {
        trackId: string;
        nameEn: string;
        nameAr: string;
        code: string;
        order: number;
        packageLevel: PackageLevel;
        basePriceEGP: number;
        basePriceUSD: number;
        minScoreToStart?: number;
    }) => Promise<void>;
}

export default function CreateBeltModal({ trackId, nextOrder, onClose, onSave }: CreateBeltModalProps) {
    const [formData, setFormData] = useState<CreateBeltFormData>({
        nameEn: '',
        nameAr: '',
        code: '',
        order: nextOrder,
        packageLevel: 'foundation',
        basePriceEGP: 1000,
        basePriceUSD: 30,
        minScoreToStart: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave({
            trackId,
            ...formData,
        });
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Add New Belt</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name (English) *</label>
                            <input
                                type="text"
                                value={formData.nameEn}
                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                required
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name (Arabic) *</label>
                            <input
                                type="text"
                                value={formData.nameAr}
                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                required
                                dir="rtl"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                                required
                                placeholder="e.g., white, yellow"
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Order *</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                required
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Package Level *</label>
                        <select
                            value={formData.packageLevel}
                            onChange={(e) => setFormData({ ...formData, packageLevel: e.target.value as PackageLevel })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        >
                            <option value="pre-foundation">Pre-Foundation</option>
                            <option value="foundation">Foundation</option>
                            <option value="specialization">Specialization</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price (EGP) *</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.basePriceEGP}
                                onChange={(e) => setFormData({ ...formData, basePriceEGP: parseInt(e.target.value) || 0 })}
                                required
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Price (USD) *</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.basePriceUSD}
                                onChange={(e) => setFormData({ ...formData, basePriceUSD: parseInt(e.target.value) || 0 })}
                                required
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Min Score to Start (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.minScoreToStart}
                            onChange={(e) => setFormData({ ...formData, minScoreToStart: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg"
                        >
                            {isLoading ? 'Creating...' : 'Create Belt'}
                        </button>
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-700 text-gray-300 rounded-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
