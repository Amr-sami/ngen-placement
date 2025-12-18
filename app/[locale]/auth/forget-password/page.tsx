import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ForgetPasswordCard } from '@/components/features/auth/forget-password/ForgetPasswordCard';

// Disable caching for auth pages
export const revalidate = 0;

interface ForgetPasswordPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ForgetPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.forgetPassword' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ForgetPasswordPage({ params }: ForgetPasswordPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex items-center justify-center py-12 px-4">
      <ForgetPasswordCard locale={locale} />
    </main>
  );
}
