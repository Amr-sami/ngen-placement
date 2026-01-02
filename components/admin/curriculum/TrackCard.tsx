'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ToggleLeft, ToggleRight, GripVertical, Trash2, Edit2, Plus, X } from 'lucide-react';
import { toggleTrackActive, deleteTrack, deleteBelt, updateBelt, createBelt } from '@/lib/actions/admin/curriculumActions';
import { useRouter } from 'next/navigation';

interface Belt {
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

interface Track {
    id: string;
    name: { en: string; ar: string };
    slug: string;
    description?: { en: string; ar: string };
    isActive: boolean;
    belts: Belt[];
}

interface TrackCardProps {
    track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [editingBelt, setEditingBelt] = useState<Belt | null>(null);
    const [showCreateBelt, setShowCreateBelt] = useState(false);
    const router = useRouter();

    const handleToggleActive = async () => {
        setIsLoading('track');
        try {
            await toggleTrackActive(track.id, !track.isActive);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle track:', error);
            alert('Failed to toggle track status');
        } finally {
            setIsLoading(null);
        }
    };

    const handleDeleteTrack = async () => {
        // Since belts are global, we can delete a track without deleting belts
        const confirmed = window.confirm(
            `Are you sure you want to delete "${track.name.en}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setIsLoading('track');
        try {
            await deleteTrack(track.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete track:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete track');
        } finally {
            setIsLoading(null);
        }
    };

    const handleDeleteBelt = async (beltId: string, beltName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${beltName}"? \n\n⚠️ WARNING: This is a GLOBAL BELT. Deleting it will remove it from ALL tracks and pricing configurations across the system.`
        );

        if (!confirmed) return;

        setIsLoading(beltId);
        try {
            await deleteBelt(beltId);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete belt:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete belt');
        } finally {
            setIsLoading(null);
        }
    };

    const packageLevelColors: Record<string, string> = {
        'pre-foundation': 'bg-gray-500',
        'foundation': 'bg-blue-500',
        'specialization': 'bg-purple-500',
        'advanced': 'bg-orange-500',
    };

    return (
        <div className={`bg-gray-800 rounded-xl border transition-colors ${track.isActive ? 'border-gray-700' : 'border-red-500/30 opacity-70'
            }`}>
            {/* Track Header */}
            <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <button className="text-gray-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div>
                        <h3 className="text-white font-medium flex items-center gap-2">
                            {track.name.en}
                            {!track.isActive && (
                                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-0.5 rounded">Inactive</span>
                            )}
                        </h3>
                        <p className="text-gray-500 text-sm">{track.slug} • {track.belts.length} belts</p>
                    </div>
                </div>
                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={handleToggleActive}
                        disabled={isLoading !== null}
                        className={`flex items-center gap-1 text-sm ${track.isActive ? 'text-green-400' : 'text-gray-500'}`}
                    >
                        {track.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        <span>{track.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                    <button
                        onClick={handleDeleteTrack}
                        disabled={isLoading !== null}
                        className="flex items-center gap-1 text-sm transition-colors text-red-400 hover:text-red-300"
                        title="Delete track"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Belts List */}
            {isExpanded && (
                <div className="border-t border-gray-700">
                    {track.belts.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700/50">
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Belt</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Min Score</th>
                                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {track.belts.map((belt) => (
                                    <tr key={belt.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <GripVertical size={14} className="cursor-grab" />
                                                <span>{belt.order}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${packageLevelColors[belt.packageLevel] || 'bg-gray-500'}`} />
                                                <span className="text-white">{belt.name.en}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-gray-400 text-sm font-mono">{belt.code}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-gray-400 text-sm capitalize">{belt.packageLevel.replace('-', ' ')}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-gray-400 text-sm">
                                                {belt.minScoreToStart !== undefined ? `${belt.minScoreToStart}%` : '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span className="text-gray-400 text-sm">
                                                {belt.basePriceEGP} EGP / ${belt.basePriceUSD}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingBelt(belt)}
                                                    className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit belt"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBelt(belt.id, belt.name.en)}
                                                    disabled={isLoading === belt.id}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                                                    title="Delete belt"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No belts in this track
                        </div>
                    )}

                    {/* Add Belt Button */}
                    <div className="px-6 py-4 border-t border-gray-700/50">
                        <button
                            onClick={() => setShowCreateBelt(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Add Belt
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Belt Modal */}
            {editingBelt && (
                <EditBeltModal
                    belt={editingBelt}
                    onClose={() => setEditingBelt(null)}
                    onSave={async (data) => {
                        try {
                            await updateBelt(editingBelt.id, data);
                            router.refresh();
                            setEditingBelt(null);
                        } catch (error) {
                            alert(error instanceof Error ? error.message : 'Failed to update belt');
                        }
                    }}
                />
            )}

            {/* Create Belt Modal */}
            {showCreateBelt && (
                <CreateBeltModal
                    trackId={track.id}
                    nextOrder={track.belts.length + 1}
                    onClose={() => setShowCreateBelt(false)}
                    onSave={async (data) => {
                        try {
                            await createBelt(data);
                            router.refresh();
                            setShowCreateBelt(false);
                        } catch (error) {
                            alert(error instanceof Error ? error.message : 'Failed to create belt');
                        }
                    }}
                />
            )}
        </div>
    );
}

// Edit Belt Modal Component
function EditBeltModal({ belt, onClose, onSave }: {
    belt: Belt;
    onClose: () => void;
    onSave: (data: { nameEn?: string; nameAr?: string; minScoreToStart?: number }) => Promise<void>;
}) {
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

// Create Belt Modal Component
function CreateBeltModal({ trackId, nextOrder, onClose, onSave }: {
    trackId: string;
    nextOrder: number;
    onClose: () => void;
    onSave: (data: {
        trackId: string;
        nameEn: string;
        nameAr: string;
        code: string;
        order: number;
        packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
        basePriceEGP: number;
        basePriceUSD: number;
        minScoreToStart?: number;
    }) => Promise<void>;
}) {
    const [formData, setFormData] = useState<{
        nameEn: string;
        nameAr: string;
        code: string;
        order: number;
        packageLevel: 'pre-foundation' | 'foundation' | 'specialization' | 'advanced';
        basePriceEGP: number;
        basePriceUSD: number;
        minScoreToStart: number;
    }>({
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
                            onChange={(e) => setFormData({ ...formData, packageLevel: e.target.value as 'pre-foundation' | 'foundation' | 'specialization' | 'advanced' })}
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
