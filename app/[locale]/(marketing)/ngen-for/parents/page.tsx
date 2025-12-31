import {
  HowItWorksSection,
  Features,
} from '@/components/pages/NgenFor';
import {
  CallToAction,
  ContactUs,
  PageWrapper,
} from '@/components/general';
import { H2 } from '@/components/general/Heading';
import { getTranslations, getLocale } from 'next-intl/server';

export const metadata = {
  title: "For Parents | NGen School Support & Progress Tools",
  description: "At NGen, we support parents with detailed progress reports and free workshops. Stay involved and help your child succeed in coding, AI, and other digital skills.",
  keywords: ["online school for kids", "digital learning for children", "coding classes for kids", "AI courses for kids", "robotics for kids"],
};

const NgenForParents = async () => {
  const t = await getTranslations('ngenFor.parents');
  const tHero = await getTranslations('home.hero');
  const locale = await getLocale();
  const isRTL = locale === 'ar';

  // Build howItWorksData from translations
  const howItWorksData = [
    {
      bgColor: 'bg-[#EFE8FD]',
      imgSrc: '/assets/images/icons/person-icon.svg',
      altText: 'user-group',
      title: t('howItWorks.steps.0.title'),
      desc: t('howItWorks.steps.0.description'),
    },
    {
      bgColor: 'bg-[#E5E9FE]',
      imgSrc: '/assets/images/icons/phone-icon-purple.svg',
      altText: 'user-group',
      title: t('howItWorks.steps.1.title'),
      desc: t('howItWorks.steps.1.description'),
    },
    {
      bgColor: 'bg-[#FDE7D9]',
      imgSrc: '/account-group.svg',
      altText: 'user-group',
      title: t('howItWorks.steps.2.title'),
      desc: t('howItWorks.steps.2.description'),
    },
    {
      bgColor: 'bg-[#FDDDFB]',
      imgSrc: '/assets/images/icons/union-icon.svg',
      altText: 'user-group',
      title: t('howItWorks.steps.3.title'),
      desc: t('howItWorks.steps.3.description'),
    },
  ];

  // Build features from translations
  const features = [
    t('features.list.0'),
    t('features.list.1'),
    t('features.list.2'),
    t('features.list.3'),
    t('features.list.4'),
    t('features.list.5'),
    t('features.list.6'),
    t('features.list.7'),
    t('features.list.8'),
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
      <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
        <H2>{t('pageTitle')}</H2>
        <HowItWorksSection data={howItWorksData} title={t('howItWorks.title')} />
        <Features features={features} imgSrc="/features-for-corporate.svg" title={t('features.title')} />
        <ContactUs />
      </PageWrapper>
      <CallToAction cta={tHero('cta')} />
    </div>
  );
};

export default NgenForParents;
