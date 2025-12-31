'use client';

import Logo from '@/components/general/Logo';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { IoLogoWhatsapp } from 'react-icons/io';
import { useParams } from 'next/navigation';
import {
  getHomeRoute,
  getAboutRoute,
  getTracksRoute,
  getPoliciesRoute,
  getNgenForSchoolsRoute,
  getNgenForCorporatesRoute,
  getNgenForParentsRoute,
} from '@/lib/routes';
import type { Locale } from '@/i18n';

// ✅ import messages
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';

const MESSAGES = {
  en: enMessages,
  ar: arMessages,
} as const;

function Footer() {
  const params = useParams();
  const locale = ((params?.locale as Locale) || 'en') as keyof typeof MESSAGES;
  const isRTL = locale === 'ar';

  // ✅ footer translations from JSON
  const t = MESSAGES[locale]?.footer ?? MESSAGES.en.footer;

  // ✅ offices from JSON
  const offices = [
    {
      country: t.offices.egypt.country,
      address: t.offices.egypt.address,
      phone: t.offices.egypt.phone,
      hasWhatsapp: t.offices.egypt.hasWhatsapp,
    },
    {
      country: t.offices.uae.country,
      address: t.offices.uae.address,
      phone: t.offices.uae.phone,
      hasWhatsapp: t.offices.uae.hasWhatsapp,
    },
    {
      country: t.offices.syria.country,
      address: t.offices.syria.address,
      phones: t.offices.syria.phones,
      hasWhatsapp: t.offices.syria.hasWhatsapp,
    },
  ];

  const socialLinks = [
    { href: 'https://www.facebook.com/ngenschools', icon: '/assets/images/icons/fb-icon-light.svg', alt: 'Facebook' },
    { href: 'https://www.linkedin.com/company/ngenschools/', icon: '/assets/images/icons/linkedin-icon-light.svg', alt: 'LinkedIn' },
    { href: 'https://www.instagram.com/ngenschools/', icon: '/assets/images/icons/insta-icon-light.svg', alt: 'Instagram' },
    { href: 'https://www.tiktok.com/@ngenschools', icon: '/tiktok-round-white-icon.webp', alt: 'TikTok' },
  ];

  return (
    <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative mt-6 overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800"
    >
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,50 Q360,10 720,50 T1440,50 L1440,0 L0,0 Z" fill="white" opacity="0.9" />
          <path d="M0,80 Q360,40 720,80 T1440,80 L1440,0 L0,0 Z" fill="#ff6b35" opacity="0.6" />
        </svg>
      </div>

      {/* Decorative Icons */}
      <div className="absolute top-10 left-10 opacity-10">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="2" />
          <path d="M40 25 L40 55 M25 40 L55 40" stroke="white" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="10" y="10" width="20" height="60" fill="white" />
          <rect x="40" y="30" width="20" height="40" fill="white" />
          <rect x="70" y="20" width="20" height="50" fill="white" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-5 lg:px-8 relative z-10 pt-24 pb-8 lg:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo & Social Section */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-8">
            <Link href={getHomeRoute(locale)} className="transition-transform hover:scale-110 duration-300">
              <Logo width={200} height={100} />
            </Link>

            <div className="hidden lg:block w-full">
              <ul className="flex gap-4 justify-center lg:justify-start">
                {socialLinks.map((social, idx) => (
                  <li key={idx}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-transform hover:scale-110 hover:-translate-y-1 duration-300"
                    >
                      <Image src={social.icon} alt={social.alt} width={40} height={40} className="drop-shadow-lg" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h6 className="font-bold text-lg mb-4 md:mb-6 text-white">{t.quickLinks}</h6>
            <ul className="flex flex-col gap-2 md:gap-4">
              <li>
                <Link href={getAboutRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href={getTracksRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.tracks}
                </Link>
              </li>
              <li>
                <Link href={getPoliciesRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.policies}
                </Link>
              </li>
            </ul>
          </div>

          {/* NGen For */}
          <div className="lg:col-span-2">
            <h6 className="font-bold text-lg mb-4 md:mb-6 text-white">{t.ngenFor}</h6>
            <ul className="flex flex-col gap-2 md:gap-4">
              <li>
                <Link href={getNgenForSchoolsRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.forSchools}
                </Link>
              </li>
              <li>
                <Link href={getNgenForCorporatesRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.forCorporates}
                </Link>
              </li>
              <li>
                <Link href={getNgenForParentsRoute(locale)} className="text-white/90 hover:text-white transition-all duration-200 inline-block hover:translate-x-1">
                  {t.forParents}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-5 col-span-2">
            <h6 className="font-bold text-lg mb-4 md:mb-6 text-white text-center md:text-left">{t.getInTouch}</h6>

            {/* Global Email */}
            <div className="mb-6">
              <div className="flex items-start gap-3 group">
                <Image
                  src="/assets/images/icons/mail-icon.svg"
                  alt="email icon"
                  width={24}
                  height={24}
                  className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform brightness-0 invert"
                />
                <a href="mailto:Info@ngenschools.com" className="text-white/90 hover:text-white transition-colors">
                  Info@ngenschools.com
                </a>
              </div>
            </div>

            {/* Office Locations */}
            <div className="space-y-6">
              {offices.map((office, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-white font-semibold text-sm">{office.country}</p>

                  <div className="flex items-start gap-3 group">
                    <Image
                      src="/assets/images/icons/location-icon.svg"
                      alt="location icon"
                      width={24}
                      height={24}
                      className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform brightness-0 invert"
                    />
                    <p className="text-white/90 leading-relaxed">{office.address}</p>
                  </div>

                  {office.phone && (
                    <div className="flex items-start gap-3 group">
                      {office.hasWhatsapp ? (
                        <IoLogoWhatsapp size={24} className="flex-shrink-0 mt-0.5 text-white group-hover:scale-110 transition-transform" />
                      ) : (
                        <Image
                          src="/assets/images/icons/phone-icon.svg"
                          alt="phone icon"
                          width={24}
                          height={24}
                          className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform brightness-0 invert"
                        />
                      )}

                      <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-white/90 hover:text-white transition-colors" dir="ltr">
                        {office.phone}
                      </a>
                    </div>
                  )}

                  {office.phones?.map((phone, phoneIdx) => (
                    <div key={phoneIdx} className="flex items-start gap-3 group">
                      <Image
                        src="/assets/images/icons/phone-icon.svg"
                        alt="phone icon"
                        width={24}
                        height={24}
                        className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform brightness-0 invert"
                      />
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white/90 hover:text-white transition-colors" dir="ltr">
                        {phone}
                      </a>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Social Icons */}
        <div className="lg:hidden mt-8">
          <ul className="flex gap-5 justify-center">
            {socialLinks.map((social, idx) => (
              <li key={idx}>
                <Link href={social.href} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-110 duration-300">
                  <Image src={social.icon} alt={social.alt} width={40} height={40} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 pt-6 pb-4 border-t border-white/20">
        <div className="container mx-auto px-5">
          <p className="text-center text-white/80 text-sm">
            © {new Date().getFullYear()} {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
