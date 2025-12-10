import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { OTPCard } from '@/components/features/auth/otp/OTPCard';

// Disable caching for auth pages
export const revalidate = 0;

interface OTPPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    email?: string;
  }>;
}

export async function generateMetadata({ params }: OTPPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.otp' });

  return {
    title: t('title'),
    description: t('description', { email: 'your email' }),
  };
}

export default async function OTPPage({ params, searchParams }: OTPPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // Server action for OTP verification
  async function verifyOTPAction(formData: FormData) {
    'use server';
    
    const email = resolvedSearchParams.email || formData.get('email') as string;
    const otp = formData.get('otp') as string;

    console.log('=== OTP Verification Attempt ===');
    console.log('Email:', email);
    console.log('OTP Code:', otp);
    console.log('================================');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with real OTP verification logic:
    // - Validate OTP code format (6 digits)
    // - Check if OTP matches the one sent to email
    // - Verify OTP is not expired (typically 5-10 minutes)
    // - Check attempt count (limit failed attempts)
    // - Mark email as verified on success
    // - Create user session/JWT token
    // - Redirect to onboarding or dashboard
    // - Return appropriate error messages on failure

    return { ok: true };
  }

  // Server action for resending OTP
  async function resendOTPAction(formData: FormData) {
    'use server';
    
    const email = resolvedSearchParams.email || formData.get('email') as string;

    console.log('=== OTP Resend Request ===');
    console.log('Email:', email);
    console.log('==========================');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with real OTP resend logic:
    // - Check if last OTP was sent recently (rate limiting)
    // - Generate new 6-digit OTP code
    // - Invalidate previous OTP
    // - Send new OTP via email
    // - Set expiration time
    // - Log resend attempt

    return { ok: true };
  }

  return (
    <main className="min-h-screen bg-[url('/assets/images/hero-bg.svg')] bg-no-repeat bg-cover bg-center flex items-center justify-center py-12 px-4">
      <OTPCard 
        verifyAction={verifyOTPAction} 
        resendAction={resendOTPAction}
        email={resolvedSearchParams.email || 'user@example.com'} 
      />
    </main>
  );
}

