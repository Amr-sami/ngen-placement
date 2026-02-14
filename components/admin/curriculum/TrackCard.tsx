'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ToggleLeft, ToggleRight, GripVertical, Trash2, Edit2, Plus } from 'lucide-react';
import { useTrackActions } from './hooks/useTrackActions';
import EditBeltModal from './EditBeltModal';
import CreateBeltModal from './CreateBeltModal';
import type { Track } from './types';
import { PACKAGE_LEVEL_COLORS } from './types';

interface TrackCardProps {
    track: Track;
}

export default function TrackCard({ track }: TrackCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const {
        isLoading,
        editingBelt,
        setEditingBelt,
        showCreateBelt,
        setShowCreateBelt,
        handleToggleActive,
        handleDeleteTrack,
        handleDeleteBelt,
        handleUpdateBelt,
        handleCreateBelt,
    } = useTrackActions(track.id);

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
                        onClick={() => handleToggleActive(track.isActive)}
                        disabled={isLoading !== null}
                        className={`flex items-center gap-1 text-sm ${track.isActive ? 'text-green-400' : 'text-gray-500'}`}
                    >
                        {track.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        <span>{track.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                    <button
                        onClick={() => handleDeleteTrack(track.name.en)}
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
                                                <span className={`w-2 h-2 rounded-full ${PACKAGE_LEVEL_COLORS[belt.packageLevel] || 'bg-gray-500'}`} />
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
                    onSave={(data) => handleUpdateBelt(editingBelt.id, data)}
                />
            )}

            {/* Create Belt Modal */}
            {showCreateBelt && (
                <CreateBeltModal
                    trackId={track.id}
                    nextOrder={track.belts.length + 1}
                    onClose={() => setShowCreateBelt(false)}
                    onSave={handleCreateBelt}
                />
            )}
        </div>
    );
}
