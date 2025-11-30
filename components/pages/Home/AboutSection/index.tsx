'use client';

import React from 'react';
import { H2 } from '@/components/general/Heading';
import { useTranslations } from 'next-intl';

function HomepageAboutSection() {
  const t = useTranslations('home.about');

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-5 text-purple-dark">
        <div className="grid grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {/* About Us - Full Width */}
          <div className="col-span-2 flex flex-col gap-4">
            <h2 className="font-protestRiot lg:text-5xl text-2xl text-purple-dark">
              {t('aboutUs.heading')}
            </h2>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed">
              {t('aboutUs.body')}
            </p>
          </div>

          {/* Mission - Half Width on Desktop */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <H2>{t('mission.heading')}</H2>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed">
              {t('mission.body')}
            </p>
          </div>

          {/* Vision - Half Width on Desktop */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <H2>{t('vision.heading')}</H2>
            <p className="text-sm md:text-base lg:text-lg leading-relaxed">
              {t('vision.body')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomepageAboutSection;
