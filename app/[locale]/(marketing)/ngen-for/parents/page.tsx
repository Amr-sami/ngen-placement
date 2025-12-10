'use client';

import {
  HowItWorksSection,
  Features,
  // TracksOverviewSection,
} from '@/components/pages/NgenFor';
import {
  CallToAction,
  ContactUs,
  PageWrapper,
  TracksSection,
} from '@/components/general';
import { H2 } from '@/components/general/Heading';
import { useTranslations } from 'next-intl';

const howItWorksData = [
  {
    bgColor: 'bg-[#EFE8FD]',
    imgSrc: '/assets/images/icons/person-icon.svg',
    altText: 'user-group',
    title: 'Book a Call',
    desc: 'book a 15-minute welcome call so we can match your child\'s goals and level.',
  },
  {
    bgColor: 'bg-[#E5E9FE]',
    imgSrc: '/assets/images/icons/phone-icon-purple.svg',
    altText: 'user-group',
    title: 'Choose Bundle & Set Up',
    desc: 'pick the pricing bundle that fits you, complete payment, and get the onboarding pack (calendar, tools, logins).',
  },
  {
    bgColor: 'bg-[#FDE7D9]',
    imgSrc: '/account-group.svg',
    altText: 'user-group',
    title: 'Start Classes',
    desc: 'join the first session, meet the trainer, and do a quick tech check. Your child gets access to the LMS and starter tasks.',
  },
  {
    bgColor: 'bg-[#FDDDFB]',
    imgSrc: '/assets/images/icons/union-icon.svg',
    altText: 'user-group',
    title: 'Track & Support',
    desc: 'follow weekly updates and term reports, and join our parent workshops to support learning at home.',
  },
];

const features = [
  'Interactive Live sessions',
  'Tech community',
  'Assignments',
  'Final projects',
  'Soft skills courses',
  'Parents workshops',
  'Regular reports for parents',
  'Summer and winter camps',
  'Internship program',
];

// const overviewData = [
//   {
//     text: "Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools to help students discover new interests, connect with mentors, and develop practical skills they can apply both in school and in the real world.",
//     imgSrc: "/tracks-overview.svg",
//   },
//   {
//     text: "Our mission is simple: to make modern, industry-relevant skills accessible and enjoyable for teenagers. We combine live, expert-led courses with interactive tools ",
//     imgSrc: "/certificate.svg",
//   },
// ];

export const metadata = {
  title: "For Parents | NGen School Support & Progress Tools",
  description: "At NGen, we support parents with detailed progress reports and free workshops. Stay involved and help your child succeed in coding, AI, and other digital skills.",
  keywords: ["online school for kids", "digital learning for children", "coding classes for kids", "AI courses for kids", "robotics for kids" ],
};


const NgenForParents = () => {
  const t = useTranslations('home.hero');
  
  return (
    <>
      <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
        <H2>for parents</H2>
        {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}
        <HowItWorksSection data={howItWorksData} />
        <Features features={features} imgSrc="/features-for-corporate.svg" title="Parents" />
        {/* <TracksOverviewSection data={overviewData} /> */}
        <TracksSection title="Our tracks" />
        {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}

        <ContactUs /> {/* TODO: adjust labels for Parents audience */}
      </PageWrapper>
      <CallToAction cta={t('cta')} />
    </>
  );
};

export default NgenForParents;
