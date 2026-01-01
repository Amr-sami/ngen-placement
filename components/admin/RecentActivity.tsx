import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import PlacementTest from '@/lib/models/PlacementTest';
import { UserPlus, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'user_signup' | 'order_paid' | 'order_failed' | 'test_completed';
    title: string;
    description: string;
    timestamp: Date;
    icon: typeof UserPlus;
    iconColor: string;
}

async function getRecentActivity(): Promise<ActivityItem[]> {
    await connectToDatabase();

    // Fetch recent data in parallel
    const [recentUsers, recentOrders, recentTests] = await Promise.all([
        User.find({ role: { $ne: 'superadmin' } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('email profile.firstName profile.lastName createdAt')
            .lean(),
        Order.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('customerEmail customerName status amount currency updatedAt')
            .lean(),
        PlacementTest.find({ status: 'completed' })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate('userId', 'email profile.firstName profile.lastName')
            .select('scorePercent resultBeltName completedAt userId')
            .lean(),
    ]);

    const activities: ActivityItem[] = [];

    // Map users to activities
    recentUsers.forEach((user) => {
        const typedUser = user as { _id: { toString: () => string }; email: string; profile: { firstName: string; lastName: string }; createdAt: Date };
        activities.push({
            id: `user-${typedUser._id.toString()}`,
            type: 'user_signup',
            title: 'New User Signup',
            description: `${typedUser.profile?.firstName || 'Unknown'} ${typedUser.profile?.lastName || ''} (${typedUser.email})`,
            timestamp: typedUser.createdAt,
            icon: UserPlus,
            iconColor: 'text-blue-400',
        });
    });

    // Map orders to activities
    recentOrders.forEach((order) => {
        const typedOrder = order as { _id: { toString: () => string }; customerName: string; status: string; amount: number; currency: string; updatedAt: Date };
        const isPaid = typedOrder.status === 'paid';
        const isFailed = typedOrder.status === 'failed';

        activities.push({
            id: `order-${typedOrder._id.toString()}`,
            type: isPaid ? 'order_paid' : isFailed ? 'order_failed' : 'order_paid',
            title: isPaid ? 'Payment Received' : isFailed ? 'Payment Failed' : 'Order Updated',
            description: `${typedOrder.customerName} - ${typedOrder.amount} ${typedOrder.currency}`,
            timestamp: typedOrder.updatedAt,
            icon: isPaid ? CheckCircle : isFailed ? XCircle : Clock,
            iconColor: isPaid ? 'text-green-400' : isFailed ? 'text-red-400' : 'text-yellow-400',
        });
    });

    // Map tests to activities
    recentTests.forEach((test) => {
        const typedTest = test as unknown as { _id: { toString: () => string }; userId: { email: string; profile: { firstName: string; lastName: string } } | null; scorePercent: number; resultBeltName: string; completedAt: Date };
        const user = typedTest.userId;
        activities.push({
            id: `test-${typedTest._id.toString()}`,
            type: 'test_completed',
            title: 'Placement Test Completed',
            description: user
                ? `${user.profile?.firstName || 'Unknown'} scored ${typedTest.scorePercent}% → ${typedTest.resultBeltName || 'N/A'}`
                : `Score: ${typedTest.scorePercent}%`,
            timestamp: typedTest.completedAt,
            icon: ClipboardList,
            iconColor: 'text-purple-400',
        });
    });

    // Sort by timestamp and take top 10
    return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}

export default async function RecentActivity() {
    const activities = await getRecentActivity();

    if (activities.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <p className="text-gray-400 text-center py-8">No recent activity to show</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
                {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                        >
                            <div className={`mt-0.5 ${activity.iconColor}`}>
                                <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{activity.title}</p>
                                <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatRelativeTime(activity.timestamp)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
