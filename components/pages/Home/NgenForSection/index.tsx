'use client';

import { H2 } from '@/components/general/Heading';
import React from 'react';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

function HomepageNgenForSection() {
  const t = useTranslations('ngenFor');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="bg-[#F7F7F7] py-6 md:py-10 lg:py-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-5 flex flex-col gap-10">
        <H2>{t('sectionTitle')}</H2>
        <div className="flex flex-col md:flex-row justify-between lg:h-[665px]">
          <Link href="#" className="basis-1/4 bg-for_indviduals">
            <div className="h-[54%] md:bg-[#C2CBEF]">
              <p className={`font-protestRiot text-[40px] text-center pt-11 text-[#4E63BE] ${isRTL ? 'font-arabic' : ''}`}>
                {t('cards.individuals.title')}
              </p>
              <Image
                src="/assets/images/NgenFor/for-indviduals.svg"
                width={260}
                height={280}
                className="mx-auto"
                alt={t('cards.individuals.title')}
              />
            </div>
            <div className={`h-[46%] md:bg-[#627CEE] px-6 py-10 text-2xl text-center text-white font-nunito ${isRTL ? 'font-arabic' : ''}`}>
              {t('cards.individuals.description')}
            </div>
          </Link>

          <Link className="basis-1/4 bg-for_parents"
            href={ROUTES.NGEN_FOR.FOR_PARENTS}
          >
            <div className="h-[50%] md:bg-[#E4FFF2]">
              <p className={`font-protestRiot text-[40px] text-center pt-11 text-[#0BCA6C] ${isRTL ? 'font-arabic' : ''}`}>
                {t('cards.parents.title')}
              </p>
              <Image
                src="/assets/images/NgenFor/for-parents.svg"
                width={270}
                height={228}
                className="mx-auto"
                alt={t('cards.parents.title')}
              />
            </div>
            <div className={`h-[50%] md:bg-[#0BCA6C] px-6 py-10 text-2xl text-center text-white font-nunito ${isRTL ? 'font-arabic' : ''}`}>
              {t('cards.parents.description')}
            </div>
          </Link>

          <Link className="basis-1/4 bg-for_corporates"
            href={ROUTES.NGEN_FOR.FOR_CORPORATES}
          >
            <div className="h-[54%] md:bg-[#FFEEE3]">
              <p className={`font-protestRiot text-[40px] text-center pt-11 text-[#FF7723] ${isRTL ? 'font-arabic' : ''}`}>
                {t('cards.corporates.title')}
              </p>
              <Image
                src="/assets/images/NgenFor/for-corporates.svg"
                width={271}
                height={260}
                className="mx-auto"
                alt={t('cards.corporates.title')}
              />
            </div>
            <div className={`h-[46%] md:bg-[#FF7723] px-6 py-10 text-2xl text-center text-white font-nunito ${isRTL ? 'font-arabic' : ''}`}>
              {t('cards.corporates.description')}
            </div>
          </Link>

          <Link className="basis-1/4 bg-for_schools"
            href={ROUTES.NGEN_FOR.FOR_SCHOOL}
          >
            <div className="h-[50%] md:bg-[#FDBEDA]">
              <p className={`font-protestRiot text-[40px] text-center pt-11 text-[#F659A0] ${isRTL ? 'font-arabic' : ''}`}>
                {t('cards.schools.title')}
              </p>
              <Image
                src="/assets/images/NgenFor/for-schools.svg"
                width={297}
                height={228}
                className="mx-auto"
                alt={t('cards.schools.title')}
              />
            </div>
            <div className={`h-[50%] md:bg-[#F659A0] px-6 py-10 text-2xl text-center text-white font-nunito ${isRTL ? 'font-arabic' : ''}`}>
              {t('cards.schools.description')}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomepageNgenForSection;
