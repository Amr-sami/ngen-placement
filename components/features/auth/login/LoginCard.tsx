import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { AuthLogo } from '../shared/AuthLogo';
import { localeDirections } from '@/i18n';

interface LoginCardProps {
  locale: string;
}

export async function LoginCard({ locale }: LoginCardProps) {
  const t = await getTranslations('auth.login');
  const isRTL = localeDirections[locale as keyof typeof localeDirections] === 'rtl';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Logo - Outside container */}
      <div className="flex justify-center mb-8">
        <AuthLogo />
      </div>

      {/* Main Container with shine effect (wider) */}
      <div
        className="w-full max-w-[1000px] rounded-[60px] px-6 sm:px-10 md:px-12 py-6 backdrop-blur-sm relative overflow-hidden"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        {/* Shine effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shine 3s ease-in-out infinite',
          }}
        />

        {/* Keyframes animation */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes shine {
                0% {
                  background-position: -200% 0;
                }
                100% {
                  background-position: 200% 0;
                }
              }
            `,
          }}
        />

        {/* Header */}
        <div className="text-center mb-4 flex flex-col items-center relative z-10">
          <h1 className="text-purple-dark font-bold text-2xl md:text-3xl mb-2">
            {t('title')}
          </h1>
          <div className="text-center space-y-0.5">
            <p className="font-protestRiot text-base md:text-lg text-purple-dark">
              {t('tagline.future')}{' '}
              <span className="text-pumpkin">{t('tagline.innovators')}</span>,{' '}
              {t('tagline.todays')}{' '}
              <span className="text-rose">{t('tagline.ninjas')}</span>
            </p>
            <p className="text-gray-600 text-xs md:text-sm">
              {t('welcomeBack')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <LoginForm locale={locale} />
        </div>

        {/* Footer Links */}
        <div className="mt-4 text-center flex gap-4 justify-center relative z-10">
          <Link
            href={`/${locale}/policies`}
            className="text-xs text-gray-600 hover:text-pumpkin underline transition-all focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
          >
            {t('terms')}
          </Link>
          <Link
            href={`/${locale}/policies`}
            className="text-xs text-gray-600 hover:text-pumpkin underline transition-all focus-visible:ring-2 focus-visible:ring-pumpkin/60 focus-visible:ring-offset-1 rounded outline-none"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </div>
  );
}
