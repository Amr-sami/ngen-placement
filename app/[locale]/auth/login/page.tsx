import { LoginCard } from '@/components/features/auth/login/LoginCard';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';

/**
 * Disable caching for auth pages
 * Always fetch fresh data to ensure auth state is clean
 */
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.login' });

  return {
    title: t('title'),
    description: `${t('tagline.future')} ${t('tagline.innovators')}, ${t('tagline.todays')} ${t('tagline.ninjas')} ${t('welcomeBack')}`,
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === 'superadmin') {
      redirect(`/${locale}/admin`);
    } else {
      redirect(`/${locale}`);
    }
  }

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center py-12 px-4">
      <LoginCard locale={locale} />
    </main>
  );
}
