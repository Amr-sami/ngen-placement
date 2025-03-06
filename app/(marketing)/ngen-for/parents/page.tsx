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
    desc: "Create your account then create your child account",
  },
  {
    bgColor: "bg-[#E5E9FE]",
    imgSrc: "/assets/images/icons/phone-icon-purple.svg",
    altText: "user-group",
    title: "Choose the suitable track and pricing bundle",
    desc: "Subscribe on the favorite track for your children",
  },
  {
    bgColor: "bg-[#FDE7D9]",
    imgSrc: "/account-group.svg",
    altText: "user-group",
    title: "Track your child progress",
    desc: "through regular reports and performance reviews on their achievements and learning level.",
  },
  {
    bgColor: "bg-[#FDDDFB]",
    imgSrc: "/assets/images/icons/union-icon.svg",
    altText: "user-group",
    title: "Development workshop",
    desc: "With periodic sessions designed to improve parenting skills and assist parents in addressing their children's issues.",
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

const NgenForParents = () => {
  return (
    <PageWrapper classNames="px-5 py-6 md:px-12 md:pt-8 md:pb-6 xl:px-24 xl:pt-16 xl:pb-9 container mx-auto">
      <H2>for parents</H2>
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

export default NgenForParents;
