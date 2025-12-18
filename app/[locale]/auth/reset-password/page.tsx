import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ResetPasswordCard } from '@/components/features/auth/reset-password/ResetPasswordCard';

// Disable caching for auth pages
export const revalidate = 0;

interface ResetPasswordPageProps {
    params: Promise<{
        locale: string;
    }>;
    searchParams: Promise<{
        email?: string;
        token?: string;
        success?: string;
        error?: string;
    }>;
}

export async function generateMetadata({ params }: ResetPasswordPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'auth.resetPassword' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function ResetPasswordPage({ params, searchParams }: ResetPasswordPageProps) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;

    return (
        <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex items-center justify-center py-12 px-4">
            <ResetPasswordCard
                locale={locale}
                email={resolvedSearchParams.email}
                token={resolvedSearchParams.token}
                isSuccess={resolvedSearchParams.success === 'true'}
                errorMessage={resolvedSearchParams.error}
            />
        </main>
    );
}
