import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import PlacementTest from '@/lib/models/PlacementTest';
import { Users, UserCheck, ShoppingCart, CreditCard, ClipboardCheck, Award } from 'lucide-react';

async function getStats() {
    await connectToDatabase();

    const [
        totalUsers,
        activeUsers,
        pendingUsers,
        totalOrders,
        paidOrders,
        pendingOrders,
        totalTests,
        completedTests,
    ] = await Promise.all([
        User.countDocuments({ role: { $ne: 'superadmin' } }),
        User.countDocuments({ status: 'active', role: { $ne: 'superadmin' } }),
        User.countDocuments({ status: 'pending', role: { $ne: 'superadmin' } }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'paid' }),
        Order.countDocuments({ status: 'pending' }),
        PlacementTest.countDocuments(),
        PlacementTest.countDocuments({ status: 'completed' }),
    ]);

    // Calculate revenue (sum of paid orders)
    const revenueResult = await Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: '$currency', total: { $sum: '$amount' } } }
    ]);

    const revenueEGP = revenueResult.find(r => r._id === 'EGP')?.total || 0;
    const revenueUSD = revenueResult.find(r => r._id === 'USD')?.total || 0;

    return {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalOrders,
        paidOrders,
        pendingOrders,
        totalTests,
        completedTests,
        revenueEGP,
        revenueUSD,
    };
}

export default async function DashboardStats() {
    const stats = await getStats();

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            subtext: `${stats.activeUsers} active, ${stats.pendingUsers} pending`,
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            label: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            subtext: `${Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}% of total`,
            icon: UserCheck,
            gradient: 'from-green-500 to-emerald-600',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            subtext: `${stats.paidOrders} paid, ${stats.pendingOrders} pending`,
            icon: ShoppingCart,
            gradient: 'from-purple-500 to-purple-600',
        },
        {
            label: 'Revenue (EGP)',
            value: `${stats.revenueEGP.toLocaleString()} EGP`,
            subtext: stats.revenueUSD > 0 ? `+ ${stats.revenueUSD.toLocaleString()} USD` : 'No USD orders yet',
            icon: CreditCard,
            gradient: 'from-emerald-500 to-teal-600',
        },
        {
            label: 'Placement Tests',
            value: stats.totalTests.toLocaleString(),
            subtext: `${stats.completedTests} completed`,
            icon: ClipboardCheck,
            gradient: 'from-orange-500 to-orange-600',
        },
        {
            label: 'Test Completion Rate',
            value: `${Math.round((stats.completedTests / stats.totalTests) * 100) || 0}%`,
            subtext: `${stats.completedTests} of ${stats.totalTests} tests`,
            icon: Award,
            gradient: 'from-cyan-500 to-cyan-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
