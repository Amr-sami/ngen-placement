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
    desc: "Companies can register by filling out the subscription form throw the website.",
  },
  {
    bgColor: "bg-[#E5E9FE]",
    imgSrc: "/assets/images/icons/phone-icon-purple.svg",
    altText: "user-group",
    title: "Contact with the Organization",
    desc: "Our customer service team will reach out to schedule a meeting.",
  },
  {
    bgColor: "bg-[#FDE7D9]",
    imgSrc: "/account-group.svg",
    altText: "user-group",
    title: "Meeting Setup",
    desc: "During the meeting, we will present the available learning tracks and services.",
  },
  {
    bgColor: "bg-[#FDDDFB]",
    imgSrc: "/assets/images/icons/union-icon.svg",
    altText: "user-group",
    title: "Program Commencement",
    desc: "The learning process begins based on the selected tracks and levels.",
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

const NgenForSchools = () => {
  return (
    <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
      <H2>for schools</H2>
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}
      <HowItWorksSection data={howItWorksData} />
      <Features features={features} imgSrc="/features-for-corporate.svg" />
      {/* <TracksOverviewSection data={overviewData} /> */}
      <TracksSection title="Our tracks" />
      {/* TODO: USE THE HEADING COMPONENT INSTEAD OF THE h2 TAG */}

      <ContactUs />
    </PageWrapper>
  );
};

export default NgenForSchools;
