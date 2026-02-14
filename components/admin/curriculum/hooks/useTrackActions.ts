import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleTrackActive, deleteTrack, deleteBelt, updateBelt, createBelt } from '@/lib/actions/admin/curriculumActions';
import type { Belt } from '../types';

export function useTrackActions(trackId: string) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [editingBelt, setEditingBelt] = useState<Belt | null>(null);
    const [showCreateBelt, setShowCreateBelt] = useState(false);
    const router = useRouter();

    const handleToggleActive = async (currentIsActive: boolean) => {
        setIsLoading('track');
        try {
            await toggleTrackActive(trackId, !currentIsActive);
            router.refresh();
        } catch (error) {
            console.error('Failed to toggle track:', error);
            alert('Failed to toggle track status');
        } finally {
            setIsLoading(null);
        }
    };

    const handleDeleteTrack = async (trackName: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${trackName}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setIsLoading('track');
        try {
            await deleteTrack(trackId);
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

    const handleUpdateBelt = async (beltId: string, data: { nameEn?: string; nameAr?: string; minScoreToStart?: number }) => {
        try {
            await updateBelt(beltId, data);
            router.refresh();
            setEditingBelt(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to update belt');
        }
    };

    const handleCreateBelt = async (data: Parameters<typeof createBelt>[0]) => {
        try {
            await createBelt(data);
            router.refresh();
            setShowCreateBelt(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Failed to create belt');
        }
    };

    return {
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
    };
}
