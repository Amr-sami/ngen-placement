import {
  HowItWorksSection,
  Features,
  // TracksOverviewSection,
} from "@/components/pages/NgenFor";
import { ContactUs, PageWrapper, TracksSection } from "@/components/general";
import { H2 } from "@/components/general/Heading";

const howItWorksData = [
  {
    bgColor: "bg-[#EFE8FD]",
    imgSrc: "/assets/images/icons/person-icon.svg",
    altText: "user-group",
    title: "Registration / Inquiry",
    desc: "share a few details via the company form and book an intro call.",
  },
  {
    bgColor: "bg-[#E5E9FE]",
    imgSrc: "/assets/images/icons/phone-icon-purple.svg",
    altText: "user-group",
    title: "Discovery & Needs Assessment",
    desc: "we meet your HR/CSR team to map tracks, schedule, and goals (family day, summer camp, after-hours).",
  },
  {
    bgColor: "bg-[#FDE7D9]",
    imgSrc: "/account-group.svg",
    altText: "user-group",
    title: "Proposal, Agreement & Setup",
    desc: "receive a custom proposal with pricing bundles and deliverables. On approval, we handle agreement/MoU, calendar, LMS access, parental consent templates, and trainer assignment plus optional co-branding.",
  },
  {
    bgColor: "bg-[#FDDDFB]",
    imgSrc: "/assets/images/icons/union-icon.svg",
    altText: "user-group",
    title: "Program Launch & Reporting",
    desc: "kickoff sessions begin. You get attendance & progress reports, photo highlights, and CSR/ESG impact summaries. We support capstones/competitions and a final showcase for employees' families.",
  },
];

const features = [
  "Interactive Live sessions",
  "Tech community",
  "Assignments",
  "Final projects",
  "Soft skills courses",
  "Parents workshops",
  "Regular reports for parents",
  "Internship program",
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
  title: "For Corporates | Online Learning for Employees’ Children",
  description: "Boost employee satisfaction with NGen’s engaging tech education for kids. Affordable online programs in coding, robotics, and more – perfect for corporate benefits.",
  keywords: ["corporate training for kids", "employee kids learning", "tech courses for children", "online education for families", "corporate family programs"],
};


const NgenForCorporates = () => {
  return (
    <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
      <H2>for corporates</H2>
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}
      <HowItWorksSection data={howItWorksData} />
      <Features features={features} imgSrc="/features-for-corporate.svg" title="Corporates"/>
      {/* <TracksOverviewSection data={overviewData} /> */}
      {/* <TracksSection title="Our tracks" /> */}
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}

      <ContactUs /> {/* TODO: adjust labels for Corporates audience */}
    </PageWrapper>
  );
};

export default NgenForCorporates;
