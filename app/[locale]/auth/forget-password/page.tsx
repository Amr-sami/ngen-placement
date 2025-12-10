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
  await params;

  // Server action for password reset request
  async function forgetPasswordAction(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;

    console.log('=== Password Reset Request ===');
    console.log('Email:', email);
    console.log('==============================');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with real password reset logic:
    // - Validate email format
    // - Check if email exists in database
    // - Generate password reset token
    // - Create expiring reset link (e.g., valid for 1 hour)
    // - Send reset email with link
    // - Log the reset request
    // - Return appropriate success/error messages
    // - Implement rate limiting to prevent abuse

    return { ok: true };
  }

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex items-center justify-center py-12 px-4">
      <ForgetPasswordCard action={forgetPasswordAction} />
    </main>
  );
}

