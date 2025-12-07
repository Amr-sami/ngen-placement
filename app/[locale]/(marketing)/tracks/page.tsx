'use client';

import { CallToAction, PageWrapper, TracksSection } from '@/components/general';
import { useTranslations } from 'next-intl';
import React from 'react';

const TracksPage = () => {
  const t = useTranslations('home.hero');
  
  return (
    <>
      <PageWrapper classNames="container mx-auto">
        <TracksSection title="Available Tracks" />
        {/* <TracksSection title="Upcoming Tracks" /> */}
      </PageWrapper>
      <CallToAction cta={t('cta')} slogan={t('slogan')} />
    </>
  );
};

export default TracksPage;
