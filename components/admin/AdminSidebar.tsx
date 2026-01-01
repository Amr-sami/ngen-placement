'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    BookOpen,
    ShoppingCart,
    ClipboardList,
    Settings,
    LogOut,
    Shield,
} from 'lucide-react';

const navItems = [
    { href: '/en/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/en/admin/users', label: 'Users', icon: Users },
    { href: '/en/admin/pricing', label: 'Pricing', icon: DollarSign },
    { href: '/en/admin/curriculum', label: 'Curriculum', icon: BookOpen },
    { href: '/en/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/en/admin/placement-tests', label: 'Placement Tests', icon: ClipboardList },
    { href: '/en/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">NGEN Admin</h1>
                        <p className="text-xs text-gray-400">Control Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <div className="px-3 mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Management
                    </p>
                </div>
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-purple-600/20 text-purple-400 border-l-4 border-purple-500 -ml-0.5'
                                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-purple-400' : ''} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
