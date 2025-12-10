'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { VerifyEmailButton } from './VerifyEmailButton';

interface VerifyEmailCardProps {
  action: (formData: FormData) => Promise<{ ok: boolean }>;
  email?: string;
  locale: string;
}

export function VerifyEmailCard({ action, email, locale }: VerifyEmailCardProps) {
  const t = useTranslations('auth.verifyEmail');

  return (
    <div className="w-full flex flex-col items-center">
      {/* Logo */}
      <div className="mb-12">
        <Image
          src="/assets/images/logos/ngen-logo.svg"
          alt="NGen Schools"
          width={225}
          height={62}
          priority
        />
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
        <div 
          className="flex flex-col items-center"
          style={{
            width: '528px',
            maxWidth: '100%',
            gap: '24px'
          }}
        >
          {/* Main Heading - Confirm Your Email Address */}
          <h1 
            className="text-gray-900"
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

          {/* Description Text */}
          <p
            className="text-gray-600"
            style={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '32px',
              textAlign: 'center',
              maxWidth: '100%',
            }}
          >
            {t('description')}
          </p>

          {/* Verify Email Button */}
          <VerifyEmailButton action={action} email={email} locale={locale} />

          {/* Security Notice Frame */}
          <div 
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
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            {/* Shield Icon */}
            <div 
              style={{
                flexShrink: 0,
                marginRight: '12px',
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
                textAlign: 'left',
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

