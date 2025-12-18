import type { Metadata } from 'next';
import { Nunito, Protest_Riot } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { locales, localeDirections } from '@/i18n';
import { AuthProvider } from '@/components/providers/AuthProvider';
import '../globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '800'],
  variable: '--font-nunito',
});

const protestRiot = Protest_Riot({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-protestRiot',
});

export const metadata: Metadata = {
  title: 'NGen Schools - Digital Learning for Kids',
  description: 'Online educational platform offering digital learning for kids in AI, Programming, Robotics, Cybersecurity, and more.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  const isValidLocale = locales.some((l) => l === locale);
  if (!isValidLocale) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Get text direction for the locale
  const dir = localeDirections[locale as keyof typeof localeDirections];

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-563K68LDS3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-563K68LDS3');
          `}
        </Script>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PMZWSRZJ');
          `}
        </Script>
      </head>
      <body
        className={`${nunito.variable} ${protestRiot.variable} ${nunito.className} antialiased relative`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PMZWSRZJ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <NextIntlClientProvider messages={messages}>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

