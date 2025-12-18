'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import type { Locale } from '@/i18n';

interface UserProfileDropdownProps {
    locale: Locale;
}

export function UserProfileDropdown({ locale }: UserProfileDropdownProps) {
    const { data: session, status } = useSession();
    const t = useTranslations('nav.profile');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Don't render anything while loading or if not authenticated
    if (status === 'loading') {
        return (
            <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
        );
    }

    if (status === 'unauthenticated' || !session) {
        return null;
    }

    const user = session.user;
    const displayName = user?.firstName || user?.name?.split(' ')[0] || 'User';
    const initials = displayName.charAt(0).toUpperCase();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: `/${locale}` });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-pumpkin flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                    </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-white">
                    {displayName}
                </span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 end-0 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <Link
                            href={`/${locale}/profile`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="w-4 h-4" />
                            {t('myProfile')}
                        </Link>
                        <Link
                            href={`/${locale}/settings`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="w-4 h-4" />
                            {t('settings')}
                        </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t border-gray-100 pt-1">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            {t('signOut')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
