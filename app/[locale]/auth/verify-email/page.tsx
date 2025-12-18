import { getTranslations } from 'next-intl/server';
import { VerifyEmailCard } from '@/components/features/auth/verify-email/VerifyEmailCard';

// Disable caching for auth pages
export const revalidate = 0;

interface VerifyEmailPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    email?: string;
    success?: string;
    error?: string;
    token?: string;
  }>;
}

export async function generateMetadata({ params }: VerifyEmailPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmail' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function VerifyEmailPage({ params, searchParams }: VerifyEmailPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Determine the verification status based on URL params
  const isSuccess = resolvedSearchParams.success === 'true';
  const errorType = resolvedSearchParams.error;

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center py-12 px-4">
      <VerifyEmailCard
        email={resolvedSearchParams.email}
        locale={locale}
        isSuccess={isSuccess}
        errorType={errorType}
      />
    </main>
  );
}
