import { Suspense } from 'react';
import Link from 'next/link';
import { DollarSign, Package } from 'lucide-react';
import BeltPricingTable from '@/components/admin/pricing/BeltPricingTable';
import PackageConfigTable from '@/components/admin/pricing/PackageConfigTable';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

export default async function PricingPage() {
    await requireSuperAdmin();
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Pricing Management</h1>
                <p className="text-gray-400 mt-1">
                    Manage belt prices and package discounts. Changes reflect immediately on the public site.
                </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-4">
                <Link
                    href="#belts"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                    <DollarSign size={18} />
                    Belt Prices
                </Link>
                <Link
                    href="#packages"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                    <Package size={18} />
                    Package Discounts
                </Link>
            </div>

            {/* Belt Pricing Section */}
            <section id="belts" className="scroll-mt-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign size={20} className="text-purple-400" />
                    Belt Base Prices
                </h2>
                <Suspense fallback={
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                        <div className="h-64 bg-gray-700 rounded"></div>
                    </div>
                }>
                    <BeltPricingTable />
                </Suspense>
            </section>

            {/* Package Config Section */}
            <section id="packages" className="scroll-mt-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Package size={20} className="text-purple-400" />
                    Package Configurations
                </h2>
                <Suspense fallback={
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
                        <div className="h-64 bg-gray-700 rounded"></div>
                    </div>
                }>
                    <PackageConfigTable />
                </Suspense>
            </section>
        </div>
    );
}
