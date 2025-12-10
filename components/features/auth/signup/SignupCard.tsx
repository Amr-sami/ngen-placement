import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { SignupForm } from './SignupForm';
import { AuthLogo } from '../shared/AuthLogo';
import { localeDirections } from '@/i18n';

interface SignupCardProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  locale: string;
}

export async function SignupCard({ action, locale }: SignupCardProps) {
  const t = await getTranslations('auth.signup');
  const isRTL = localeDirections[locale as keyof typeof localeDirections] === 'rtl';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Logo - Outside container */}
      <div className="flex justify-center mb-12">
        <AuthLogo />
      </div>

      {/* Main Container */}
      <div 
        className="w-full max-w-[900px] rounded-[60px] px-8 sm:px-12 md:px-16 py-12 sm:py-16 flex flex-col backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <h1 className="text-purple-dark font-bold text-3xl md:text-4xl mb-6">
            {t('title')}
          </h1>
          <div className="text-center space-y-1">
            <p className="font-protestRiot text-lg md:text-xl lg:text-2xl text-purple-dark">
              {t('tagline.future')} <span className="text-pumpkin">{t('tagline.innovators')}</span>,{' '}
              {t('tagline.todays')} <span className="text-rose">{t('tagline.ninjas')}</span>
            </p>
            <p className="text-gray-600 text-base md:text-lg">
              {t('joinUs')}
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
    </div>
  );
}

