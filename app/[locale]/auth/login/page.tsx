import { LoginCard } from '@/components/features/auth/login/LoginCard';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

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
    description: `${t('taglineLine1')} ${t('taglineLine2')}`,
  };
}

/**
 * Server Action to handle login form submission
 * Currently logs to console - replace with real authentication
 */
async function loginAction(formData: FormData) {
  'use server';

  // Extract form fields
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rememberMe = formData.get('rememberMe') === 'on';

  // Log submission details on server
  console.log('=== Login Attempt ===');
  console.log('Email:', email);
  console.log('Password:', '***'); // Never log actual passwords
  console.log('Remember Me:', rememberMe);
  console.log('=====================');

  // Simulate async processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: Replace with real authentication:
  // - Validate credentials against database
  // - Create session/JWT token
  // - Set secure HTTP-only cookies
  // - Redirect to dashboard on success
  // - Return error messages on failure

  return { ok: true };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center py-12 px-4">
      <LoginCard action={loginAction} locale={locale} />
    </main>
  );
}

