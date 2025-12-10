import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { SignupForm } from './SignupForm';

interface SignupCardProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export async function SignupCard({ action, locale }: SignupCardProps) {
  const t = await getTranslations('auth.signup');

  return (
    <>
      {/* Logo - Outside container */}
      <div className="flex justify-center mb-12">
        <Image
          src="/assets/images/logos/ngen-logo.svg"
          alt="NGen Schools"
          width={225}
          height={62}
          priority
        />
      </div>

      {/* Main Container */}
      <div 
        className="w-full max-w-[900px] rounded-[60px] px-8 sm:px-12 md:px-16 py-12 sm:py-16 flex flex-col backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <h1 
            className="text-gray-900 mb-6"
            style={{
              fontWeight: 700,
              fontSize: '36px',
              lineHeight: '1.2',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            {t('title')}
          </h1>
          <div
            style={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '32px',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            <p className="text-gray-600">
              {t('taglineLine1')}
            </p>
            <p className="text-gray-600">
              {t('taglineLine2')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center">
          <SignupForm action={action} locale={locale} />
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-3">
          <Link
            href={`/${locale}/policies`}
            className="block text-base text-gray-600 hover:text-pumpkin underline transition-all focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
          >
            {t('terms')}
          </Link>
          <Link
            href={`/${locale}/policies`}
            className="block text-base text-gray-600 hover:text-pumpkin underline transition-all focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </>
  );
}

