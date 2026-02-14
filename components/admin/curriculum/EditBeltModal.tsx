'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import type { Belt } from './types';

interface EditBeltModalProps {
    belt: Belt;
    onClose: () => void;
    onSave: (data: { nameEn?: string; nameAr?: string; minScoreToStart?: number }) => Promise<void>;
}

export default function EditBeltModal({ belt, onClose, onSave }: EditBeltModalProps) {
    const [formData, setFormData] = useState({
        nameEn: belt.name.en,
        nameAr: belt.name.ar,
        minScoreToStart: belt.minScoreToStart || 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onSave(formData);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Edit Belt</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name (English)</label>
                        <input
                            type="text"
                            value={formData.nameEn}
                            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name (Arabic)</label>
                        <input
                            type="text"
                            value={formData.nameAr}
                            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                            dir="rtl"
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
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
                            {isLoading ? 'Saving...' : 'Save Changes'}
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
