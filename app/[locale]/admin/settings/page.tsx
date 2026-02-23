import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { Shield, Server, Database, Key } from 'lucide-react';
import AdminPasswordChange from '@/components/admin/settings/AdminPasswordChange';
import { requireSuperAdmin } from '@/lib/auth/adminAuth';

export default async function SettingsPage() {
    // Both checks are conceptually distinct: one checks for super admin route access, the other gets the session.
    await requireSuperAdmin();
    const session = await getServerSession(authOptions);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
                <p className="text-gray-400 mt-1">
                    System information and admin account settings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Admin Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Shield className="text-purple-400" size={20} />
                            Admin Account
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Email</p>
                                <p className="text-white">{session?.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Name</p>
                                <p className="text-white">{session?.user?.name || `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`.trim() || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Role</p>
                                <p className="text-purple-400 font-medium capitalize">{session?.user?.role || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Server className="text-purple-400" size={20} />
                            System Information
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Environment</p>
                                <p className="text-white">{process.env.NODE_ENV || 'development'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Next.js Version</p>
                                <p className="text-white">15.x</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Server Time</p>
                                <p className="text-white">{new Date().toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Database Info */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Database className="text-purple-400" size={20} />
                            Database
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <p className="text-white">MongoDB</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <span className="inline-flex items-center gap-1 text-green-400">
                                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                    Connected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Change Password */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Key className="text-purple-400" size={20} />
                            Change Password
                        </h2>
                        <AdminPasswordChange />
                    </div>

                    {/* Quick Links */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
                        <p className="text-sm text-gray-400 mb-4">These links open in a new tab</p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/?preview=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                            >
                                View Public Site
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
