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

  // Server action for email verification
  async function verifyEmailAction(formData: FormData) {
    'use server';
    
    const email = resolvedSearchParams.email || formData.get('email') as string;
    const token = formData.get('token') as string;

    console.log('=== Email Verification Attempt ===');
    console.log('Email:', email);
    console.log('Token:', token);
    console.log('===================================');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with real email verification logic:
    // - Validate token from email link or user input
    // - Check if token is valid and not expired
    // - Mark email as verified in database
    // - Update user status
    // - Create session/JWT token
    // - Redirect to onboarding or dashboard
    // - Return error messages on failure

    return { ok: true };
  }

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center py-12 px-4">
      <VerifyEmailCard action={verifyEmailAction} email={resolvedSearchParams.email} locale={locale} />
    </main>
  );
}

