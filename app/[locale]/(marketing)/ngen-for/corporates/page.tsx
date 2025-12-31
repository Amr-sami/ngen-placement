import {
  HowItWorksSection,
  Features,
} from "@/components/pages/NgenFor";
import { ContactUs, PageWrapper } from "@/components/general";
import { H2 } from "@/components/general/Heading";
import { getTranslations, getLocale } from 'next-intl/server';

export const metadata = {
  title: "For Corporates | Online Learning for Employees' Children",
  description: "Boost employee satisfaction with NGen's engaging tech education for kids. Affordable online programs in coding, robotics, and more – perfect for corporate benefits.",
  keywords: ["corporate training for kids", "employee kids learning", "tech courses for children", "online education for families", "corporate family programs"],
};

const NgenForCorporates = async () => {
  const t = await getTranslations('ngenFor.corporates');
  const locale = await getLocale();
  const isRTL = locale === 'ar';

  // Build howItWorksData from translations
  const howItWorksData = [
    {
      bgColor: "bg-[#EFE8FD]",
      imgSrc: "/assets/images/icons/person-icon.svg",
      altText: "user-group",
      title: t('howItWorks.steps.0.title'),
      desc: t('howItWorks.steps.0.description'),
    },
    {
      bgColor: "bg-[#E5E9FE]",
      imgSrc: "/assets/images/icons/phone-icon-purple.svg",
      altText: "user-group",
      title: t('howItWorks.steps.1.title'),
      desc: t('howItWorks.steps.1.description'),
    },
    {
      bgColor: "bg-[#FDE7D9]",
      imgSrc: "/account-group.svg",
      altText: "user-group",
      title: t('howItWorks.steps.2.title'),
      desc: t('howItWorks.steps.2.description'),
    },
    {
      bgColor: "bg-[#FDDDFB]",
      imgSrc: "/assets/images/icons/union-icon.svg",
      altText: "user-group",
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
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
      <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
        <H2>{t('pageTitle')}</H2>
        <HowItWorksSection data={howItWorksData} title={t('howItWorks.title')} />
        <Features features={features} imgSrc="/features-for-corporate.svg" title={t('features.title')} />
        <ContactUs />
      </PageWrapper>
    </div>
  );
};

export default NgenForCorporates;
