'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * NextAuth SessionProvider wrapper for client components
 * Enables useSession hook throughout the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
