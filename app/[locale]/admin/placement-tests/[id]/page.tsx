
import { notFound } from 'next/navigation';
import { getPlacementTest } from '@/lib/actions/admin/operationsActions';
import PlacementTestDetails from '@/components/admin/placement-tests/PlacementTestDetails';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PlacementTestDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const test = await getPlacementTest(id);

    if (!test) {
        notFound();
    }

    return (
        <PlacementTestDetails test={test} />
    );
}
