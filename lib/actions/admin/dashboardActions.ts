import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import PlacementTest from '@/lib/models/PlacementTest';

export interface DashboardStatsData {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalOrders: number;
    paidOrders: number;
    pendingOrders: number;
    totalTests: number;
    completedTests: number;
    revenueEGP: number;
    revenueUSD: number;
}

export async function getDashboardStats(): Promise<DashboardStatsData> {
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
