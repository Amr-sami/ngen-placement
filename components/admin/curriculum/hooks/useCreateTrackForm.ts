
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTrack } from '@/lib/actions/admin/curriculumActions';

export interface TrackFormData {
    nameEn: string;
    nameAr: string;
    slug: string;
    descriptionEn: string;
    descriptionAr: string;
}

const initialFormData: TrackFormData = {
    nameEn: '',
    nameAr: '',
    slug: '',
    descriptionEn: '',
    descriptionAr: '',
};

export function useCreateTrackForm(onSuccess?: () => void) {
    const [formData, setFormData] = useState<TrackFormData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // Auto-generate slug from English name
            if (name === 'nameEn') {
                updated.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9 ]/g, '')
                    .replace(/\s+/g, '-');
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await createTrack(formData);
            setFormData(initialFormData);
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create track');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setError(null);
    };

    return {
        formData,
        isLoading,
        error,
        handleInputChange,
        handleSubmit,
        resetForm
    };
}
