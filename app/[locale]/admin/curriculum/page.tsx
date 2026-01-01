import { Suspense } from 'react';
import CurriculumList from '@/components/admin/curriculum/CurriculumList';
import CreateTrackModal from '@/components/admin/curriculum/CreateTrackModal';

export default function CurriculumPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Curriculum Management</h1>
                    <p className="text-gray-400 mt-1">
                        Manage tracks, belts, and learning progression
                    </p>
                </div>
                <CreateTrackModal />
            </div>

            {/* Curriculum List */}
            <Suspense fallback={
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="h-12 bg-gray-700 rounded"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            }>
                <CurriculumList />
            </Suspense>
        </div>
    );
}
