'use client';

import { CallToAction } from "@/components/general";
import { useTranslations } from 'next-intl';
import React from "react";

function HomepageBannerSection() {
  const t = useTranslations('home.hero');
  
  return (
    <section className=" text-white">
      <CallToAction cta={t('cta')} />
    </section>
  );
}

export default HomepageBannerSection;
