import { SignupCard } from '@/components/features/auth/signup/SignupCard';
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
  const t = await getTranslations({ locale, namespace: 'auth.signup' });

  return {
    title: t('title'),
    description: `${t('tagline.future')} ${t('tagline.innovators')}, ${t('tagline.todays')} ${t('tagline.ninjas')} ${t('joinUs')}`,
  };
}

/**
 * Server Action to handle signup form submission
 * Currently logs to console - replace with real authentication
 */
async function signupAction(formData: FormData) {
  'use server';

  // Extract form fields
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const country = formData.get('country') as string;

  // Log submission details on server
  console.log('=== Signup Attempt ===');
  console.log('Name:', firstName, lastName);
  console.log('Email:', email);
  console.log('Password:', '***'); // Never log actual passwords
  console.log('Password Match:', password === confirmPassword);
  console.log('Phone:', phoneNumber);
  console.log('Country:', country);
  console.log('======================');

  // Simulate async processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: Replace with real authentication:
  // - Validate all fields (email format, password strength, etc.)
  // - Check if email already exists in database
  // - Hash password with bcrypt
  // - Create user record in database
  // - Send verification email
  // - Create session/JWT token
  // - Set secure HTTP-only cookies
  // - Redirect to onboarding/dashboard
  // - Return error messages on failure

  return { ok: true };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center py-12 px-4">
      <SignupCard action={signupAction} locale={locale} />
    </main>
  );
}

