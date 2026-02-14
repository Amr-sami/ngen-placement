'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCreateTrackForm } from './hooks/useCreateTrackForm';
import { AdminInput } from '../ui/AdminInput';
import { AdminTextarea } from '../ui/AdminTextarea';

export default function CreateTrackModal() {
    const [isOpen, setIsOpen] = useState(false);
    const { formData, isLoading, error, handleInputChange, handleSubmit, resetForm } = useCreateTrackForm(() => setIsOpen(false));

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
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
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-gray-800 rounded-xl border border-gray-700 w-full max-w-lg mx-4 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Track</h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AdminInput
                                label="Name (English)"
                                name="nameEn"
                                value={formData.nameEn}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Programming"
                            />

                            <AdminInput
                                label="Name (Arabic)"
                                name="nameAr"
                                value={formData.nameAr}
                                onChange={handleInputChange}
                                required
                                dir="rtl"
                                placeholder="مثال: البرمجة"
                            />

                            <div>
                                <AdminInput
                                    label="Slug (URL-friendly)"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    className="font-mono text-sm"
                                    placeholder="programming"
                                />
                                <p className="text-xs text-gray-500 mt-1 pl-1">
                                    Auto-generated from English name. Must be unique.
                                </p>
                            </div>

                            <AdminTextarea
                                label="Description (English)"
                                name="descriptionEn"
                                value={formData.descriptionEn}
                                onChange={handleInputChange}
                                rows={2}
                                placeholder="Brief description of this track..."
                            />

                            <AdminTextarea
                                label="Description (Arabic)"
                                name="descriptionAr"
                                value={formData.descriptionAr}
                                onChange={handleInputChange}
                                rows={2}
                                dir="rtl"
                                placeholder="وصف موجز لهذا المسار..."
                            />

                            {/* Global Error */}
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
                                    onClick={handleClose}
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
