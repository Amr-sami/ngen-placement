import { getBeltsWithPricing } from '@/lib/actions/admin/pricingActions';
import BeltPriceRow from './BeltPriceRow';

export default async function BeltPricingTable() {
    const belts = await getBeltsWithPricing();

    if (belts.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">No belts found. Please run the seed script first.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 bg-gray-700/30">
                <h3 className="text-white font-medium">Standard Belt Prices</h3>
                <p className="text-gray-400 text-sm">Prices shown are applied globally for each belt level</p>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Belt</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Level</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Sales Enabled</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Price (EGP)</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Price (USD)</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {belts.map((belt) => (
                        <BeltPriceRow key={belt.id} belt={belt} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
