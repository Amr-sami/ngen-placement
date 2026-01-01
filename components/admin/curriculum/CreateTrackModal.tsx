'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';
import { createTrack } from '@/lib/actions/admin/curriculumActions';

export default function CreateTrackModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        slug: '',
        descriptionEn: '',
        descriptionAr: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from English name
        if (name === 'nameEn') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, '')
                .replace(/\s+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await createTrack(formData);
            setIsOpen(false);
            setFormData({
                nameEn: '',
                nameAr: '',
                slug: '',
                descriptionEn: '',
                descriptionAr: '',
            });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create track');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
                <Plus size={18} />
                Create Track
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Track</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* English Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Name (English) *
                                </label>
                                <input
                                    type="text"
                                    name="nameEn"
                                    value={formData.nameEn}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                    placeholder="e.g. Programming"
                                />
                            </div>

                            {/* Arabic Name */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Name (Arabic) *
                                </label>
                                <input
                                    type="text"
                                    name="nameAr"
                                    value={formData.nameAr}
                                    onChange={handleInputChange}
                                    required
                                    dir="rtl"
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                    placeholder="مثال: البرمجة"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Slug (URL-friendly) *
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono text-sm"
                                    placeholder="programming"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-generated from English name. Must be unique.
                                </p>
                            </div>

                            {/* Description English */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Description (English)
                                </label>
                                <textarea
                                    name="descriptionEn"
                                    value={formData.descriptionEn}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                                    placeholder="Brief description of this track..."
                                />
                            </div>

                            {/* Description Arabic */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">
                                    Description (Arabic)
                                </label>
                                <textarea
                                    name="descriptionAr"
                                    value={formData.descriptionAr}
                                    onChange={handleInputChange}
                                    rows={2}
                                    dir="rtl"
                                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                                    placeholder="وصف موجز لهذا المسار..."
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-lg transition-colors font-medium"
                                >
                                    {isLoading ? 'Creating...' : 'Create Track'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
