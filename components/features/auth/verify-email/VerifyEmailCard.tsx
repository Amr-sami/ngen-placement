'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VerifyEmailButton } from './VerifyEmailButton';
import { AuthLogo } from '../shared/AuthLogo';
import { useRTL } from '@/lib/useRTL';

interface VerifyEmailCardProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  email?: string;
  locale: string;
}

export function VerifyEmailCard({ action, email, locale }: VerifyEmailCardProps) {
  const t = useTranslations('auth.verifyEmail');
  const isRTL = useRTL();

  return (
    <div className="w-full flex flex-col items-center" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Logo */}
      <div className="mb-12">
        <AuthLogo />
      </div>

      {/* Main Container Rectangle */}
      <div 
        className="w-full max-w-[887px] rounded-[60px] flex flex-col items-center justify-center py-16 px-8 backdrop-blur-sm"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          minHeight: '500px'
        }}
      >
        {/* Inner Group Container - Vertical Flow */}
        <div className="flex flex-col items-center text-center gap-6 w-full max-w-[528px]">
          {/* Main Heading - Confirm Your Email Address */}
          <h1 className="text-purple-dark font-bold text-3xl md:text-4xl">
            {t('title')}
          </h1>

          {/* Description Text */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {t('description')}
          </p>

          {/* Verify Email Button */}
          <VerifyEmailButton action={action} email={email} locale={locale} />

          {/* Security Notice Frame */}
          <div 
            className={`flex ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{
              width: '528px',
              maxWidth: '100%',
              minHeight: '88px',
              gap: '10px',
              paddingTop: '16px',
              paddingBottom: '16px',
              paddingLeft: '20px',
              paddingRight: '20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 204, 0, 0.13)',
              border: '1px solid #F9D158',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            {/* Shield Icon */}
            <div 
              style={{
                flexShrink: 0,
                marginRight: isRTL ? '0' : '12px',
                marginLeft: isRTL ? '12px' : '0',
                marginTop: '2px',
              }}
            >
              <Image
                src="/assets/auth/email-icon.svg"
                alt=""
                width={26}
                height={26}
                style={{
                  opacity: 1,
                }}
              />
            </div>
            
            {/* Security Text */}
            <div 
              style={{
                flex: 1,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: isRTL ? 'right' : 'left',
                color: '#B77C50',
              }}
            >
              <span style={{ fontWeight: 700 }}>
                {t('securityNotice.title')}
              </span>
              <span style={{ fontWeight: 400 }}>
                {' '}{t('securityNotice.message')}
              </span>
            </div>
          </div>

          {/* Divider Line */}
          <div 
            style={{
              width: '496px',
              maxWidth: '100%',
              height: '0px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              marginTop: '8px',
              marginBottom: '8px'
            }}
          />

          {/* Footer - All Rights Reserved (Inside Container) */}
          <footer 
            style={{
              maxWidth: '100%',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              textAlign: 'center',
              color: '#0C1128',
            }}
          >
            {t('footer')}
          </footer>
        </div>
      </div>
    </div>
  );
}

