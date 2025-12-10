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
    title: "Registration",
    desc: "fill out the school form for booking a call.",
  },
  {
    bgColor: "bg-[#E5E9FE]",
    imgSrc: "/assets/images/icons/phone-icon-purple.svg",
    altText: "user-group",
    title: "Discovery & Needs Assessment",
    desc: "our business development team meets your leadership/ICT staff to map tracks, timetable, and goals.",
  },
  {
    bgColor: "bg-[#FDE7D9]",
    imgSrc: "/account-group.svg",
    altText: "user-group",
    title: "Proposal & Setup",
    desc: "receive a custom proposal (tracks, schedule, pricing bundle). On approval, we handle MoU/contract, calendar, LMS provisioning.",
  },
  {
    bgColor: "bg-[#FDDDFB]",
    imgSrc: "/assets/images/icons/union-icon.svg",
    altText: "user-group",
    title: "Program Launch & Support",
    desc: "kickoff sessions begin. You get attendance & progress reports, parent updates, teachers onboarding and access to capstones/competitions with a single point of contact for ongoing support.",
  },
];

const features = [
  "Interactive Live sessions",
  "Tech community",
  "Assignments",
  "Final projects",
  "Soft skills courses",
  "Teachers development workshops",
  "Parents workshops",
  "Regular reports for parents",
  "Summer and winter camps",
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
  title: "For Schools | Tech Learning Programs with LMS & Reports",
  description: "NGen partners with schools to provide engaging online tech learning with LMS tools, detailed student progress reports, and teacher training workshops.",
  keywords: ["online tech education for schools", "LMS for schools", "school learning platform kids", "teacher workshops", "student progress reports"],
};

const NgenForSchools = () => {
  return (
    <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
      <H2>for schools</H2>
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}
      <HowItWorksSection data={howItWorksData} />
      <Features features={features} imgSrc="/features-for-corporate.svg" title="Schools"/>
      {/* <TracksOverviewSection data={overviewData} /> */}
      {/* <TracksSection title="Our tracks" /> */}
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}

      <ContactUs /> {/* TODO: adjust labels for Schools audience */}
    </PageWrapper>
  );
};

export default NgenForSchools;
