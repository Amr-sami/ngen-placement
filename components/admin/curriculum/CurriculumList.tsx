import { getTracksWithBelts } from '@/lib/actions/admin/curriculumActions';
import TrackCard from '@/components/admin/curriculum/TrackCard';

export default async function CurriculumList() {
    const tracks = await getTracksWithBelts();

    if (tracks.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400 mb-4">No tracks found. Run the seed script to populate initial data.</p>
                <code className="text-sm text-purple-400 bg-gray-900 px-4 py-2 rounded">
                    npx tsx scripts/seed.ts
                </code>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
            ))}
        </div>
    );
}
