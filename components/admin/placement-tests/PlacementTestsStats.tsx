import { getPlacementTestStats } from '@/lib/actions/admin/operationsActions';
import { ClipboardList, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default async function PlacementTestsStats() {
    const stats = await getPlacementTestStats();

    const statCards = [
        {
            label: 'Total Tests',
            value: stats.total.toLocaleString(),
            icon: ClipboardList,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
        },
        {
            label: 'Completed',
            value: stats.completed.toLocaleString(),
            icon: CheckCircle,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
        },
        {
            label: 'In Progress',
            value: stats.inProgress.toLocaleString(),
            icon: Clock,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
        },
        {
            label: 'Avg Score',
            value: `${stats.averageScore}%`,
            icon: TrendingUp,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={stat.color} size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">{stat.label}</p>
                                <p className="text-xl font-bold text-white">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
