import { getPricingConfigs } from '@/lib/actions/admin/pricingActions';
import PackageConfigRow from '@/components/admin/pricing/PackageConfigRow';

export default async function PackageConfigTable() {
    const configs = await getPricingConfigs();

    if (configs.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400">No pricing configurations found.</p>
            </div>
        );
    }

    // Group by config type
    const packages = configs.filter(c => c.configType === 'package');
    const perBelt = configs.filter(c => c.configType === 'perBelt');
    const organization = configs.filter(c => c.configType === 'organization');

    return (
        <div className="space-y-6">
            {/* Package Configs */}
            {packages.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-700/30">
                        <h3 className="text-white font-medium">Package Discounts</h3>
                        <p className="text-gray-400 text-sm">Discount percentages applied to package purchases</p>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Package</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Level</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (EGP)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (USD)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((config) => (
                                <PackageConfigRow key={config.id} config={config} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Per Belt Configs */}
            {perBelt.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-700/30">
                        <h3 className="text-white font-medium">Per Belt Pricing</h3>
                        <p className="text-gray-400 text-sm">Discount for single belt purchases</p>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (EGP)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (USD)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {perBelt.map((config) => (
                                <PackageConfigRow key={config.id} config={config} showLevel={false} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Organization Configs */}
            {organization.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-700/30">
                        <h3 className="text-white font-medium">Organization Pricing</h3>
                        <p className="text-gray-400 text-sm">Special pricing for organizations</p>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (EGP)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Discount (USD)</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organization.map((config) => (
                                <PackageConfigRow key={config.id} config={config} showLevel={false} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
